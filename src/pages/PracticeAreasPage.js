import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCard from '../components/services/ServiceCard';
import { CATEGORIES, getServicesByCategory } from '../data/services';
import { SITE } from '../config/site';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './PracticeAreasPage.css';

const PracticeAreasPage = () => {
  const { t } = useTranslation(['common', 'services']);
  useReveal();
  usePageMeta(
    `${t('nav.practiceAreas')} — ${SITE.name}`,
    t('meta.practiceAreasDescription')
  );

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('nav.practiceAreas')}</span>
          </nav>
          <h1>{t('practiceAreas.title')}</h1>
          <p className="lede">{t('practiceAreas.lede')}</p>
        </div>
      </section>

      <nav className="pa-chips" aria-label={t('practiceAreas.categoriesLabel')}>
        <div className="container pa-chips-row">
          {CATEGORIES.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} className="pa-chip">
              {t(`services.categories.${cat.id}.name`, { ns: 'services' })}
            </a>
          ))}
        </div>
      </nav>

      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <section key={cat.id} id={cat.id} className="section pa-category">
            <div className="container">
              <div className="section-head pa-cat-head" data-reveal>
                <span className="pa-cat-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <div>
                  <h2>{t(`services.categories.${cat.id}.name`, { ns: 'services' })}</h2>
                  <p className="pa-cat-desc">
                    {t(`services.categories.${cat.id}.description`, { ns: 'services' })}
                  </p>
                </div>
              </div>
              <div className="pa-grid">
                {getServicesByCategory(cat.id).map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="cta-band">
        <div className="container cta-inner" data-reveal>
          <h2>{t('practiceAreas.ctaTitle')}</h2>
          <p>{t('practiceAreas.ctaBody')}</p>
          <Link to="/contact-us" className="btn btn-gold">
            {t('nav.bookConsultation')}
          </Link>
        </div>
      </section>
    </>
  );
};

export default PracticeAreasPage;
