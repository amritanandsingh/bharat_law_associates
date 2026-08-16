import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { buildTelUrl, buildMailtoUrl } from '../../utils/contactLinks';
import './LawyerCard.css';

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const LawyerCard = ({ lawyer, index = 0 }) => {
  const { t } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);

  if (!lawyer) return null;

  const showPhoto = lawyer.photo && !imgFailed;
  const role = t(lawyer.roleKey || 'about.advocateRole');

  return (
    <div className="lawyer-card" data-reveal style={{ '--i': index }}>
      {showPhoto ? (
        <img
          className="lawyer-photo"
          src={lawyer.photo}
          alt={lawyer.name}
          loading="lazy"
          style={lawyer.objectPosition ? { objectPosition: lawyer.objectPosition } : undefined}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="lawyer-avatar" aria-hidden="true">
          {initialsOf(lawyer.name)}
        </span>
      )}
      <h4>{lawyer.name}</h4>
      <p className="lawyer-role">{role}</p>
      <p className="lawyer-qual">{lawyer.qualification}</p>
      {(lawyer.phone || lawyer.email) && (
        <div className="lawyer-contact">
          {lawyer.phone && (
            <a
              href={buildTelUrl(lawyer.phone)}
              className="lawyer-contact-link ltr-isolate"
              aria-label={`${t('quickActions.call')} ${lawyer.name}`}
            >
              <FaPhoneAlt size={12} aria-hidden="true" /> {lawyer.phone}
            </a>
          )}
          {lawyer.email && (
            <a
              href={buildMailtoUrl(lawyer.email, 'Legal enquiry', '')}
              className="lawyer-contact-link"
              aria-label={`${t('quickActions.mail')} ${lawyer.name}`}
            >
              <FaEnvelope size={12} aria-hidden="true" /> {lawyer.email}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default LawyerCard;
