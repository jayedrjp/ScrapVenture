import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon, DownloadIcon, UserIcon, ChevronDownIcon, TruckIcon } from './icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const HOME_LINKS = [
  ['#top', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const AWARDS_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const MARKETPLACE_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const TEAM_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const BLOG_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const CONTACT_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const VARIANTS = {
  home: {
    headerClass: 'nav',
    brandHref: '#top',
    links: HOME_LINKS,
    desktopActive: 'Home',
    mobileActive: null,
    downloadHref: '#footer',
    pickupHref: '/book-pickup',
  },
  awards: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: AWARDS_LINKS,
    desktopActive: 'Awards',
    mobileActive: 'Awards',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  team: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: TEAM_LINKS,
    desktopActive: 'Our Team',
    mobileActive: 'Our Team',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  marketplace: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: MARKETPLACE_LINKS,
    desktopActive: 'MarketPlace',
    mobileActive: 'MarketPlace',
    downloadHref: '#footer',
    pickupHref: '/book-pickup',
  },
  bookPickup: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: MARKETPLACE_LINKS,
    desktopActive: 'Book a Pickup',
    mobileActive: 'Book a Pickup',
    downloadHref: '#footer',
    pickupHref: '/book-pickup',
  },
  collector: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: TEAM_LINKS,
    desktopActive: null,
    mobileActive: null,
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  blog: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: BLOG_LINKS,
    desktopActive: 'Blog',
    mobileActive: 'Blog',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  contact: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: CONTACT_LINKS,
    desktopActive: 'Contact',
    mobileActive: 'Contact',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
};

export default function Navbar({ variant, scrolled }) {
  const v = VARIANTS[variant] || VARIANTS.home;
  const [open, setOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef(null);
  const { currentUser, isLoggedIn, isCollector } = useAuth();
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
        setIsLoginDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsLoginDropdownOpen(false);
    };
    if (isLoginDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isLoginDropdownOpen]);

  return (
    <>
      <header className={v.headerClass + (scrolled ? ' scrolled' : '')} id="siteNav">
        <div className="wrap nav-row">
          <a href={v.brandHref} className="brand">
            <img src="/assets/images/logo.png" alt="ScrapVenture logo" />
          </a>
          <ul className="nav-links">
            {v.links.map(([href, label]) => {
              const isInternalRoute =
                href === '/marketplace' ||
                href === '/awards.html' ||
                href === '/awards' ||
                href === '/' ||
                href === '/team' ||
                href === '/become-a-collector' ||
                href === '/blog' ||
                href === '/blog.html';
              return (
                <li key={label}>
                  {isInternalRoute ? (
                    <Link to={href} className={label === v.desktopActive ? 'active' : undefined}>
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className={label === v.desktopActive ? 'active' : undefined}>
                      {label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="nav-actions">
            <a
              href={v.downloadHref}
              className="btn btn-outline nav-download-btn"
            >
              <DownloadIcon size={16} />
              <span>Download App</span>
            </a>

            {isLoggedIn ? (
              <Link
                to={isCollector ? '/collector/dashboard' : '/dashboard'}
                className="nav-profile-btn"
                title={currentUser?.name ? `${currentUser.name} (Dashboard)` : 'My Dashboard'}
                aria-label="My Dashboard Profile"
              >
                <UserIcon size={21} strokeWidth="2.4" />
              </Link>
            ) : (
              <div className="nav-login-dropdown-wrapper" ref={loginDropdownRef}>
                <button
                  type="button"
                  className={`btn btn-solid nav-login-btn ${isLoginDropdownOpen ? 'active' : ''}`}
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  aria-expanded={isLoginDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Login options"
                >
                  <span>Login</span>
                  <ChevronDownIcon size={14} className={`nav-login-chevron ${isLoginDropdownOpen ? 'rotate' : ''}`} />
                </button>

                {isLoginDropdownOpen && (
                  <div className="nav-login-dropdown-menu">
                    <Link
                      to="/login"
                      className="nav-login-dropdown-item"
                      onClick={() => setIsLoginDropdownOpen(false)}
                    >
                      <span className="nav-login-item-icon">
                        <UserIcon size={16} />
                      </span>
                      <span className="nav-login-item-text">User Login</span>
                    </Link>
                    <Link
                      to="/collector/login"
                      className="nav-login-dropdown-item"
                      onClick={() => setIsLoginDropdownOpen(false)}
                    >
                      <span className="nav-login-item-icon">
                        <TruckIcon size={16} />
                      </span>
                      <span className="nav-login-item-text">Collector Login</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              className={'burger' + (open ? ' open' : '')}
              id="burgerBtn"
              aria-label="Open menu"
              onClick={() => setOpen(!open)}
            >
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={'mobile-menu' + (open ? ' open' : '')} id="mobileMenu">
        {v.links.map(([href, label]) => {
          const isInternalRoute =
            href === '/marketplace' ||
            href === '/awards.html' ||
            href === '/awards' ||
            href === '/' ||
            href === '/team' ||
            href === '/become-a-collector' ||
            href === '/blog' ||
            href === '/blog.html';
          return isInternalRoute ? (
            <Link
              key={label}
              to={href}
              className={label === v.mobileActive ? 'active' : undefined}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href={href}
              className={label === v.mobileActive ? 'active' : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          );
        })}
        <a
          href={v.downloadHref}
          className="btn btn-outline"
          onClick={closeMenu}
          style={{ marginBottom: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <DownloadIcon size={18} />
          <span>Download App</span>
        </a>

        {isLoggedIn ? (
          <Link
            to={isCollector ? '/collector/dashboard' : '/dashboard'}
            className="btn btn-solid"
            onClick={closeMenu}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <UserIcon size={18} />
            <span>Dashboard ({currentUser?.name?.split(' ')[0] || 'My Account'})</span>
          </Link>
        ) : (
          <div className="mobile-login-options">
            <Link
              to="/login"
              className="btn btn-solid mobile-login-btn"
              onClick={closeMenu}
            >
              <UserIcon size={16} />
              <span>User Login</span>
            </Link>
            <Link
              to="/collector/login"
              className="btn btn-outline mobile-login-btn"
              onClick={closeMenu}
            >
              <TruckIcon size={16} />
              <span>Collector Login</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
