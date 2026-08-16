// Data-access seam for the Articles feed. Pages never touch the Amplify
// client directly — they call these functions. Public reads use the guest
// (identity pool) auth mode; admin writes use the Cognito user pool.
import { generateClient } from 'aws-amplify/data';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { parseTranslations } from './postText';
import { readAuthMode } from './authMode';

const client = generateClient();

const throwIf = (errors) => {
  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '));
};

// ---- Public (guest) reads ----

export async function listPublishedPosts() {
  const { data, errors } = await client.models.Post.list({
    authMode: await readAuthMode(),
  });
  throwIf(errors);
  return [...(data ?? [])]
    .filter((p) => p.publishedAt)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}

export async function getPostBySlug(slug) {
  const { data, errors } = await client.models.Post.list({
    authMode: await readAuthMode(),
    filter: { slug: { eq: slug } },
    limit: 1,
  });
  throwIf(errors);
  return data?.[0] ?? null;
}

export async function incrementView(id) {
  try {
    await client.mutations.incrementViewCount(
      { postId: id },
      { authMode: await readAuthMode() },
    );
  } catch (e) {
    // View counting is non-critical — never block the page on it.
  }
}

export async function resolveCoverUrl(coverImageKey) {
  if (!coverImageKey) return '';
  try {
    const { url } = await getUrl({ path: coverImageKey });
    return url.toString();
  } catch (e) {
    return '';
  }
}

// ---- Admin (user pool) reads/writes ----

export async function listAllPosts() {
  const { data, errors } = await client.models.Post.list({ authMode: 'userPool' });
  throwIf(errors);
  return [...(data ?? [])].sort((a, b) =>
    (b.publishedAt || '').localeCompare(a.publishedAt || ''),
  );
}

export async function getPostById(id) {
  const { data, errors } = await client.models.Post.get(
    { id },
    { authMode: 'userPool' },
  );
  throwIf(errors);
  return data ?? null;
}

// Create or update a post. Only the source-language entry is written here; the
// other languages are filled by requestTranslation() (Amazon Translate).
export async function savePost({ id, slug, sourceLang, title, excerpt, body, coverImageKey }) {
  const sourceEntry = { title, excerpt, body };
  // `translations` is an AWSJSON field — AppSync expects a JSON string, and the
  // Amplify client does not serialize it for us, so stringify explicitly.
  if (id) {
    const existing = await getPostById(id);
    const merged = { ...parseTranslations(existing?.translations), [sourceLang]: sourceEntry };
    const { data, errors } = await client.models.Post.update(
      { id, slug, sourceLang, coverImageKey, translations: JSON.stringify(merged) },
      { authMode: 'userPool' },
    );
    throwIf(errors);
    return data;
  }
  const { data, errors } = await client.models.Post.create(
    {
      slug,
      sourceLang,
      coverImageKey,
      viewCount: 0,
      publishedAt: new Date().toISOString(),
      translations: JSON.stringify({ [sourceLang]: sourceEntry }),
      translatedLangs: [sourceLang],
    },
    { authMode: 'userPool' },
  );
  throwIf(errors);
  return data;
}

export async function deletePost(id) {
  const { errors } = await client.models.Post.delete({ id }, { authMode: 'userPool' });
  throwIf(errors);
}

// Fire Amazon Translate for a saved post (fills every supported language).
export async function requestTranslation(id) {
  const { data, errors } = await client.mutations.translatePost(
    { postId: id },
    { authMode: 'userPool' },
  );
  throwIf(errors);
  return data;
}

export async function uploadCover(file) {
  const safeName = file.name.replace(/[^\w.-]+/g, '-');
  const key = `media/posts/${Date.now()}-${safeName}`;
  await uploadData({
    path: key,
    data: file,
    options: { contentType: file.type },
  }).result;
  return key;
}
