import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import QuickActions from '../components/quick-actions/QuickActions';

const RootLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <a className="skip-link" href="#main">
        {t('a11y.skipToContent')}
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <QuickActions />
    </>
  );
};

export default RootLayout;
