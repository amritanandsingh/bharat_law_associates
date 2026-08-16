import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaArrowRight, FaEye } from 'react-icons/fa';
import { SITE } from '../config/site';
import { formatDate } from '../utils/formatDate';
import { listPublishedPosts, resolveCoverUrl } from '../lib/posts';
import { pickTranslation } from '../lib/postText';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const { t, i18n } = useTranslation('articles');
  const { t: tc } = useTranslation('common');
  const lng = i18n.resolvedLanguage || i18n.language || 'en';
  const [posts, setPosts] = useState(null); // null = loading
  const [covers, setCovers] = useState({});
  const [query, setQuery] = useState('');
  // Re-observe reveal targets when posts load / the filter changes (cards
  // render after mount, so the initial observer never saw them).
  useReveal([posts, query]);
  usePageMeta(`${t('articles.ui.title')} — ${SITE.name}`, tc('meta.articlesDescription'));

  useEffect(() => {
    let alive = true;
    listPublishedPosts()
      .then((list) => {
        if (!alive) return;
        setPosts(list);
        list
          .filter((p) => p.coverImageKey)
          .forEach((p) =>
            resolveCoverUrl(p.coverImageKey).then((url) => {
              if (alive && url) setCovers((c) => ({ ...c, [p.id]: url }));
            })
          );
      })
      .catch(() => alive && setPosts([]));
    return () => {
      alive = false;
    };
  }, []);

  // One lowercased haystack per post for the active language. Rebuilt only when
  // the posts or the language change — not on every keystroke.
  const searchIndex = useMemo(() => {
    if (!posts) return [];
    return posts.map((p) => {
      const { title, excerpt, body } = pickTranslation(p, lng);
      return { post: p, haystack: `${title} ${excerpt} ${body}`.toLowerCase() };
    });
  }, [posts, lng]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts || [];
    return searchIndex.filter((e) => e.haystack.includes(q)).map((e) => e.post);
  }, [posts, searchIndex, query]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={tc('a11y.breadcrumb')}>
            <Link to="/">{tc('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('articles.ui.title')}</span>
          </nav>
          <h1>{t('articles.ui.title')}</h1>
          <p className="lede">{t('articles.ui.lede')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="articles-controls" data-reveal>
            <div className="articles-search">
              <FaSearch size={14} aria-hidden="true" />
              <input
                type="search"
                value={query}
                placeholder={t('articles.ui.searchPlaceholder')}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={t('articles.ui.searchPlaceholder')}
              />
            </div>
          </div>

          {posts && query.trim() && visible.length > 0 && (
            <p className="articles-count" role="status">
              {t('articles.ui.resultCount', { count: visible.length })}
            </p>
          )}

          {posts === null ? (
            <p className="articles-empty" role="status">
              {t('articles.ui.loading')}
            </p>
          ) : visible.length === 0 ? (
            <p className="articles-empty" role="status">
              {query ? t('articles.ui.noResults') : t('articles.ui.emptyState')}
            </p>
          ) : (
            <div className="articles-grid">
              {visible.map((p, i) => {
                const { title, excerpt } = pickTranslation(p, lng);
                const cover = covers[p.id];
                return (
                  <Link
                    key={p.id}
                    to={`/articles/${p.slug}`}
                    className="article-card li-card"
                    data-reveal
                    style={{ '--i': i % 6 }}
                  >
                    <span className={`li-card-cover ${cover ? '' : 'li-card-cover-empty'}`}>
                      {cover && <img src={cover} alt="" loading="lazy" />}
                    </span>
                    <time className="article-date" dateTime={(p.publishedAt || '').slice(0, 10)}>
                      {formatDate((p.publishedAt || '').slice(0, 10), lng)}
                    </time>
                    <h3>{title}</h3>
                    {excerpt && <p className="article-excerpt">{excerpt}</p>}
                    <div className="li-card-foot">
                      <span className="li-views">
                        <FaEye size={12} aria-hidden="true" />{' '}
                        {t('articles.ui.viewsLabel', { count: p.viewCount || 0 })}
                      </span>
                      <span className="article-more">
                        {t('articles.ui.readMore')}
                        <FaArrowRight className="icon-arrow" size={12} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ArticlesPage;
