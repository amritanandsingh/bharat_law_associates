import {
  FaBalanceScale,
  FaGavel,
  FaHeartBroken,
  FaMoneyCheckAlt,
  FaUserShield,
  FaHome,
  FaBriefcase,
  FaBuilding,
  FaHandshake,
  FaIndustry,
  FaUtensils,
  FaRocket,
  FaReceipt,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaEnvelopeOpenText,
  FaTrademark,
  FaCopyright,
  FaLightbulb,
} from 'react-icons/fa';

// id === URL slug === i18n key under services.items.<id>
// All display text lives in locales/<lng>/services.json

export const CATEGORIES = [
  { id: 'litigation', icon: FaBalanceScale, order: 1 },
  { id: 'business-registration', icon: FaBuilding, order: 2 },
  { id: 'tax', icon: FaFileInvoiceDollar, order: 3 },
  { id: 'intellectual-property', icon: FaLightbulb, order: 4 },
];

export const SERVICES = [
  // Litigation
  { id: 'civil-litigation', category: 'litigation', icon: FaBalanceScale, order: 1, featured: true },
  { id: 'criminal-litigation', category: 'litigation', icon: FaGavel, order: 2, featured: true },
  { id: 'divorce-matrimonial-cases', category: 'litigation', icon: FaHeartBroken, order: 3, featured: true },
  { id: 'cheque-bounce-cases', category: 'litigation', icon: FaMoneyCheckAlt, order: 4, featured: false },
  { id: 'consumer-complaints', category: 'litigation', icon: FaUserShield, order: 5, featured: false },
  { id: 'property-disputes', category: 'litigation', icon: FaHome, order: 6, featured: true },
  { id: 'labour-employment-disputes', category: 'litigation', icon: FaBriefcase, order: 7, featured: false },

  // Business registration
  { id: 'private-limited-company-registration', category: 'business-registration', icon: FaBuilding, order: 1, featured: true },
  { id: 'llp-registration', category: 'business-registration', icon: FaHandshake, order: 2, featured: false },
  { id: 'partnership-firm-registration', category: 'business-registration', icon: FaHandshake, order: 3, featured: false },
  { id: 'msme-udyam-registration', category: 'business-registration', icon: FaIndustry, order: 4, featured: false },
  { id: 'fssai-license', category: 'business-registration', icon: FaUtensils, order: 5, featured: false },
  { id: 'startup-india-registration', category: 'business-registration', icon: FaRocket, order: 6, featured: false },

  // Tax
  { id: 'gst-registration', category: 'tax', icon: FaReceipt, order: 1, featured: true },
  { id: 'gst-return-filing', category: 'tax', icon: FaFileAlt, order: 2, featured: false },
  { id: 'income-tax-return-filing', category: 'tax', icon: FaFileInvoiceDollar, order: 3, featured: false },
  { id: 'tax-notice-reply', category: 'tax', icon: FaEnvelopeOpenText, order: 4, featured: false },

  // Intellectual property
  { id: 'trademark-registration', category: 'intellectual-property', icon: FaTrademark, order: 1, featured: true },
  { id: 'copyright-registration', category: 'intellectual-property', icon: FaCopyright, order: 2, featured: false },
  { id: 'patent-filing', category: 'intellectual-property', icon: FaLightbulb, order: 3, featured: false },
];

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.id === slug);

export const getServicesByCategory = (categoryId) =>
  SERVICES.filter((s) => s.category === categoryId).sort((a, b) => a.order - b.order);

export const getFeaturedServices = () => SERVICES.filter((s) => s.featured);
