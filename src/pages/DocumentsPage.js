import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE } from '../config/site';
import { listDocuments } from '../lib/documents';
import DocumentCard from '../components/documents/DocumentCard';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState(null); // null = loading
  // Cards render after mount, so the observer needs re-running once they exist.
  useReveal([documents]);
  usePageMeta(`${t('documents.title')} — ${SITE.name}`, t('meta.documentsDescription'));

  useEffect(() => {
    let alive = true;
    listDocuments()
      .then((list) => alive && setDocuments(list))
      .catch(() => alive && setDocuments([]));
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
            <span>{t('documents.title')}</span>
          </nav>
          <h1>{t('documents.title')}</h1>
          <p className="lede">{t('documents.lede')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {documents === null ? (
            <p className="documents-empty" role="status">
              {t('documents.loading')}
            </p>
          ) : documents.length === 0 ? (
            <p className="documents-empty" role="status">
              {t('documents.emptyState')}
            </p>
          ) : (
            <div className="documents-grid">
              {documents.map((doc, i) => (
                <DocumentCard key={doc.id} document={doc} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DocumentsPage;
