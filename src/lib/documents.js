// Data-access seam for the Documents catalogue — legal drafts and formats sold
// to other advocates. Pages never touch the Amplify client directly.
//
// Only a SAMPLE PAGE of each document is uploaded, to a world-readable prefix.
// The full document is sent privately after the buyer makes contact, so there
// is nothing here to paywall.
import { generateClient } from 'aws-amplify/data';
import { getUrl, uploadData, remove } from 'aws-amplify/storage';
import { readAuthMode } from './authMode';

// Created on first use, not at import time. HomePage is eagerly bundled (not
// lazy like ArticlesPage), so a module-scope generateClient() would run during
// app boot and could take the whole home page down if Amplify were misconfigured.
let cachedClient;
const client = () => {
  if (!cachedClient) cachedClient = generateClient();
  return cachedClient;
};

const throwIf = (errors) => {
  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '));
};

// Lower sortOrder first; ties broken by newest first.
const byDisplayOrder = (a, b) =>
  (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
  (b.publishedAt || '').localeCompare(a.publishedAt || '');

// ---- Public (guest) reads ----

export async function listDocuments() {
  const { data, errors } = await client().models.Document.list({
    authMode: await readAuthMode(),
  });
  throwIf(errors);
  return [...(data ?? [])].filter((d) => d.publishedAt).sort(byDisplayOrder);
}

// Presigned and short-lived (~15 min), so resolve at click/render time rather
// than caching the URL.
export async function resolvePreviewUrl(previewKey) {
  if (!previewKey) return '';
  try {
    const { url } = await getUrl({ path: previewKey });
    return url.toString();
  } catch (e) {
    return '';
  }
}

// ---- Admin (user pool) reads/writes ----

export async function listAllDocuments() {
  const { data, errors } = await client().models.Document.list({ authMode: 'userPool' });
  throwIf(errors);
  return [...(data ?? [])].sort(byDisplayOrder);
}

export async function getDocumentById(id) {
  const { data, errors } = await client().models.Document.get(
    { id },
    { authMode: 'userPool' },
  );
  throwIf(errors);
  return data ?? null;
}

export async function saveDocument({
  id,
  title,
  description,
  priceInr,
  previewKey,
  previewContentType,
  sortOrder,
}) {
  const fields = {
    title,
    description: description || '',
    // Empty input means "Price on request", stored as null rather than 0.
    priceInr: Number.isFinite(priceInr) && priceInr > 0 ? priceInr : null,
    previewKey: previewKey || '',
    previewContentType: previewContentType || '',
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  };

  if (id) {
    const { data, errors } = await client().models.Document.update(
      { id, ...fields },
      { authMode: 'userPool' },
    );
    throwIf(errors);
    return data;
  }
  const { data, errors } = await client().models.Document.create(
    { ...fields, publishedAt: new Date().toISOString() },
    { authMode: 'userPool' },
  );
  throwIf(errors);
  return data;
}

// Deletes the record AND its sample page, so the bucket does not accumulate
// orphaned objects.
export async function deleteDocument(id) {
  const existing = await getDocumentById(id);
  const { errors } = await client().models.Document.delete({ id }, { authMode: 'userPool' });
  throwIf(errors);
  if (existing?.previewKey) {
    try {
      await remove({ path: existing.previewKey });
    } catch (e) {
      // The record is already gone; a leftover object is not worth failing on.
    }
  }
}

export async function uploadDocumentPreview(file) {
  const safeName = file.name.replace(/[^\w.-]+/g, '-');
  const key = `media/documents/${Date.now()}-${safeName}`;
  await uploadData({
    path: key,
    data: file,
    options: { contentType: file.type },
  }).result;
  return key;
}
