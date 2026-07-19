import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { SITE } from '../../config/site';
import { buildMailtoUrl, buildTelUrl } from '../../utils/contactLinks';
import './forms.css';

const SuccessPanel = ({ mailtoSubject, mailtoBody, onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="success-panel" role="status">
      <FaCheckCircle size={48} aria-hidden="true" />
      <h3>{t('forms.success.title')}</h3>
      <p>{t('forms.success.body')}</p>
      <div className="success-links">
        <a
          className="btn btn-ghost-dark btn-block"
          href={buildMailtoUrl(SITE.emails.general, mailtoSubject, mailtoBody)}
        >
          <FaEnvelope aria-hidden="true" /> {t('forms.success.emailInstead')}
        </a>
        <a className="btn btn-ghost-dark btn-block" href={buildTelUrl(SITE.phones[0].e164)}>
          <FaPhoneAlt aria-hidden="true" /> {t('forms.success.callInstead')}
        </a>
        <button type="button" className="link-gold" onClick={onReset}>
          {t('forms.success.sendAnother')}
        </button>
      </div>
    </div>
  );
};

export default SuccessPanel;
