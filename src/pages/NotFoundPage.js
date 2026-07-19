import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogoMark } from '../components/layout/Logo';
import { SITE } from '../config/site';
import usePageMeta from '../hooks/usePageMeta';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { t } = useTranslation();
  usePageMeta(`404 — ${SITE.name}`);

  return (
    <section className="nf">
      <div className="nf-mark" aria-hidden="true">
        <LogoMark size={320} variant="light" />
      </div>
      <div className="nf-content">
        <p className="nf-code">404</p>
        <h1>{t('notFound.title')}</h1>
        <p className="nf-body">{t('notFound.body')}</p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-gold">
            {t('notFound.backHome')}
          </Link>
          <Link to="/contact-us" className="btn btn-ghost-dark">
            {t('nav.contactUs')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
