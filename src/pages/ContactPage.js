import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaMapMarkerAlt, FaDirections, FaClock } from 'react-icons/fa';
import ConnectForm from '../components/forms/ConnectForm';
import ConsultationForm from '../components/forms/ConsultationForm';
import { SITE } from '../config/site';
import { buildTelUrl } from '../utils/contactLinks';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation();
  useReveal();
  usePageMeta(`${t('nav.contactUs')} — ${SITE.name}`, t('meta.contactDescription'));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('nav.contactUs')}</span>
          </nav>
          <h1>{t('contact.title')}</h1>
          <p className="lede">{t('contact.lede')}</p>
          <div className="contact-hero-info">
            <a href={buildTelUrl(SITE.phones[0].e164)} className="contact-hero-phone ltr-isolate">
              <FaPhoneAlt aria-hidden="true" /> {SITE.phones[0].display}
            </a>
            <span className="contact-hero-hours">
              <FaClock aria-hidden="true" />{' '}
              {t('contact.freeAidHours', {
                start: SITE.freeLegalAid.start,
                end: SITE.freeLegalAid.end,
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-forms">
            <div id="consultation" data-reveal>
              <ConsultationForm />
            </div>
            <div id="connect" data-reveal>
              <ConnectForm />
            </div>
          </div>

          <aside className="contact-side">
            <h2 data-reveal>{t('contact.officesTitle')}</h2>
            {SITE.addresses.map((office, i) => (
              <div key={office.id} className="office-card" data-reveal style={{ '--i': i }}>
                <h4>
                  <FaMapMarkerAlt aria-hidden="true" /> {office.city}
                </h4>
                <p>
                  {office.lines.join(', ')}
                  <br />
                  {office.state} — {office.pincode}
                </p>
                <div className="office-actions">
                  <a
                    href={office.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost-dark"
                  >
                    <FaDirections aria-hidden="true" /> {t('contact.getDirections')}
                  </a>
                  <a href={buildTelUrl(SITE.phones[0].e164)} className="btn btn-ghost-dark">
                    <FaPhoneAlt aria-hidden="true" /> {t('contact.callOffice')}
                  </a>
                </div>
              </div>
            ))}
            <p className="contact-callback-hint" data-reveal>
              {t('contact.preferCallback')}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
