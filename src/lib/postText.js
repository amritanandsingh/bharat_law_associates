import { POST_FALLBACK } from '../i18n/languages';

const EMPTY = { title: '', excerpt: '', body: '' };

// The `translations` field is AWSJSON. The Amplify client does not auto-parse it,
// so it can arrive as a JSON string (from AppSync) or already as an object.
// Normalize to a plain object either way.
export function parseTranslations(value) {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) || {};
    } catch (e) {
      return {};
    }
  }
  return value;
}

/**
 * Pick the best available translation of a post for the active language.
 * Fallback order: requested language → its POST_FALLBACK chain (e.g. hi for
 * Devanagari languages) → English → the post's source language → any entry.
 */
export function pickTranslation(post, lng) {
  const map = parseTranslations(post && post.translations);
  const chain = [lng, ...(POST_FALLBACK[lng] || []), 'en', post && post.sourceLang];
  for (const code of chain) {
    const entry = code && map[code];
    if (entry && (entry.title || entry.body)) return entry;
  }
  const first = Object.keys(map)[0];
  return first ? map[first] : EMPTY;
}
