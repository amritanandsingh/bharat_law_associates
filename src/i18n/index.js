import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { LANGUAGES, getLanguage } from './languages';

// Google Fonts injected only when a script has poor device coverage.
const SCRIPT_FONTS = {
  'ol-chiki': 'Noto+Sans+Ol+Chiki',
  'meetei-mayek': 'Noto+Sans+Meetei+Mayek',
  nastaliq: 'Noto+Nastaliq+Urdu',
};

const loadedFonts = new Set();

const loadScriptFontIfNeeded = (script) => {
  const family = SCRIPT_FONTS[script];
  if (!family || loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;600&display=swap`;
  document.head.appendChild(link);
};

i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend((lng, ns) => import(`../locales/${lng}/${ns}.json`))
  )
  .use(initReactI18next)
  .init({
    supportedLngs: LANGUAGES.map((l) => l.code),
    fallbackLng: {
      mai: ['hi', 'en'],
      doi: ['hi', 'en'],
      sa: ['hi', 'en'],
      brx: ['hi', 'en'],
      kok: ['hi', 'en'],
      default: ['en'],
    },
    load: 'currentOnly',
    ns: ['common'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    returnObjects: true,
    react: { useSuspense: true },
  });

i18n.on('languageChanged', (lng) => {
  const meta = getLanguage(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = meta?.dir ?? 'ltr';
  loadScriptFontIfNeeded(meta?.script);
});

export default i18n;
