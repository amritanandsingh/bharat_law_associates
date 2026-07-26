import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import FormField from '../forms/FormField';
import { SITE } from '../../config/site';
import { buildWhatsAppUrl } from '../../utils/contactLinks';
import { logEnquiry } from '../../lib/enquiries';
import { isValidIndianPhone } from '../../utils/validation';
import './CallbackModal.css';

const TIME_SLOTS = ['morning', 'afternoon', 'evening'];

const CallbackModal = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState({ name: '', phone: '', slot: 'morning' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    dialog?.querySelector('input')?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialog) {
        const focusables = dialog.querySelectorAll(
          'button, input, [href], select, textarea'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSent(false);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = t('forms.errors.nameRequired');
    if (!isValidIndianPhone(values.phone)) next.phone = t('forms.errors.phoneInvalid');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const text = [
      `Callback request — ${SITE.name} website`,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Preferred time: ${values.slot}`,
      'Please call me back.',
    ].join('\n');
    logEnquiry({
      type: 'Callback',
      name: values.name.trim(),
      phone: values.phone.trim(),
      preferred: values.slot,
      language: i18n.language,
      source: 'Callback modal',
    });
    window.open(buildWhatsAppUrl(SITE.whatsapp.number, text), '_blank', 'noopener');
    setSent(true);
  };

  return (
    <div className="cb-root" role="presentation">
      <div className="cb-overlay" onClick={onClose} aria-hidden="true" />
      <div
        className="cb-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cb-title"
        ref={dialogRef}
      >
        <div className="cb-handle" aria-hidden="true" />
        <button type="button" className="cb-close" onClick={onClose} aria-label={t('a11y.close')}>
          <FaTimes size={16} />
        </button>

        {sent ? (
          <div className="cb-success" role="status">
            <FaCheckCircle size={48} aria-hidden="true" />
            <h3>{t('callback.successTitle')}</h3>
            <p>{t('callback.successBody')}</p>
            <button type="button" className="btn btn-gold btn-block" onClick={onClose}>
              {t('a11y.close')}
            </button>
          </div>
        ) : (
          <>
            <h3 id="cb-title">{t('callback.title')}</h3>
            <p className="cb-sub">{t('callback.subtitle')}</p>
            <form onSubmit={handleSubmit} noValidate>
              <FormField
                id="cb-name"
                label={t('forms.fields.name')}
                value={values.name}
                error={errors.name}
                autoComplete="name"
                onChange={(v) => setValues((s) => ({ ...s, name: v }))}
              />
              <FormField
                id="cb-phone"
                label={t('forms.fields.phone')}
                type="tel"
                inputMode="tel"
                value={values.phone}
                error={errors.phone}
                autoComplete="tel"
                onChange={(v) => setValues((s) => ({ ...s, phone: v }))}
              />
              <fieldset className="cb-slots">
                <legend>{t('callback.preferredTime')}</legend>
                <div className="cb-slot-row">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`cb-slot ${values.slot === slot ? 'cb-slot-active' : ''}`}
                      aria-pressed={values.slot === slot}
                      onClick={() => setValues((s) => ({ ...s, slot }))}
                    >
                      {t(`callback.slots.${slot}`)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <button type="submit" className="btn btn-gold btn-block">
                {t('callback.submit')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CallbackModal;
