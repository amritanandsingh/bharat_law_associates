import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById, savePost, requestTranslation, uploadCover } from '../../lib/posts';
import { pickTranslation } from '../../lib/postText';
import { TRANSLATE_SUPPORTED, getLanguage } from '../../i18n/languages';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

const EMPTY = { slug: '', sourceLang: 'en', title: '', excerpt: '', body: '', coverImageKey: '' };

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPostById(id)
      .then((p) => {
        if (!p) return;
        const src = p.sourceLang || 'en';
        const { title, excerpt, body } = pickTranslation(p, src);
        setForm({ slug: p.slug, sourceLang: src, title, excerpt, body, coverImageKey: p.coverImageKey || '' });
        setSlugTouched(true);
      })
      .catch((e) => setError(e.message || 'Failed to load post.'));
  }, [id]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'title' && !slugTouched && !id) next.slug = slugify(value);
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let coverImageKey = form.coverImageKey;
      if (file) {
        setStatus('Uploading cover image…');
        coverImageKey = await uploadCover(file);
      }
      setStatus('Saving post…');
      const saved = await savePost({ id, ...form, coverImageKey });
      setStatus('Translating into supported languages…');
      try {
        await requestTranslation(saved.id);
      } catch (te) {
        // Post is saved in its source language even if translation fails.
        setError(`Saved, but translation failed: ${te.message}. You can re-save to retry.`);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Save failed.');
      setStatus('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="admin-head">
        <h1>{id ? 'Edit post' : 'New post'}</h1>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor="pe-lang">Source language (the language you are writing in)</label>
          <select id="pe-lang" value={form.sourceLang} onChange={set('sourceLang')}>
            {TRANSLATE_SUPPORTED.map((code) => {
              const meta = getLanguage(code);
              return (
                <option key={code} value={code}>
                  {meta ? `${meta.englishName} (${meta.nativeName})` : code}
                </option>
              );
            })}
          </select>
          <span className="admin-note">
            Only Amazon-Translate-supported languages can be a source. Other languages fall back to
            Hindi/English for readers.
          </span>
        </div>

        <div className="admin-field">
          <label htmlFor="pe-title">Title</label>
          <input id="pe-title" value={form.title} onChange={set('title')} required />
        </div>

        <div className="admin-field">
          <label htmlFor="pe-slug">URL slug</label>
          <input
            id="pe-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
            required
          />
          <span className="admin-note">Link: /articles/{form.slug || '…'}</span>
        </div>

        <div className="admin-field">
          <label htmlFor="pe-excerpt">Excerpt (short summary shown on cards)</label>
          <input id="pe-excerpt" value={form.excerpt} onChange={set('excerpt')} />
        </div>

        <div className="admin-field">
          <label htmlFor="pe-body">Body</label>
          <textarea
            id="pe-body"
            value={form.body}
            onChange={set('body')}
            placeholder="Write the post. Separate paragraphs with a blank line."
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="pe-cover">Cover image</label>
          <input
            id="pe-cover"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {form.coverImageKey && !file && (
            <span className="admin-note">Current image kept unless you choose a new one.</span>
          )}
        </div>

        <p className="admin-note">
          On save, the title, excerpt and body are auto-translated into all supported languages by
          Amazon Translate. You only edit the source language here.
        </p>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="btn btn-gold" disabled={busy}>
            {busy ? 'Working…' : id ? 'Save changes' : 'Publish post'}
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => navigate('/admin')}
            disabled={busy}
          >
            Cancel
          </button>
          {status && <span className="admin-status">{status}</span>}
        </div>
      </form>
    </>
  );
};

export default PostEditor;
