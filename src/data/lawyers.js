// Each lawyer's role label is a translation key (roleKey) resolved from
// locales/<lng>/common.json; names, qualifications, phone, email and photo
// stay untranslated.
// Photos are served from public/lawyers/ — a missing file falls back to initials.

export const LAWYERS = [
  {
    id: 'prem-prakash',
    name: 'Prem Prakash',
    qualification: 'B.A. LL.B; LL.M — University of Calcutta',
    founder: true,
    roleKey: 'about.coFounderRole',
    phone: '+919354456326',
    email: 'prem1249@gmail.com',
    photo: '/lawyers/prem-prakash.jpg',
    objectPosition: 'center 30%',
  },
  {
    id: 'shruti-jain',
    name: 'Shruti Jain',
    qualification:
      'B.A. LL.B; Post Graduate Diploma in Human Resource Development & Labour Welfare (PGDHRD&LW)',
    founder: true,
    roleKey: 'about.coFounderRole',
    phone: '+918777394943',
    email: '',
    photo: '/lawyers/shruti-jain.jpg',
    objectPosition: 'top center',
  },
];
