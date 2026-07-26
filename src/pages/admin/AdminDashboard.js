import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listAllPosts, deletePost } from '../../lib/posts';
import { pickTranslation } from '../../lib/postText';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    listAllPosts()
      .then(setPosts)
      .catch((e) => {
        setPosts([]);
        setError(e.message || 'Failed to load posts.');
      });
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(id);
      setPosts((cur) => (cur || []).filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message || 'Failed to delete.');
    }
  };

  return (
    <>
      <div className="admin-head">
        <h1>Articles</h1>
        <button type="button" className="btn btn-gold" onClick={() => navigate('/admin/new')}>
          + New post
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {posts === null ? (
        <p className="admin-note">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="admin-note">No posts yet. Create your first one.</p>
      ) : (
        <div className="admin-post-list">
          {posts.map((p) => {
            const { title } = pickTranslation(p, p.sourceLang || 'en');
            return (
              <div key={p.id} className="admin-post-row">
                <div>
                  <h3>{title || p.slug}</h3>
                  <span className="admin-post-meta">
                    /{p.slug} · {(p.viewCount || 0)} views · source: {p.sourceLang} ·{' '}
                    {(p.translatedLangs || []).length} language(s)
                  </span>
                </div>
                <div className="admin-row-actions">
                  <Link className="admin-btn" to={`/admin/edit/${p.id}`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => onDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
