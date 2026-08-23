// Data-access seam for the public Courts listing. Public reads use the same
// guest/user-pool selection as the other feeds; writes remain admin-only.
import { generateClient } from 'aws-amplify/data';
import { getUrl, remove } from 'aws-amplify/storage';
import { readAuthMode } from './authMode';
import { uploadPublicMedia } from './media';

let cachedClient;
const client = () => {
  if (!cachedClient) cachedClient = generateClient();
  return cachedClient;
};

const throwIf = (errors) => {
  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '));
};

const byName = (a, b) => (a.name || '').localeCompare(b.name || '');

// ---- Public (guest) reads ----

export async function listCourts() {
  const { data, errors } = await client().models.Court.list({
    authMode: await readAuthMode(),
  });
  throwIf(errors);
  return [...(data ?? [])].sort(byName);
}

export async function resolveCourtImageUrl(imageKey) {
  if (!imageKey) return '';
  try {
    const { url } = await getUrl({ path: imageKey });
    return url.toString();
  } catch (e) {
    return '';
  }
}

// ---- Admin (user pool) reads/writes ----

export async function listAllCourts() {
  const { data, errors } = await client().models.Court.list({ authMode: 'userPool' });
  throwIf(errors);
  return [...(data ?? [])].sort(byName);
}

export async function getCourtById(id) {
  const { data, errors } = await client().models.Court.get(
    { id },
    { authMode: 'userPool' },
  );
  throwIf(errors);
  return data ?? null;
}

export async function saveCourt({ id, name, address, imageKey }) {
  const fields = { name, address, imageKey };
  if (id) {
    const { data, errors } = await client().models.Court.update(
      { id, ...fields },
      { authMode: 'userPool' },
    );
    throwIf(errors);
    return data;
  }
  const { data, errors } = await client().models.Court.create(fields, {
    authMode: 'userPool',
  });
  throwIf(errors);
  return data;
}

export async function deleteCourt(id) {
  const existing = await getCourtById(id);
  const { errors } = await client().models.Court.delete({ id }, { authMode: 'userPool' });
  throwIf(errors);
  if (existing?.imageKey) {
    try {
      await remove({ path: existing.imageKey });
    } catch (e) {
      // The record is already gone; a leftover object is not worth failing on.
    }
  }
}

export async function uploadCourtImage(file) {
  return uploadPublicMedia(file, 'courts');
}
