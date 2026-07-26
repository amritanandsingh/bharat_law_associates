import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaShareAlt, FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa';
import { buildWhatsAppUrl } from '../../utils/contactLinks';
import { SITE } from '../../config/site';
import './ShareButton.css';

// Share a post link: native share sheet where available (mobile), otherwise a
// copy-link button + a WhatsApp deep link (reusing the site's WhatsApp helper).
const ShareButton = ({ slug, title }) => {
  const { t } = useTranslation('articles');
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/articles/${slug}`;
  const shareText = `${title} — ${SITE.name}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* very old browser — no clipboard API */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: shareText, url });
    } catch (e) {
      if (e && e.name !== 'AbortError') copy();
    }
  };

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  if (canNativeShare) {
    return (
      <button type="button" className="btn share-btn" onClick={nativeShare}>
        <FaShareAlt aria-hidden="true" /> {t('articles.ui.shareLabel')}
      </button>
    );
  }

  return (
    <div className="share-fallback" role="group" aria-label={t('articles.ui.shareLabel')}>
      <button type="button" className="btn share-btn" onClick={copy}>
        {copied ? <FaCheck aria-hidden="true" /> : <FaLink aria-hidden="true" />}
        {copied ? t('articles.ui.copied') : t('articles.ui.copyLink')}
      </button>
      <a
        className="btn share-whatsapp"
        href={buildWhatsAppUrl(SITE.whatsapp.number, `${shareText} ${url}`)}
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp aria-hidden="true" /> WhatsApp
      </a>
    </div>
  );
};

export default ShareButton;
