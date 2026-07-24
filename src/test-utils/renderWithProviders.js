// Shared test render helper.
//
// The real app i18n (src/i18n/index.js) loads locale JSON via async dynamic
// import() with `useSuspense: true`, plus a LanguageDetector and Google-Fonts
// DOM injection — none of which behave well in a synchronous jsdom test.
//
// So here we build a *separate* i18next instance from the statically-imported
// English locale files, with `useSuspense: false`, so translations resolve
// synchronously and tests can assert on real translated text.
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import enServices from '../locales/en/services.json';
import enArticles from '../locales/en/articles.json';

const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'services', 'articles'],
  defaultNS: 'common',
  resources: {
    en: { common: enCommon, services: enServices, articles: enArticles },
  },
  interpolation: { escapeValue: false },
  returnObjects: true,
  react: { useSuspense: false },
});

/**
 * Render a component wrapped in the i18n + Router providers it expects.
 * @param {React.ReactElement} ui
 * @param {{ route?: string }} [options] initial router entry (defaults to '/')
 */
export function renderWithProviders(ui, { route = '/' } = {}) {
  const Wrapper = ({ children }) => (
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </I18nextProvider>
  );
  return render(ui, { wrapper: Wrapper });
}

// The test i18n instance, exposed so tests can compute expected strings via t().
export { testI18n };

// Re-export the Testing Library API so test files import from a single place.
export * from '@testing-library/react';
