import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Logo from './Logo';
import { CATEGORIES } from '../../data/services';
import { SITE } from '../../config/site';
import { buildTelUrl, buildMailtoUrl } from '../../utils/contactLinks';
import './Footer.css';

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  youtube: FaYoutube,
};

const Footer = () => {
  const { t } = useTranslation(['common', 'services']);
  const year = new Date().getFullYear();
  const socials = Object.entries(SITE.social).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label={SITE.name}>
            <Logo variant="dark" markSize={48} />
          </Link>
          <p className="footer-mission">{t('footer.tagline')}</p>
          {socials.length > 0 && (
            <ul className="footer-social">
              {socials.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <li key={key}>
                    <a href={url} target="_blank" rel="noreferrer" aria-label={key}>
                      <Icon size={14} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <h3 className="footer-heading">{t('footer.quickLinks')}</h3>
          <ul className="footer-links">
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/about-us">{t('nav.aboutUs')}</Link></li>
            <li><Link to="/practice-areas">{t('nav.practiceAreas')}</Link></li>
            <li><Link to="/articles">{t('nav.articles')}</Link></li>
            <li><Link to="/contact-us">{t('nav.contactUs')}</Link></li>
            <li><Link to="/join-us">{t('nav.joinUs')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="footer-heading">{t('nav.practiceAreas')}</h3>
          <ul className="footer-links">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link to={`/practice-areas#${cat.id}`}>
                  {t(`services.categories.${cat.id}.name`, { ns: 'services' })}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-heading">{t('footer.reachUs')}</h3>
          <ul className="footer-contact">
            {SITE.addresses.map((office) => (
              <li key={office.id}>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>
                  <strong>{office.city}</strong>
                  <br />
                  {[office.lines.join(', '), [office.state, office.pincode].filter(Boolean).join(' ')]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </li>
            ))}
            <li>
              <FaPhoneAlt aria-hidden="true" />
              <a href={buildTelUrl(SITE.phones[0].e164)} className="ltr-isolate">
                {SITE.phones[0].display}
              </a>
            </li>
            <li>
              <FaEnvelope aria-hidden="true" />
              <a href={buildMailtoUrl(SITE.emails.general, '', '')}>{SITE.emails.general}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container">
          <p className="footer-disclaimer">{t('footer.bciDisclaimer')}</p>
          <p className="footer-translation-note">{t('footer.translationNote')}</p>
          <p className="footer-copy">
            © {year} {SITE.name}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
