import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { LAWYERS } from '../data/lawyers';
import { SITE } from '../config/site';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './AboutPage.css';

const AboutPage = () => {
  const { t } = useTranslation();
  useReveal();
  usePageMeta(`${t('nav.aboutUs')} — ${SITE.name}`, t('meta.aboutDescription'));

  const founder = LAWYERS.find((l) => l.founder);
  const values = ['integrity', 'clarity', 'commitment'];
  const credentials = t('about.founderCredentials', { returnObjects: true });

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('nav.aboutUs')}</span>
          </nav>
          <h1>{t('about.title')}</h1>
          <p className="lede">{t('about.lede')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-founder">
          <div className="about-founder-photo" data-reveal>
            <span className="about-founder-avatar" aria-hidden="true">
              {founder.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </span>
          </div>
          <div data-reveal>
            <span className="overline">{t('about.founderOverline')}</span>
            <h2>{founder.name}</h2>
            <p className="about-founder-qual">{founder.qualification}</p>
            <p className="about-founder-bio">{t('about.founderBio')}</p>
            <ul className="about-credentials">
              {(Array.isArray(credentials) ? credentials : []).map((c) => (
                <li key={c}>
                  <FaCheckCircle aria-hidden="true" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section about-story">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('about.storyOverline')}</span>
            <h2>{t('about.storyTitle')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="about-story-copy" data-reveal>
            <p>{t('about.storyBody1')}</p>
            <p>{t('about.storyBody2')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('about.valuesOverline')}</span>
            <h2>{t('about.valuesTitle')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="about-values">
            {values.map((v, i) => (
              <div key={v} className="about-value" data-reveal style={{ '--i': i }}>
                <h4>{t(`about.values.${v}.title`)}</h4>
                <p>{t(`about.values.${v}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-team">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('home.team.overline')}</span>
            <h2>{t('about.teamTitle')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="team-grid">
            {LAWYERS.map((lawyer, i) => (
              <div key={lawyer.id} className="lawyer-card" data-reveal style={{ '--i': i }}>
                <span className="lawyer-avatar" aria-hidden="true">
                  {lawyer.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <h4>{lawyer.name}</h4>
                <p className="lawyer-role">
                  {lawyer.founder ? t('about.founderRole') : t('about.advocateRole')}
                </p>
                <p className="lawyer-qual">{lawyer.qualification}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner" data-reveal>
          <h2>{t('about.ctaTitle')}</h2>
          <Link to="/contact-us" className="btn btn-gold">
            {t('nav.bookConsultation')}
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
