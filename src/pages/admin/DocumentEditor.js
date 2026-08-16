import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getDocumentById,
  saveDocument,
  uploadDocumentPreview,
  resolvePreviewUrl,
} from '../../lib/documents';

const EMPTY = {
  title: '',
  description: '',
  priceInr: '',
  sortOrder: '0',
  previewKey: '',
  previewContentType: '',
};

const DocumentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [currentSampleUrl, setCurrentSampleUrl] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDocumentById(id)
      .then((d) => {
        if (!d) return;
        setForm({
          title: d.title || '',
          description: d.description || '',
          priceInr: d.priceInr == null ? '' : String(d.priceInr),
          sortOrder: String(d.sortOrder ?? 0),
          previewKey: d.previewKey || '',
          previewContentType: d.previewContentType || '',
        });
        if (d.previewKey) resolvePreviewUrl(d.previewKey).then(setCurrentSampleUrl);
      })
      .catch((e) => setError(e.message || 'Failed to load document.'));
  }, [id]);

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let { previewKey, previewContentType } = form;
      if (file) {
        setStatus('Uploading sample page…');
        previewKey = await uploadDocumentPreview(file);
        previewContentType = file.type || '';
      }
      setStatus('Saving document…');
      await saveDocument({
        id,
        title: form.title,
        description: form.description,
        priceInr: form.priceInr === '' ? null : Number(form.priceInr),
        sortOrder: form.sortOrder === '' ? 0 : Number(form.sortOrder),
        previewKey,
        previewContentType,
      });
      navigate('/admin/documents');
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
        <h1>{id ? 'Edit document' : 'New document'}</h1>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor="de-title">Document name</label>
          <input id="de-title" value={form.title} onChange={set('title')} required />
        </div>

        <div className="admin-field">
          <label htmlFor="de-desc">What this document is about</label>
          <textarea
            id="de-desc"
            value={form.description}
            onChange={set('description')}
            placeholder="A short description shown on the card — what the draft covers and who it suits."
          />
        </div>

        <div className="admin-field">
          <label htmlFor="de-price">Price (₹)</label>
          <input
            id="de-price"
            type="number"
            min="0"
            step="1"
            value={form.priceInr}
            onChange={set('priceInr')}
            placeholder="e.g. 1500"
          />
          <span className="admin-note">Leave blank to show “Price on request”.</span>
        </div>

        <div className="admin-field">
          <label htmlFor="de-order">Display order</label>
          <input
            id="de-order"
            type="number"
            step="1"
            value={form.sortOrder}
            onChange={set('sortOrder')}
          />
          <span className="admin-note">Lower numbers appear first. Ties show newest first.</span>
        </div>

        <div className="admin-field">
          <label htmlFor="de-sample">Sample page (first or second page only)</label>
          <input
            id="de-sample"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span className="admin-note">
            This file is <strong>publicly visible</strong> — upload only the sample page you are happy
            for anyone to read, never the full document. Buyers receive the full document from you
            directly after they get in touch. Images show as a thumbnail; PDFs show a file icon.
          </span>
          {form.previewKey && !file && (
            <span className="admin-note">
              Current sample kept unless you choose a new one.{' '}
              {currentSampleUrl && (
                <a href={currentSampleUrl} target="_blank" rel="noopener noreferrer">
                  View current sample
                </a>
              )}
            </span>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="btn btn-gold" disabled={busy}>
            {busy ? 'Working…' : id ? 'Save changes' : 'Publish document'}
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => navigate('/admin/documents')}
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

export default DocumentEditor;
