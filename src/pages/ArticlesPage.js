import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaTags, FaArrowRight } from 'react-icons/fa';
import { ARTICLES, getAllTagIds } from '../data/articles';
import { SITE } from '../config/site';
import { formatDate } from '../utils/formatDate';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const { t, i18n } = useTranslation('articles');
  const { t: tc } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [activeTag, setActiveTag] = useState('');
  useReveal();
  usePageMeta(`${t('articles.ui.title')} — ${SITE.name}`, tc('meta.articlesDescription'));

  const lng = i18n.resolvedLanguage || i18n.language || 'en';
  const tagIds = getAllTagIds();

  const searchIndex = useMemo(() => {
    const map = {};
    ARTICLES.forEach((a) => {
      const body = t(`articles.items.${a.id}.body`, { returnObjects: true });
      const parts = [
        t(`articles.items.${a.id}.title`),
        t(`articles.items.${a.id}.excerpt`),
        Array.isArray(body) ? body.join(' ') : '',
        a.tagIds.map((tag) => t(`articles.tags.${tag}`)).join(' '),
      ];
      map[a.id] = parts.join(' ').toLowerCase();
    });
    return map;
    // Re-index whenever the active language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (activeTag && !a.tagIds.includes(activeTag)) return false;
      if (q && !searchIndex[a.id].includes(q)) return false;
      return true;
    }).sort((a, b) =>
      sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
  }, [query, activeTag, sort, searchIndex]);

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
            <label className="articles-sort">
              <span className="visually-hidden">{t('articles.ui.sortNewest')}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">{t('articles.ui.sortNewest')}</option>
                <option value="oldest">{t('articles.ui.sortOldest')}</option>
              </select>
            </label>
          </div>

          <div className="articles-tags" data-reveal>
            <span className="articles-tags-label">
              <FaTags size={12} aria-hidden="true" /> {t('articles.ui.tagsLabel')}:
            </span>
            <button
              type="button"
              className={`tag-chip ${activeTag === '' ? 'tag-chip-active' : ''}`}
              onClick={() => setActiveTag('')}
            >
              {t('articles.ui.allTags')}
            </button>
            {tagIds.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-chip ${activeTag === tag ? 'tag-chip-active' : ''}`}
                onClick={() => setActiveTag((cur) => (cur === tag ? '' : tag))}
              >
                {t(`articles.tags.${tag}`)}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="articles-empty" role="status">
              {t('articles.ui.noResults')}
            </p>
          ) : (
            <div className="articles-grid">
              {visible.map((a, i) => (
                <Link
                  key={a.id}
                  to={`/articles/${a.id}`}
                  className="article-card"
                  data-reveal
                  style={{ '--i': i % 6 }}
                >
                  <time className="article-date" dateTime={a.date}>
                    {formatDate(a.date, lng)}
                  </time>
                  <h3>{t(`articles.items.${a.id}.title`)}</h3>
                  <p className="article-excerpt">{t(`articles.items.${a.id}.excerpt`)}</p>
                  <div className="article-card-tags">
                    {a.tagIds.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-pill">
                        {t(`articles.tags.${tag}`)}
                      </span>
                    ))}
                  </div>
                  <span className="article-more">
                    {t('articles.ui.readMore')}
                    <FaArrowRight className="icon-arrow" size={12} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ArticlesPage;
