import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import {
  FaPhoneAlt,
  FaBalanceScale,
  FaHandHoldingHeart,
  FaUserTie,
  FaComments,
} from 'react-icons/fa';
import ServiceCard from '../components/services/ServiceCard';
import { LogoMark } from '../components/layout/Logo';
import { getFeaturedServices } from '../data/services';
import { LAWYERS } from '../data/lawyers';
import { SITE } from '../config/site';
import { buildTelUrl } from '../utils/contactLinks';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './HomePage.css';

const useCountUp = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const els = root.querySelectorAll('[data-count]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (el) => {
      const target = Number(el.dataset.count);
      if (reduced || !Number.isFinite(target)) {
        el.textContent = el.dataset.suffix ? `${target}${el.dataset.suffix}` : target;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(target * eased)}${el.dataset.suffix || ''}`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            els.forEach(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return ref;
};

const HomePage = () => {
  const { t } = useTranslation();
  const statsRef = useCountUp();
  useReveal();
  usePageMeta(
    `${SITE.name} — ${t('meta.homeTitle')}`,
    t('meta.homeDescription')
  );

  const featured = getFeaturedServices();
  const stats = [
    { value: SITE.stats.yearsOfExperience, suffix: '+', key: 'home.stats.years' },
    { value: SITE.stats.successRate, suffix: '%', key: 'home.stats.successRate' },
    { value: SITE.stats.offices, suffix: '', key: 'home.stats.offices' },
    { value: SITE.stats.practiceAreas, suffix: '', key: 'home.stats.practiceAreas' },
  ];
  const whyUs = [
    { icon: FaUserTie, key: 'experienced' },
    { icon: FaComments, key: 'accessible' },
    { icon: FaHandHoldingHeart, key: 'transparent' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero on-dark">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="overline">
              {SITE.tagline.toUpperCase()} · KOLKATA | DELHI
            </span>
            <h1>
              <Trans
                i18nKey="home.hero.title"
                components={{ gold: <em className="hero-gold" /> }}
              />
            </h1>
            <span className="hero-rule" aria-hidden="true" />
            <p className="hero-sub">{t('home.hero.subtitle')}</p>
            <div className="hero-ctas">
              <Link to="/contact-us" className="btn btn-gold">
                {t('home.hero.ctaPrimary')}
              </Link>
              <a href={buildTelUrl(SITE.phones[0].e164)} className="btn btn-ghost-light">
                <FaPhoneAlt aria-hidden="true" /> {t('home.hero.ctaSecondary')}
              </a>
            </div>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <LogoMark size={320} />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="stats-wrap">
        <div className="container">
          <div className="stats-card" ref={statsRef}>
            {stats.map((s) => (
              <div key={s.key} className="stat">
                <span
                  className="stat-value"
                  data-count={s.value}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </span>
                <span className="stat-label">{t(s.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('home.services.overline')}</span>
            <h2>{t('home.services.title')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="home-services-row">
            {featured.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
          <p className="home-services-more" data-reveal>
            <Link to="/practice-areas" className="link-gold">
              {t('home.services.viewAll')}
            </Link>
          </p>
        </div>
      </section>

      {/* Why us */}
      <section className="section why-us">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('home.why.overline')}</span>
            <h2>{t('home.why.title')}</h2>
            <span className="gold-rule" aria-hidden="true" />
          </div>
          <div className="why-grid">
            {whyUs.map(({ icon: Icon, key }, i) => (
              <div key={key} className="why-item" data-reveal style={{ '--i': i }}>
                <span className="why-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h4>{t(`home.why.items.${key}.title`)}</h4>
                <p>{t(`home.why.items.${key}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free legal aid banner */}
      <section className="aid-banner on-dark">
        <div className="container aid-inner" data-reveal>
          <FaBalanceScale size={40} aria-hidden="true" />
          <div>
            <h3>{t('home.legalAid.title')}</h3>
            <p>
              {t('home.legalAid.body', {
                start: SITE.freeLegalAid.start,
                end: SITE.freeLegalAid.end,
              })}
            </p>
          </div>
          <Link to="/contact-us" className="btn btn-ghost-light">
            {t('home.legalAid.cta')}
          </Link>
        </div>
      </section>

      {/* Lawyers preview */}
      <section className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <span className="overline">{t('home.team.overline')}</span>
            <h2>{t('home.team.title')}</h2>
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
          <p className="home-services-more" data-reveal>
            <Link to="/about-us" className="link-gold">
              {t('home.team.meetAll')}
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-band">
        <div className="container cta-inner" data-reveal>
          <h2>{t('home.cta.title')}</h2>
          <p>{t('home.cta.body')}</p>
          <div className="cta-actions">
            <Link to="/contact-us" className="btn btn-gold">
              {t('home.cta.button')}
            </Link>
            <a href={buildTelUrl(SITE.phones[0].e164)} className="link-gold ltr-isolate">
              {SITE.phones[0].display}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
