// Single source of truth for every firm detail shown on the site.
// Replace every PLACEHOLDER value before go-live; a dev-only warning
// fires in the console while any placeholder remains.

export const SITE = {
  name: 'Bharat Law Associates',
  tagline: 'Advocates & Legal Consultants',
  founder: 'Prem Prakash',
  foundedYear: 2009,

  phones: [
    { id: 'primary', e164: '+919000000000', display: '+91 90000 00000 (PLACEHOLDER)' },
  ],

  // wa.me format: country code + number, digits only, no '+'
  whatsapp: { number: '919000000000' },

  emails: {
    general: 'contact@bharatlaw-placeholder.example',
    careers: 'careers@bharatlaw-placeholder.example',
  },

  addresses: [
    {
      id: 'kolkata',
      city: 'Kolkata',
      lines: ['PLACEHOLDER Building, PLACEHOLDER Street'],
      state: 'West Bengal',
      pincode: '700001',
      mapsUrl: 'https://maps.google.com/?q=Kolkata+PLACEHOLDER',
    },
    {
      id: 'delhi',
      city: 'New Delhi',
      lines: ['PLACEHOLDER House, PLACEHOLDER Road'],
      state: 'Delhi',
      pincode: '110001',
      mapsUrl: 'https://maps.google.com/?q=New+Delhi+PLACEHOLDER',
    },
  ],

  freeLegalAid: { start: '21:00', end: '22:30' },

  stats: {
    yearsOfExperience: 15,
    successRate: 80,
    offices: 2,
    practiceAreas: 19,
  },

  // Empty string = icon hidden in the footer
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
  },
};

const hasPlaceholder = (value) =>
  typeof value === 'string' &&
  (value.includes('PLACEHOLDER') || value.includes('placeholder.example') || value === '+919000000000' || value === '919000000000');

const findPlaceholders = (obj, path = []) =>
  Object.entries(obj).flatMap(([key, value]) => {
    if (value && typeof value === 'object') return findPlaceholders(value, [...path, key]);
    return hasPlaceholder(value) ? [[...path, key].join('.')] : [];
  });

if (process.env.NODE_ENV === 'development') {
  const remaining = findPlaceholders(SITE);
  if (remaining.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[site.js] Placeholder firm details still present — replace before go-live:\n  ${remaining.join('\n  ')}`
    );
  }
}
