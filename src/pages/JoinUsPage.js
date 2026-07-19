import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGraduationCap, FaUsers, FaBalanceScale, FaChartLine } from 'react-icons/fa';
import FormField from '../components/forms/FormField';
import SuccessPanel from '../components/forms/SuccessPanel';
import { SITE } from '../config/site';
import { buildMailtoUrl } from '../utils/contactLinks';
import { isValidEmail, isValidIndianPhone } from '../utils/validation';
import usePageMeta from '../hooks/usePageMeta';
import useReveal from '../hooks/useReveal';
import './JoinUsPage.css';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  qualification: '',
  experience: '',
  message: '',
};

const PERKS = [
  { icon: FaBalanceScale, key: 'exposure' },
  { icon: FaGraduationCap, key: 'mentorship' },
  { icon: FaUsers, key: 'culture' },
  { icon: FaChartLine, key: 'growth' },
];

const JoinUsPage = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  useReveal();
  usePageMeta(`${t('nav.joinUs')} — ${SITE.name}`, t('meta.joinDescription'));

  const set = (key) => (v) => setValues((s) => ({ ...s, [key]: v }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = t('forms.errors.nameRequired');
    if (!isValidEmail(values.email)) next.email = t('forms.errors.emailInvalid');
    if (!isValidIndianPhone(values.phone)) next.phone = t('forms.errors.phoneInvalid');
    if (!values.qualification.trim())
      next.qualification = t('forms.errors.qualificationRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildBody = () =>
    [
      `Job application — ${SITE.name} website`,
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Qualification: ${values.qualification.trim()}`,
      values.experience.trim() && `Experience: ${values.experience.trim()}`,
      values.message.trim() && `Message: ${values.message.trim()}`,
      '',
      '(Please attach your resume to this email before sending.)',
    ]
      .filter(Boolean)
      .join('\n');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector('.join-form [aria-invalid="true"]')?.focus();
      return;
    }
    window.location.href = buildMailtoUrl(
      SITE.emails.careers,
      `Job application — ${values.name.trim()}`,
      buildBody()
    );
    setSent(true);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label={t('a11y.breadcrumb')}>
            <Link to="/">{t('nav.home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('nav.joinUs')}</span>
          </nav>
          <h1>{t('join.title')}</h1>
          <p className="lede">{t('join.lede')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container join-layout">
          <div>
            <div className="section-head" data-reveal>
              <span className="overline">{t('join.perksOverline')}</span>
              <h2>{t('join.perksTitle')}</h2>
              <span className="gold-rule" aria-hidden="true" />
            </div>
            <ul className="join-perks">
              {PERKS.map(({ icon: Icon, key }, i) => (
                <li key={key} data-reveal style={{ '--i': i }}>
                  <span className="join-perk-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h4>{t(`join.perks.${key}.title`)}</h4>
                    <p>{t(`join.perks.${key}.body`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            {sent ? (
              <div className="form-card">
                <SuccessPanel
                  mailtoSubject={`Job application — ${values.name.trim()}`}
                  mailtoBody={buildBody()}
                  onReset={() => {
                    setValues(INITIAL);
                    setSent(false);
                  }}
                />
              </div>
            ) : (
              <div className="form-card">
                <h3>{t('join.formTitle')}</h3>
                <p className="form-sub">{t('join.formSubtitle')}</p>
                <form className="join-form" onSubmit={handleSubmit} noValidate>
                  <FormField
                    id="jf-name"
                    label={t('forms.fields.name')}
                    value={values.name}
                    error={errors.name}
                    autoComplete="name"
                    onChange={set('name')}
                  />
                  <FormField
                    id="jf-email"
                    label={t('forms.fields.email')}
                    type="email"
                    value={values.email}
                    error={errors.email}
                    autoComplete="email"
                    onChange={set('email')}
                  />
                  <FormField
                    id="jf-phone"
                    label={t('forms.fields.phone')}
                    type="tel"
                    inputMode="tel"
                    value={values.phone}
                    error={errors.phone}
                    autoComplete="tel"
                    onChange={set('phone')}
                  />
                  <FormField
                    id="jf-qualification"
                    label={t('forms.fields.qualification')}
                    value={values.qualification}
                    error={errors.qualification}
                    onChange={set('qualification')}
                  />
                  <FormField
                    id="jf-experience"
                    label={t('forms.fields.experienceOptional')}
                    value={values.experience}
                    error={errors.experience}
                    onChange={set('experience')}
                  />
                  <FormField
                    id="jf-message"
                    label={t('forms.fields.messageOptional')}
                    as="textarea"
                    value={values.message}
                    error={errors.message}
                    onChange={set('message')}
                  />
                  <p className="join-resume-note">{t('join.resumeNote')}</p>
                  <button type="submit" className="btn btn-gold btn-block">
                    {t('join.submit')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default JoinUsPage;
