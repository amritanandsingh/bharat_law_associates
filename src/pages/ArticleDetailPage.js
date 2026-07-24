import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotFoundPage from './NotFoundPage';
import { getArticleBySlug } from '../data/articles';
import { SITE } from '../config/site';
import { formatDate } from '../utils/formatDate';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './ArticleDetailPage.css';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation('articles');
  const { t: tc } = useTranslation('common');
  const article = getArticleBySlug(slug);
  useReveal();

  const title = article ? t(`articles.items.${article.id}.title`) : '';
  usePageMeta(
    article ? `${title} — ${SITE.name}` : undefined,
    article ? t(`articles.items.${article.id}.excerpt`) : undefined
  );

  if (!article) return <NotFoundPage />;

  const lng = i18n.resolvedLanguage || i18n.language || 'en';
  const body = t(`articles.items.${article.id}.body`, { returnObjects: true });

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
            {t('articles.ui.publishedOn', { date: formatDate(article.date, lng) })} · {t('articles.ui.byAdmin')}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container article-layout">
          <article className="article-body">
            {(Array.isArray(body) ? body : []).map((para, i) => (
              <p key={i} data-reveal style={{ '--i': Math.min(i, 6) }}>
                {para}
              </p>
            ))}

            <div className="article-tags" data-reveal>
              <span className="articles-tags-label">{t('articles.ui.tagsLabel')}:</span>
              {article.tagIds.map((tag) => (
                <Link key={tag} to="/articles" className="tag-pill">
                  {t(`articles.tags.${tag}`)}
                </Link>
              ))}
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
