import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import NotFoundPage from './NotFoundPage';
import ShareButton from '../components/share/ShareButton';
import { SITE } from '../config/site';
import { formatDate } from '../utils/formatDate';
import { getPostBySlug, incrementView, resolveCoverUrl } from '../lib/posts';
import { pickTranslation } from '../lib/postText';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './ArticleDetailPage.css';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation('articles');
  const { t: tc } = useTranslation('common');
  const lng = i18n.resolvedLanguage || i18n.language || 'en';
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [cover, setCover] = useState('');
  const [bumped, setBumped] = useState(false);
  // Re-observe reveal targets once the post loads (body renders after mount).
  useReveal([post]);

  useEffect(() => {
    let alive = true;
    setPost(undefined);
    getPostBySlug(slug)
      .then((p) => {
        if (!alive) return;
        setPost(p || null);
        if (p?.coverImageKey) resolveCoverUrl(p.coverImageKey).then((u) => alive && setCover(u));
      })
      .catch(() => alive && setPost(null));
    return () => {
      alive = false;
    };
  }, [slug]);

  // Count one view per session per post.
  useEffect(() => {
    if (!post?.id) return;
    const key = `article-viewed:${post.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setBumped(true);
    incrementView(post.id);
  }, [post]);

  const { title, excerpt, body } = pickTranslation(post || {}, lng);
  usePageMeta(post ? `${title} — ${SITE.name}` : undefined, post ? excerpt : undefined);

  if (post === undefined) return <div style={{ minHeight: '60svh' }} aria-hidden="true" />;
  if (post === null) return <NotFoundPage />;

  const paras = (body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const views = (post.viewCount || 0) + (bumped ? 1 : 0);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={tc('a11y.breadcrumb')}>
            <Link to="/">{tc('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/articles">{t('articles.ui.title')}</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          <p className="article-meta">
            {t('articles.ui.publishedOn', {
              date: formatDate((post.publishedAt || '').slice(0, 10), lng),
            })}
            {' · '}
            {t('articles.ui.byAdmin')}
            {' · '}
            <span className="article-detail-views">
              <FaEye size={12} aria-hidden="true" /> {t('articles.ui.viewsLabel', { count: views })}
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container article-layout">
          <article className="article-body">
            {cover && <img className="li-detail-cover" src={cover} alt="" data-reveal />}

            {paras.map((para, i) => (
              <p key={i} data-reveal style={{ '--i': Math.min(i, 6) }}>
                {para}
              </p>
            ))}

            <div className="li-detail-share" data-reveal>
              <span className="articles-tags-label">{t('articles.ui.shareLabel')}:</span>
              <ShareButton slug={post.slug} title={title} />
            </div>

            <p className="article-back">
              <Link to="/articles" className="link-gold">
                {t('articles.ui.backToArticles')}
              </Link>
            </p>
          </article>

          <aside className="article-cta" data-reveal>
            <h3>{tc('serviceDetail.ctaTitle')}</h3>
            <p>{tc('serviceDetail.ctaBody')}</p>
            <Link to="/contact-us" className="btn btn-gold btn-block">
              {tc('nav.bookConsultation')}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ArticleDetailPage;
