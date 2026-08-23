import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCourt, listAllCourts } from '../../lib/courts';

const CourtsDashboard = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    listAllCourts()
      .then(setCourts)
      .catch((e) => {
        setCourts([]);
        setError(e.message || 'Failed to load courts.');
      });
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this court and its image? This cannot be undone.')) return;
    try {
      await deleteCourt(id);
      setCourts((cur) => (cur || []).filter((court) => court.id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete.');
    }
  };

  return (
    <>
      <div className="admin-head">
        <h1>Courts</h1>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => navigate('/admin/courts/new')}
        >
          + New court
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {courts === null ? (
        <p className="admin-note">Loading…</p>
      ) : courts.length === 0 ? (
        <p className="admin-note">No courts yet. Add your first one.</p>
      ) : (
        <div className="admin-post-list">
          {courts.map((court) => (
            <div key={court.id} className="admin-post-row">
              <div>
                <h3>{court.name}</h3>
                <span className="admin-post-meta">
                  {court.address} · {court.imageKey ? 'image uploaded' : 'no image'}
                </span>
              </div>
              <div className="admin-row-actions">
                <Link className="admin-btn" to={`/admin/courts/edit/${court.id}`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger"
                  onClick={() => onDelete(court.id)}
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

export default CourtsDashboard;
