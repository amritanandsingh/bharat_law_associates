// Lawyer display text (roles/bios) lives in locales/<lng>/common.json
// under about.lawyers.<id>; names, phone, email and photo stay untranslated.
// Photos are served from public/lawyers/ — a missing file falls back to initials.

export const LAWYERS = [
  {
    id: 'prem-prakash',
    name: 'Prem Prakash',
    qualification: 'B.A. LL.B, LL.M — University of Calcutta',
    founder: true,
    roleKey: 'about.founderRole',
    phone: '+919354456326',
    email: 'prem1249@gmail.com',
    photo: '/lawyers/prem-prakash.jpg',
    objectPosition: 'center 30%',
  },
  {
    id: 'shruti-jain',
    name: 'Shruti Jain',
    qualification: 'Post Graduate in Human Resource Development & Labour Welfare',
    founder: true,
    roleKey: 'about.coFounderRole',
    phone: '+918777394943',
    email: '',
    photo: '/lawyers/shruti-jain.jpg',
    objectPosition: 'top center',
  },
];
