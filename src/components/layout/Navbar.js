import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaPhoneAlt } from 'react-icons/fa';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { CATEGORIES, getServicesByCategory } from '../../data/services';
import { SITE } from '../../config/site';
import { buildTelUrl } from '../../utils/contactLinks';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/practice-areas', key: 'nav.practiceAreas', dropdown: true },
  { to: '/courts-we-practice-in', key: 'nav.courts' },
  { to: '/about-us', key: 'nav.aboutUs' },
  { to: '/articles', key: 'nav.articles' },
  { to: '/documents', key: 'nav.documents' },
  { to: '/contact-us', key: 'nav.contactUs' },
  { to: '/join-us', key: 'nav.joinUs' },
];

const Navbar = () => {
  const { t } = useTranslation(['common', 'services']);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setDropdownOpen(false);
      }
    };
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <header className={`navbar ${scrolled || !isHome ? 'navbar-solid' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" aria-label={SITE.name}>
            <Logo variant="dark" markSize={36} />
          </Link>

          <nav className="navbar-desktop" aria-label={t('a11y.mainNavigation')}>
            <ul className="navbar-links">
              {NAV_LINKS.map((link) =>
                link.dropdown ? (
                  <li key={link.to} className="navbar-dropdown" ref={dropdownRef}>
                    <button
                      type="button"
                      className="navbar-link navbar-dropdown-trigger"
                      aria-expanded={dropdownOpen}
                      onClick={() => setDropdownOpen((v) => !v)}
                    >
                      {t(link.key)}
                      <FaChevronDown size={10} aria-hidden="true" />
                    </button>
                    {dropdownOpen && (
                      <div className="navbar-dropdown-panel">
                        {CATEGORIES.map((cat) => (
                          <div key={cat.id} className="navbar-dropdown-col">
                            <Link
                              to={`/practice-areas#${cat.id}`}
                              className="navbar-dropdown-cat"
                            >
                              {t(`services.categories.${cat.id}.name`, { ns: 'services' })}
                            </Link>
                            <ul>
                              {getServicesByCategory(cat.id).map((s) => (
                                <li key={s.id}>
                                  <Link to={`/practice-areas/${s.id}`}>
                                    {t(`services.items.${s.id}.name`, { ns: 'services' })}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={link.to}>
                    <NavLink to={link.to} end={link.end} className="navbar-link">
                      {t(link.key)}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="navbar-actions">
            <LanguageSwitcher />
            <Link to="/contact-us" className="btn btn-gold navbar-cta">
              {t('nav.consultNow')}
            </Link>
            <button
              type="button"
              className={`navbar-burger ${drawerOpen ? 'is-open' : ''}`}
              aria-label={drawerOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Kept outside <header> so no containing-block-forming property on it
          (transform, filter, backdrop-filter) can ever trap these fixed panels. */}
      {drawerOpen && (
        <button
          type="button"
          className="drawer-overlay"
          aria-label={t('a11y.closeMenu')}
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside className={`drawer ${drawerOpen ? 'drawer-open' : ''}`} aria-hidden={!drawerOpen}>
        <nav aria-label={t('a11y.mainNavigation')}>
          <ul className="drawer-links">
            {NAV_LINKS.map((link, i) => (
              <li key={link.to} style={{ '--i': i }}>
                <NavLink to={link.to} end={link.end} className="drawer-link">
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="drawer-footer">
          <Link to="/contact-us" className="btn btn-gold btn-block">
            {t('nav.bookConsultation')}
          </Link>
          <a
            href={buildTelUrl(SITE.phones[0].e164)}
            className="drawer-phone ltr-isolate"
          >
            <FaPhoneAlt size={14} aria-hidden="true" /> {SITE.phones[0].display}
          </a>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
