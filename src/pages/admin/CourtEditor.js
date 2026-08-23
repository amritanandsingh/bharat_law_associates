import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCourtById,
  resolveCourtImageUrl,
  saveCourt,
  uploadCourtImage,
} from '../../lib/courts';

const EMPTY = { name: '', address: '', imageKey: '' };

const CourtEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCourtById(id)
      .then((court) => {
        if (!court) return;
        setForm({
          name: court.name || '',
          address: court.address || '',
          imageKey: court.imageKey || '',
        });
        if (court.imageKey) resolveCourtImageUrl(court.imageKey).then(setCurrentImageUrl);
      })
      .catch((e) => setError(e.message || 'Failed to load court.'));
  }, [id]);

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let { imageKey } = form;
      if (file) {
        if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
        setStatus('Uploading court image…');
        imageKey = await uploadCourtImage(file);
      }
      if (!imageKey) throw new Error('Please choose a court image.');
      setStatus('Saving court…');
      await saveCourt({ id, name: form.name, address: form.address, imageKey });
      navigate('/admin/courts');
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
        <h1>{id ? 'Edit court' : 'New court'}</h1>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor="ce-name">Court Name</label>
          <input id="ce-name" value={form.name} onChange={set('name')} required />
        </div>

        <div className="admin-field">
          <label htmlFor="ce-address">Court Address</label>
          <textarea id="ce-address" value={form.address} onChange={set('address')} required />
        </div>

        <div className="admin-field">
          <label htmlFor="ce-image">Court Image</label>
          <input
            id="ce-image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required={!form.imageKey}
          />
          {form.imageKey && !file && (
            <span className="admin-note">
              Current image kept unless you choose a new one.{' '}
              {currentImageUrl && (
                <a href={currentImageUrl} target="_blank" rel="noopener noreferrer">
                  View current image
                </a>
              )}
            </span>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="btn btn-gold" disabled={busy}>
            {busy ? 'Working…' : id ? 'Save changes' : 'Add court'}
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => navigate('/admin/courts')}
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

export default CourtEditor;
