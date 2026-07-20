// Single source of truth for every firm detail shown on the site.
// Replace every PLACEHOLDER value before go-live; a dev-only warning
// fires in the console while any placeholder remains.

export const SITE = {
  name: 'SP Law Chamber',
  tagline: 'Advocates & Legal Consultants',
  founder: 'Prem Prakash & Shruti Jain',
  foundedYear: 2009,

  phones: [
    { id: 'primary', e164: '+919354456326', display: '+91 93544 56326' },
  ],

  // wa.me format: country code + number, digits only, no '+'
  whatsapp: { number: '919354456326' },

  emails: {
    general: 'prem1249@gmail.com',
    careers: 'prem1249@gmail.com',
  },

  addresses: [
    {
      id: 'kolkata',
      city: 'Kolkata',
      lines: [
        'Jeevan Niwas, 30A, Pramatha Chaudhury Sarani',
        'R-Block, Chetla Rd, Sadapur, Block O, New Alipore',
      ],
      state: 'West Bengal',
      pincode: '700053',
      mapsUrl:
        'https://maps.google.com/?q=Jeevan+Niwas+30A+Pramatha+Chaudhury+Sarani+New+Alipore+Kolkata+700053',
    },
    {
      id: 'delhi',
      city: 'New Delhi',
      lines: ['By prior appointment'],
      state: '',
      pincode: '',
      mapsUrl: '',
    },
  ],

  freeLegalAid: { start: '21:00', end: '22:30' },

  stats: {
    yearsOfExperience: 15,
    successRate: 80,
    offices: 2,
    practiceAreas: 25,
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
