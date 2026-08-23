import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LAWYERS } from '../data/lawyers';
import { SITE } from '../config/site';
import LawyerCard from '../components/team/LawyerCard';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './AboutPage.css';

const AboutPage = () => {
  const { t } = useTranslation();
  useReveal();
  usePageMeta(`${t('nav.aboutUs')} — ${SITE.name}`, t('meta.aboutDescription'));

  const values = ['integrity', 'clarity', 'commitment'];
  const approachSteps = ['understand', 'analyse', 'prepare', 'represent'];
  const storyBody = t('about.storyBody', { returnObjects: true });
  const commitmentBody = t('about.commitmentBody', { returnObjects: true });

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

      <section className="section about-story">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('about.storyOverline')}</span>
            <h2>{t('about.storyTitle')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="about-story-copy" data-reveal>
            {(Array.isArray(storyBody) ? storyBody : []).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('about.approachOverline')}</span>
            <h2>{t('about.approachTitle')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="about-approach">
            {approachSteps.map((s, i) => (
              <div key={s} className="about-step" data-reveal style={{ '--i': i }}>
                <span className="about-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4>{t(`about.approach.${s}.title`)}</h4>
                <p>{t(`about.approach.${s}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-commitment">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('about.commitmentOverline')}</span>
            <h2>{t('about.commitmentTitle')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="about-story-copy" data-reveal>
            {(Array.isArray(commitmentBody) ? commitmentBody : []).map((p) => (
              <p key={p}>{p}</p>
            ))}
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
              <LawyerCard key={lawyer.id} lawyer={lawyer} index={i} />
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
