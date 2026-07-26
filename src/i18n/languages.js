// English + all 22 languages of the Eighth Schedule of the Constitution of India.
// nativeName is always shown in its own script (never translated).
// script: font hint for on-demand Google Fonts injection (see i18n/index.js).

export const LANGUAGES = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', script: 'latin' },
  { code: 'as', nativeName: 'অসমীয়া', englishName: 'Assamese', dir: 'ltr', script: 'bengali' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', dir: 'ltr', script: 'bengali' },
  { code: 'brx', nativeName: 'बड़ो', englishName: 'Bodo', dir: 'ltr', script: 'devanagari' },
  { code: 'doi', nativeName: 'डोगरी', englishName: 'Dogri', dir: 'ltr', script: 'devanagari' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', dir: 'ltr', script: 'gujarati' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', script: 'devanagari' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', dir: 'ltr', script: 'kannada' },
  { code: 'ks', nativeName: 'كٲشُر', englishName: 'Kashmiri', dir: 'rtl', script: 'arabic' },
  { code: 'kok', nativeName: 'कोंकणी', englishName: 'Konkani', dir: 'ltr', script: 'devanagari' },
  { code: 'mai', nativeName: 'मैथिली', englishName: 'Maithili', dir: 'ltr', script: 'devanagari' },
  { code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam', dir: 'ltr', script: 'malayalam' },
  { code: 'mni', nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ', englishName: 'Manipuri (Meitei)', dir: 'ltr', script: 'meetei-mayek' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', dir: 'ltr', script: 'devanagari' },
  { code: 'ne', nativeName: 'नेपाली', englishName: 'Nepali', dir: 'ltr', script: 'devanagari' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia', dir: 'ltr', script: 'oriya' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', dir: 'ltr', script: 'gurmukhi' },
  { code: 'sa', nativeName: 'संस्कृतम्', englishName: 'Sanskrit', dir: 'ltr', script: 'devanagari' },
  { code: 'sat', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', englishName: 'Santali', dir: 'ltr', script: 'ol-chiki' },
  { code: 'sd', nativeName: 'سنڌي', englishName: 'Sindhi', dir: 'rtl', script: 'arabic' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', dir: 'ltr', script: 'tamil' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', dir: 'ltr', script: 'telugu' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', dir: 'rtl', script: 'nastaliq' },
];

export const SUGGESTED_CODES = ['en', 'hi', 'bn', 'ur'];

export const getLanguage = (code) => LANGUAGES.find((l) => l.code === code);

// Languages Amazon Translate can auto-translate Articles posts into.
// The remaining 12 Eighth Schedule languages are unsupported by Amazon Translate
// and fall back at read time (see POST_FALLBACK + src/lib/postText.js). This is
// consistent with the site footer note: "in case of any difference, the English
// version prevails."
export const TRANSLATE_SUPPORTED = [
  'en', 'hi', 'bn', 'gu', 'kn', 'ml', 'mr', 'pa', 'ta', 'te', 'ur',
];

// Read-time fallback for unsupported languages: Devanagari-script languages fall
// back to Hindi (itself a translated target); everything else falls back to
// English. Codes not listed here fall straight through to English.
export const POST_FALLBACK = {
  brx: ['hi'],
  doi: ['hi'],
  kok: ['hi'],
  mai: ['hi'],
  ne: ['hi'],
  sa: ['hi'],
};
