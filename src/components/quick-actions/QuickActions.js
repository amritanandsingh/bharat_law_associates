import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaWhatsapp, FaCalendarCheck } from 'react-icons/fa';
import CallbackModal from './CallbackModal';
import { SITE } from '../../config/site';
import { buildTelUrl, buildWhatsAppUrl } from '../../utils/contactLinks';
import './QuickActions.css';

const QuickActions = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    SITE.whatsapp.number,
    `Hello ${SITE.name}, I would like to discuss a legal matter.`
  );

  return (
    <>
      {/* Mobile sticky action bar */}
      <nav className="action-bar" aria-label={t('quickActions.label')}>
        <a href={buildTelUrl(SITE.phones[0].e164)} className="action-cell">
          <FaPhoneAlt size={20} aria-hidden="true" />
          <span>{t('quickActions.call')}</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="action-cell action-whatsapp"
        >
          <FaWhatsapp size={22} aria-hidden="true" />
          <span>{t('quickActions.whatsapp')}</span>
        </a>
        <button
          type="button"
          className="action-consult"
          onClick={() => setModalOpen(true)}
        >
          <FaCalendarCheck size={18} aria-hidden="true" />
          <span>{t('quickActions.consult')}</span>
        </button>
      </nav>

      {/* Desktop floating WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-fab"
        aria-label={t('quickActions.whatsapp')}
      >
        <FaWhatsapp size={28} aria-hidden="true" />
        <span className="whatsapp-fab-tip">{t('quickActions.chatWithUs')}</span>
      </a>

      <CallbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default QuickActions;
