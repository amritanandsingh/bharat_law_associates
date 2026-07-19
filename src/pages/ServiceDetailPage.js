import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaPhoneAlt } from 'react-icons/fa';
import NotFoundPage from './NotFoundPage';
import { getServiceBySlug, getServicesByCategory } from '../data/services';
import { SITE } from '../config/site';
import { buildTelUrl } from '../utils/contactLinks';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './ServiceDetailPage.css';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation(['common', 'services']);
  const service = getServiceBySlug(slug);
  useReveal();

  const name = service
    ? t(`services.items.${service.id}.name`, { ns: 'services' })
    : '';
  usePageMeta(
    service ? `${name} — ${SITE.name}` : undefined,
    service ? t(`services.items.${service.id}.summary`, { ns: 'services' }) : undefined
  );

  if (!service) return <NotFoundPage />;

  const bullets = t(`services.items.${service.id}.bullets`, {
    ns: 'services',
    returnObjects: true,
  });
  const related = getServicesByCategory(service.category).filter(
    (s) => s.id !== service.id
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/practice-areas">{t('nav.practiceAreas')}</Link>
            <span aria-hidden="true">/</span>
            <span>{name}</span>
          </nav>
          <h1>{name}</h1>
          <Link
            to={`/practice-areas#${service.category}`}
            className="sd-category-chip"
          >
            {t(`services.categories.${service.category}.name`, { ns: 'services' })}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container sd-layout">
          <article className="sd-body">
            <p className="sd-intro" data-reveal>
              {t(`services.items.${service.id}.description`, { ns: 'services' })}
            </p>

            <h2 data-reveal>{t('serviceDetail.howWeHelp')}</h2>
            <ul className="sd-checklist">
              {(Array.isArray(bullets) ? bullets : []).map((b, i) => (
                <li key={b} data-reveal style={{ '--i': i }}>
                  <FaCheckCircle aria-hidden="true" /> {b}
                </li>
              ))}
            </ul>

            {related.length > 0 && (
              <>
                <h2 data-reveal>{t('serviceDetail.relatedAreas')}</h2>
                <div className="sd-related" data-reveal>
                  {related.map((s) => (
                    <Link
                      key={s.id}
                      to={`/practice-areas/${s.id}`}
                      className="pa-chip"
                    >
                      {t(`services.items.${s.id}.name`, { ns: 'services' })}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>

          <aside className="sd-sidebar">
            <div className="sd-cta-card" data-reveal>
              <h3>{t('serviceDetail.ctaTitle')}</h3>
              <p>{t('serviceDetail.ctaBody')}</p>
              <Link to="/contact-us" className="btn btn-gold btn-block">
                {t('nav.bookConsultation')}
              </Link>
              <a
                href={buildTelUrl(SITE.phones[0].e164)}
                className="sd-cta-phone ltr-isolate"
              >
                <FaPhoneAlt size={14} aria-hidden="true" /> {SITE.phones[0].display}
              </a>
              <p className="sd-cta-note">{t('serviceDetail.responseNote')}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
