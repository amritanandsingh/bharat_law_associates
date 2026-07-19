import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormField from './FormField';
import SuccessPanel from './SuccessPanel';
import { SITE } from '../../config/site';
import { buildWhatsAppUrl } from '../../utils/contactLinks';
import { isValidEmail, isValidIndianPhone } from '../../utils/validation';
import './forms.css';

const INITIAL = { name: '', email: '', phone: '', message: '' };

const ConnectForm = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = t('forms.errors.nameRequired');
    const hasEmail = values.email.trim().length > 0;
    const hasPhone = values.phone.trim().length > 0;
    if (!hasEmail && !hasPhone) {
      next.email = t('forms.errors.emailOrPhoneRequired');
      next.phone = t('forms.errors.emailOrPhoneRequired');
    } else {
      if (hasEmail && !isValidEmail(values.email)) next.email = t('forms.errors.emailInvalid');
      if (hasPhone && !isValidIndianPhone(values.phone)) next.phone = t('forms.errors.phoneInvalid');
    }
    if (!values.message.trim()) next.message = t('forms.errors.messageRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = document.querySelector('.connect-form [aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }
    const text = [
      `New enquiry — ${SITE.name} website`,
      `Name: ${values.name.trim()}`,
      values.phone.trim() && `Phone: ${values.phone.trim()}`,
      values.email.trim() && `Email: ${values.email.trim()}`,
      `Message: ${values.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    setLastMessage(text);
    window.open(buildWhatsAppUrl(SITE.whatsapp.number, text), '_blank', 'noopener');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form-card">
        <SuccessPanel
          mailtoSubject={`Website enquiry — ${values.name.trim()}`}
          mailtoBody={lastMessage}
          onReset={() => {
            setValues(INITIAL);
            setSent(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="form-card">
      <h3>{t('forms.connect.title')}</h3>
      <p className="form-sub">{t('forms.connect.subtitle')}</p>
      <form className="connect-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="cf-name"
          label={t('forms.fields.name')}
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={set('name')}
        />
        <FormField
          id="cf-phone"
          label={t('forms.fields.phoneOptionalPair')}
          type="tel"
          inputMode="tel"
          value={values.phone}
          error={errors.phone}
          autoComplete="tel"
          onChange={set('phone')}
        />
        <FormField
          id="cf-email"
          label={t('forms.fields.emailOptionalPair')}
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={set('email')}
        />
        <FormField
          id="cf-message"
          label={t('forms.fields.message')}
          as="textarea"
          value={values.message}
          error={errors.message}
          onChange={set('message')}
        />
        <button type="submit" className="btn btn-gold btn-block">
          {t('forms.connect.submit')}
        </button>
      </form>
    </div>
  );
};

export default ConnectForm;
