import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaWhatsapp, FaSms, FaEnvelope, FaBalanceScale } from 'react-icons/fa';
import { SITE } from '../../config/site';
import {
  buildTelUrl,
  buildWhatsAppUrl,
  buildSmsUrl,
  buildMailtoUrl,
} from '../../utils/contactLinks';
import './QuickActions.css';

const QuickActions = () => {
  const { t } = useTranslation();

  const intro = `Hello ${SITE.name}, I would like to discuss a legal matter.`;
  const actions = [
    {
      key: 'call',
      href: buildTelUrl(SITE.phones[0].e164),
      icon: FaPhoneAlt,
      label: t('quickActions.call'),
    },
    {
      key: 'whatsapp',
      href: buildWhatsAppUrl(SITE.whatsapp.number, intro),
      icon: FaWhatsapp,
      label: t('quickActions.whatsapp'),
      external: true,
      brand: 'whatsapp',
    },
    {
      key: 'sms',
      href: buildSmsUrl(SITE.phones[0].e164, intro),
      icon: FaSms,
      label: t('quickActions.sms'),
    },
    {
      key: 'mail',
      href: buildMailtoUrl(SITE.emails.general, 'Legal enquiry', intro),
      icon: FaEnvelope,
      label: t('quickActions.mail'),
    },
    {
      key: 'services',
      to: '/practice-areas',
      icon: FaBalanceScale,
      label: t('quickActions.services'),
    },
  ];

  const renderInner = (action) => {
    const Icon = action.icon;
    return (
      <>
        <Icon size={20} aria-hidden="true" />
        <span>{action.label}</span>
      </>
    );
  };

  return (
    <>
      {/* Mobile sticky action bar */}
      <nav className="action-bar" aria-label={t('quickActions.label')}>
        {actions.map((action) =>
          action.to ? (
            <Link key={action.key} to={action.to} className="action-cell">
              {renderInner(action)}
            </Link>
          ) : (
            <a
              key={action.key}
              href={action.href}
              className={`action-cell${action.brand === 'whatsapp' ? ' action-whatsapp' : ''}`}
              {...(action.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {renderInner(action)}
            </a>
          )
        )}
      </nav>

      {/* Desktop floating rail */}
      <nav className="action-rail" aria-label={t('quickActions.label')}>
        {actions.map((action) => {
          const Icon = action.icon;
          const cls = `rail-btn${action.brand === 'whatsapp' ? ' rail-whatsapp' : ''}`;
          const inner = (
            <>
              <Icon size={20} aria-hidden="true" />
              <span className="rail-tip">{action.label}</span>
            </>
          );
          return action.to ? (
            <Link key={action.key} to={action.to} className={cls} aria-label={action.label}>
              {inner}
            </Link>
          ) : (
            <a
              key={action.key}
              href={action.href}
              className={cls}
              aria-label={action.label}
              {...(action.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {inner}
            </a>
          );
        })}
      </nav>
    </>
  );
};

export default QuickActions;
