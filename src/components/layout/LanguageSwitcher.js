import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaCheck, FaSearch } from 'react-icons/fa';
import { LANGUAGES, SUGGESTED_CODES } from '../../i18n/languages';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const current = i18n.resolvedLanguage || i18n.language || 'en';

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.englishName.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [query]);

  const suggested = filtered.filter((l) => SUGGESTED_CODES.includes(l.code));
  const rest = filtered
    .filter((l) => !SUGGESTED_CODES.includes(l.code))
    .sort((a, b) => a.englishName.localeCompare(b.englishName));

  const select = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  };

  const renderRow = (lang) => (
    <li key={lang.code}>
      <button
        type="button"
        className={`lang-row ${lang.code === current ? 'lang-row-active' : ''}`}
        onClick={() => select(lang.code)}
      >
        <span className="lang-names">
          <span className="lang-native" lang={lang.code} dir={lang.dir}>
            {lang.nativeName}
          </span>
          <span className="lang-english">{lang.englishName}</span>
        </span>
        {lang.code === current && <FaCheck size={12} aria-hidden="true" />}
      </button>
    </li>
  );

  return (
    <div className="lang-switcher">
      <button
        ref={triggerRef}
        type="button"
        className="lang-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('a11y.changeLanguage')}
        onClick={() => setOpen((v) => !v)}
      >
        <FaGlobe size={16} aria-hidden="true" />
        <span className="lang-code">{current.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="lang-sheet-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="lang-panel" ref={panelRef} role="listbox" aria-label={t('a11y.changeLanguage')}>
            <div className="lang-sheet-handle" aria-hidden="true" />
            <div className="lang-search">
              <FaSearch size={13} aria-hidden="true" />
              <input
                type="search"
                value={query}
                placeholder={t('a11y.searchLanguage')}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={t('a11y.searchLanguage')}
              />
            </div>
            {suggested.length > 0 && (
              <>
                <p className="lang-group-label">{t('a11y.suggestedLanguages')}</p>
                <ul>{suggested.map(renderRow)}</ul>
              </>
            )}
            {rest.length > 0 && (
              <>
                <p className="lang-group-label">{t('a11y.allLanguages')}</p>
                <ul>{rest.map(renderRow)}</ul>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
