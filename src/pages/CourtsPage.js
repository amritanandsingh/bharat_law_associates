import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE } from '../config/site';
import { listCourts } from '../lib/courts';
import CourtCard from '../components/courts/CourtCard';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './DocumentsPage.css';

const CourtsPage = () => {
  const { t } = useTranslation();
  const [courts, setCourts] = useState(null);
  useReveal([courts]);
  usePageMeta(`${t('nav.courts')} — ${SITE.name}`, t('meta.courtsDescription'));

  useEffect(() => {
    let alive = true;
    listCourts()
      .then((list) => alive && setCourts(list))
      .catch(() => alive && setCourts([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('nav.courts')}</span>
          </nav>
          <h1>{t('nav.courts')}</h1>
          <p className="lede">{t('courts.lede')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {courts === null ? (
            <p className="documents-empty" role="status">
              {t('courts.loading')}
            </p>
          ) : courts.length === 0 ? (
            <p className="documents-empty" role="status">
              {t('courts.emptyState')}
            </p>
          ) : (
            <div className="documents-grid">
              {courts.map((court, i) => (
                <CourtCard key={court.id} court={court} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CourtsPage;
