import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFilePdf, FaExternalLinkAlt, FaWhatsapp, FaSms, FaEnvelope } from 'react-icons/fa';
import { SITE } from '../../config/site';
import {
  buildWhatsAppUrl,
  buildSmsUrl,
  buildMailtoUrl,
} from '../../utils/contactLinks';
import { formatPrice } from '../../utils/formatPrice';
import { resolvePreviewUrl } from '../../lib/documents';
import './DocumentCard.css';

const DocumentCard = ({ document: doc, index = 0 }) => {
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage || i18n.language || 'en';
  const [thumb, setThumb] = useState('');
  const [thumbFailed, setThumbFailed] = useState(false);

  const isImage = (doc?.previewContentType || '').startsWith('image/');

  // Only image samples get an inline thumbnail; a PDF shows the file icon.
  useEffect(() => {
    let alive = true;
    if (!doc?.previewKey || !isImage) return undefined;
    resolvePreviewUrl(doc.previewKey).then((url) => {
      if (alive && url) setThumb(url);
    });
    return () => {
      alive = false;
    };
  }, [doc?.previewKey, isImage]);

  if (!doc) return null;

  const price = formatPrice(doc.priceInr, lng);
  const enquiry = t('documents.enquiryMessage', { title: doc.title });

  // Presigned URLs expire, so resolve at click time rather than on mount.
  const openSample = async (e) => {
    e.preventDefault();
    const url = await resolvePreviewUrl(doc.previewKey);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const contacts = [
    {
      key: 'whatsapp',
      href: buildWhatsAppUrl(SITE.whatsapp.number, enquiry),
      icon: FaWhatsapp,
      label: t('quickActions.whatsapp'),
      external: true,
    },
    {
      key: 'sms',
      href: buildSmsUrl(SITE.phones[0].e164, enquiry),
      icon: FaSms,
      label: t('quickActions.sms'),
    },
    {
      key: 'mail',
      href: buildMailtoUrl(SITE.emails.general, `Document enquiry: ${doc.title}`, enquiry),
      icon: FaEnvelope,
      label: t('quickActions.mail'),
    },
  ];

  return (
    <article className="document-card" data-reveal style={{ '--i': index % 8 }}>
      <span
        className={`document-thumb ${thumb && !thumbFailed ? '' : 'document-thumb-empty'}`}
      >
        {thumb && !thumbFailed ? (
          <img
            src={thumb}
            alt={t('documents.sampleAlt', { title: doc.title })}
            loading="lazy"
            onError={() => setThumbFailed(true)}
          />
        ) : (
          <FaFilePdf size={30} aria-hidden="true" />
        )}
      </span>

      <div className="document-body">
        <h3>{doc.title}</h3>
        {doc.description && <p className="document-desc">{doc.description}</p>}

        <p className="document-price">
          {price ? (
            <span className="ltr-isolate">{price}</span>
          ) : (
            <span className="document-price-ask">{t('documents.priceOnRequest')}</span>
          )}
        </p>

        {doc.previewKey && (
          <p className="document-sample">
            <a href="#sample" onClick={openSample} className="link-gold">
              {t('documents.viewSample')}
              <FaExternalLinkAlt size={11} aria-hidden="true" />
            </a>
          </p>
        )}

        <div className="document-buy">
          <span className="document-buy-label">{t('documents.buyTitle')}</span>
          <div className="document-buy-links">
            {contacts.map(({ key, href, icon: Icon, label, external }) => (
              <a
                key={key}
                href={href}
                className={`document-buy-link${key === 'whatsapp' ? ' is-whatsapp' : ''}`}
                aria-label={`${label} — ${doc.title}`}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default DocumentCard;
