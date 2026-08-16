import {
  FaBalanceScale,
  FaGavel,
  FaUnlockAlt,
  FaMoneyCheckAlt,
  FaHeartBroken,
  FaUserShield,
  FaHandshake,
  FaScroll,
  FaLandmark,
  FaUsers,
  FaUniversity,
  FaBuilding,
  FaSitemap,
  FaMoneyBillWave,
  FaShieldAlt,
  FaLightbulb,
  FaHome,
  FaMapMarkedAlt,
  FaBriefcase,
  FaHandHoldingHeart,
  FaFileSignature,
  FaFileContract,
  FaStamp,
  FaIndustry,
  FaGraduationCap,
  FaClipboardCheck,
  FaFileInvoiceDollar,
  FaCity,
} from 'react-icons/fa';

// id === URL slug === i18n key under services.items.<id>
// All display text lives in locales/<lng>/services.json

export const CATEGORIES = [
  { id: 'litigation-disputes', icon: FaBalanceScale, order: 1 },
  { id: 'constitutional-appellate', icon: FaLandmark, order: 2 },
  { id: 'corporate-commercial', icon: FaBuilding, order: 3 },
  { id: 'property-advisory', icon: FaFileContract, order: 4 },
];

export const SERVICES = [
  // Litigation & Disputes
  { id: 'civil-litigation', category: 'litigation-disputes', icon: FaBalanceScale, order: 1, featured: true },
  { id: 'criminal-litigation', category: 'litigation-disputes', icon: FaGavel, order: 2, featured: true },
  { id: 'bail-anticipatory-bail-criminal-appeals', category: 'litigation-disputes', icon: FaUnlockAlt, order: 3, featured: true },
  { id: 'cheque-bounce-cases', category: 'litigation-disputes', icon: FaMoneyCheckAlt, order: 4, featured: false },
  { id: 'family-matrimonial-disputes', category: 'litigation-disputes', icon: FaHeartBroken, order: 5, featured: false },
  { id: 'consumer-protection-cases', category: 'litigation-disputes', icon: FaUserShield, order: 6, featured: false },
  { id: 'arbitration-mediation', category: 'litigation-disputes', icon: FaHandshake, order: 7, featured: true },
  { id: 'labour-industrial-matters', category: 'litigation-disputes', icon: FaIndustry, order: 8, featured: false },

  // Constitutional & Appellate
  { id: 'writ-petitions', category: 'constitutional-appellate', icon: FaScroll, order: 1, featured: true },
  { id: 'constitutional-law', category: 'constitutional-appellate', icon: FaLandmark, order: 2, featured: false },
  { id: 'public-interest-litigation', category: 'constitutional-appellate', icon: FaUsers, order: 3, featured: false },
  { id: 'high-court-appeals-revisions', category: 'constitutional-appellate', icon: FaGavel, order: 4, featured: false },
  { id: 'tribunal-matters', category: 'constitutional-appellate', icon: FaUniversity, order: 5, featured: false },
  { id: 'education-matters', category: 'constitutional-appellate', icon: FaGraduationCap, order: 6, featured: false },
  { id: 'contempt-compliance-matters', category: 'constitutional-appellate', icon: FaClipboardCheck, order: 7, featured: false },

  // Corporate & Commercial
  { id: 'corporate-commercial-law', category: 'corporate-commercial', icon: FaBuilding, order: 1, featured: true },
  { id: 'company-law', category: 'corporate-commercial', icon: FaSitemap, order: 2, featured: false },
  { id: 'banking-finance-law', category: 'corporate-commercial', icon: FaMoneyBillWave, order: 3, featured: false },
  { id: 'sarfaesi-drt-matters', category: 'corporate-commercial', icon: FaUniversity, order: 4, featured: false },
  { id: 'cyber-law', category: 'corporate-commercial', icon: FaShieldAlt, order: 5, featured: false },
  { id: 'intellectual-property-rights', category: 'corporate-commercial', icon: FaLightbulb, order: 6, featured: false },
  { id: 'tax-revenue-matters', category: 'corporate-commercial', icon: FaFileInvoiceDollar, order: 7, featured: false },

  // Property, Registration & Advisory
  { id: 'property-real-estate-law', category: 'property-advisory', icon: FaHome, order: 1, featured: true },
  { id: 'land-acquisition-matters', category: 'property-advisory', icon: FaMapMarkedAlt, order: 2, featured: false },
  { id: 'service-employment-law', category: 'property-advisory', icon: FaBriefcase, order: 3, featured: true },
  { id: 'trust-society-registration', category: 'property-advisory', icon: FaHandHoldingHeart, order: 4, featured: false },
  { id: 'probate-succession-will', category: 'property-advisory', icon: FaFileSignature, order: 5, featured: false },
  { id: 'contract-drafting-legal-opinions', category: 'property-advisory', icon: FaFileContract, order: 6, featured: false },
  { id: 'documentation-registration', category: 'property-advisory', icon: FaStamp, order: 7, featured: false },
  { id: 'municipal-local-authority-matters', category: 'property-advisory', icon: FaCity, order: 8, featured: false },
];

export const getServiceBySlug = (slug) => SERVICES.find((s) => s.id === slug);

export const getServicesByCategory = (categoryId) =>
  SERVICES.filter((s) => s.category === categoryId).sort((a, b) => a.order - b.order);

export const getFeaturedServices = () => SERVICES.filter((s) => s.featured);
