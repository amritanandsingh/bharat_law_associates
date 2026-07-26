import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormField from './FormField';
import SuccessPanel from './SuccessPanel';
import { SERVICES } from '../../data/services';
import { SITE } from '../../config/site';
import { buildWhatsAppUrl } from '../../utils/contactLinks';
import { logEnquiry } from '../../lib/enquiries';
import {
  isValidEmail,
  isValidIndianPhone,
  isFutureOrToday,
  todayISO,
} from '../../utils/validation';
import './forms.css';

const INITIAL = {
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  time: '',
  message: '',
};

const ConsultationForm = () => {
  const { t, i18n } = useTranslation(['common', 'services']);
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = t('forms.errors.nameRequired');
    if (!isValidIndianPhone(values.phone)) next.phone = t('forms.errors.phoneInvalid');
    if (values.email.trim() && !isValidEmail(values.email))
      next.email = t('forms.errors.emailInvalid');
    if (!values.service) next.service = t('forms.errors.serviceRequired');
    if (!values.date) next.date = t('forms.errors.dateRequired');
    else if (!isFutureOrToday(values.date)) next.date = t('forms.errors.dateInPast');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = document.querySelector('.consult-form [aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }
    // Payload stays in English so the office team can always read it.
    const serviceName = t(`services.items.${values.service}.name`, {
      ns: 'services',
      lng: 'en',
    });
    const text = [
      `New consultation request — ${SITE.name} website`,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      values.email.trim() && `Email: ${values.email.trim()}`,
      `Practice area: ${serviceName}`,
      `Preferred: ${values.date}${values.time ? `, ${values.time}` : ''}`,
      values.message.trim() && `Message: ${values.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    setLastMessage(text);
    logEnquiry({
      type: 'Consultation',
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      service: serviceName,
      preferred: `${values.date}${values.time ? `, ${values.time}` : ''}`,
      message: values.message.trim(),
      language: i18n.language,
      source: 'Consultation form',
    });
    window.open(buildWhatsAppUrl(SITE.whatsapp.number, text), '_blank', 'noopener');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form-card">
        <SuccessPanel
          mailtoSubject={`Consultation request — ${values.name.trim()}`}
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
      <h3>{t('forms.consultation.title')}</h3>
      <p className="form-sub">{t('forms.consultation.subtitle')}</p>
      <form className="consult-form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="qf-name"
          label={t('forms.fields.name')}
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={set('name')}
        />
        <FormField
          id="qf-phone"
          label={t('forms.fields.phone')}
          type="tel"
          inputMode="tel"
          value={values.phone}
          error={errors.phone}
          autoComplete="tel"
          onChange={set('phone')}
        />
        <FormField
          id="qf-email"
          label={t('forms.fields.emailOptional')}
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={set('email')}
        />
        <FormField
          id="qf-service"
          label={t('forms.fields.practiceArea')}
          as="select"
          value={values.service}
          error={errors.service}
          onChange={set('service')}
        >
          <option value="" disabled hidden />
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {t(`services.items.${s.id}.name`, { ns: 'services' })}
            </option>
          ))}
        </FormField>
        <div className="consult-datetime">
          <FormField
            id="qf-date"
            label={t('forms.fields.preferredDate')}
            type="date"
            min={todayISO()}
            value={values.date}
            error={errors.date}
            onChange={set('date')}
          />
          <FormField
            id="qf-time"
            label={t('forms.fields.preferredTime')}
            type="time"
            value={values.time}
            error={errors.time}
            onChange={set('time')}
          />
        </div>
        <FormField
          id="qf-message"
          label={t('forms.fields.messageOptional')}
          as="textarea"
          value={values.message}
          error={errors.message}
          onChange={set('message')}
        />
        <button type="submit" className="btn btn-gold btn-block">
          {t('forms.consultation.submit')}
        </button>
      </form>
    </div>
  );
};

export default ConsultationForm;
