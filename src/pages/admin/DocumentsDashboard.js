import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listAllDocuments, deleteDocument } from '../../lib/documents';
import { formatPrice } from '../../utils/formatPrice';

const DocumentsDashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    listAllDocuments()
      .then(setDocuments)
      .catch((e) => {
        setDocuments([]);
        setError(e.message || 'Failed to load documents.');
      });
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this document and its sample page? This cannot be undone.')) return;
    try {
      await deleteDocument(id);
      setDocuments((cur) => (cur || []).filter((d) => d.id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete.');
    }
  };

  return (
    <>
      <div className="admin-head">
        <h1>Documents</h1>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => navigate('/admin/documents/new')}
        >
          + New document
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {documents === null ? (
        <p className="admin-note">Loading…</p>
      ) : documents.length === 0 ? (
        <p className="admin-note">No documents yet. Add your first one.</p>
      ) : (
        <div className="admin-post-list">
          {documents.map((d) => (
            <div key={d.id} className="admin-post-row">
              <div>
                <h3>{d.title}</h3>
                <span className="admin-post-meta">
                  {formatPrice(d.priceInr, 'en') || 'Price on request'} ·{' '}
                  {d.previewKey ? 'sample page uploaded' : 'no sample page'} · order {d.sortOrder ?? 0}
                </span>
              </div>
              <div className="admin-row-actions">
                <Link className="admin-btn" to={`/admin/documents/edit/${d.id}`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger"
                  onClick={() => onDelete(d.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DocumentsDashboard;
