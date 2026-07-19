import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import './ServiceCard.css';

const ServiceCard = ({ service, index = 0 }) => {
  const { t } = useTranslation('services');
  const Icon = service.icon;

  return (
    <Link
      to={`/practice-areas/${service.id}`}
      className="service-card"
      data-reveal
      style={{ '--i': index % 8 }}
    >
      <span className="service-card-icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <h4>{t(`services.items.${service.id}.name`)}</h4>
      <p>{t(`services.items.${service.id}.summary`)}</p>
      <span className="service-card-more">
        {t('services.learnMore')}
        <FaArrowRight className="icon-arrow" size={12} aria-hidden="true" />
      </span>
    </Link>
  );
};

export default ServiceCard;
