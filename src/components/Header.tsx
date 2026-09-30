import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { services } from '../content/services';
import { company } from '../content/company';
import { ThemeToggle } from './ThemeToggle';
import { SocialIcon } from './SocialIcon';

export function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const servicesBtnRef = useRef<HTMLButtonElement | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    }

    if (servicesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    document.addEventListener('keydown', handleEscape as never);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape as never);
    };
  }, [servicesOpen]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleServicesDropdown = () => setServicesOpen((prev) => !prev);
  const closeServicesDropdown = () => setServicesOpen(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    if (mobileMenuOpen) {
      setServicesMobileOpen(false);
    }
  };

  const handleServiceClick = () => {
    closeServicesDropdown();
    setMobileMenuOpen(false);
    setServicesMobileOpen(false);
  };

  const handleServicesKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      toggleServicesDropdown();
      setTimeout(() => servicesBtnRef.current?.focus(), 0);
    }
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} role="banner">
      <div className="header__topbar container">
        <div className="header__topbar-left">
          <span className="header__topbar-item">
            <PhoneIcon />
            <a href={`tel:${company.phoneInternational}`}>{company.phone}</a>
          </span>
          <span className="header__topbar-item">
            <EmailIcon />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </span>
          <span className="header__topbar-item">
            <LocationIcon />
            <span>{company.address}</span>
          </span>
        </div>
        <div className="header__topbar-right">
          {company.socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="header__social-link"
              aria-label={link.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon name={link.name} />
            </a>
          ))}
        </div>
      </div>

      <div className="header__container container">
        <Link to="/" className="header__logo" aria-label={company.name}>
          <img src="/logo.png" alt={company.name} className="header__logo-img" />
          <span className="header__logo-text">{company.name}</span>
        </Link>

        <nav className="header__nav" role="navigation" aria-label="Main">
          <div className="header__nav-list">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `header__nav-link${isActive ? ' router-active' : ''}`
              }
            >
              Home
            </NavLink>

            <div className="header__nav-item" ref={dropdownRef}>
              <button
                ref={servicesBtnRef}
                type="button"
                className={`header__nav-link header__services-toggle ${
                  servicesOpen ? 'open' : ''
                }`}
                onClick={toggleServicesDropdown}
                onKeyDown={handleServicesKeyDown}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                aria-controls="services-dropdown"
              >
                Services
                <span className={`header__arrow ${servicesOpen ? 'open' : ''}`} aria-hidden="true">
                  ▼
                </span>
              </button>

              <div
                id="services-dropdown"
                className={`header__dropdown ${servicesOpen ? 'open' : ''}`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="services-menu-button"
              >
                <ul>
                  {services.map((service) => (
                    <li key={service.id}>
                        <Link
                        to={`/services/${service.slug}`}
                        className="header__dropdown-link"
                        role="menuitem"
                        onClick={handleServiceClick}
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `header__nav-link${isActive ? ' router-active' : ''}`
              }
            >
              Portfolio
            </NavLink>

            <NavLink
              to="/track"
              className={({ isActive }) =>
                `header__nav-link${isActive ? ' router-active' : ''}`
              }
            >
              Track
            </NavLink>
          </div>

          <Link to="/contact" className="btn btn-gold header__contact-btn">
            Contact Us
          </Link>

          <ThemeToggle enabled={darkMode} onToggle={setDarkMode} />
        </nav>

        <button
          type="button"
          className="header__hamburger"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMobileMenu}
        >
          <span className={`header__hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`header__hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`header__hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile"
      >
        <div className="header__mobile-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `header__mobile-link${isActive ? ' router-active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>

          <button
            type="button"
            className={`header__mobile-link header__mobile-services-toggle ${
              servicesMobileOpen ? 'open' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              setServicesMobileOpen((prev) => !prev);
            }}
            aria-expanded={servicesMobileOpen}
            aria-controls="mobile-services-list"
          >
            Services
            <span className={`header__arrow ${servicesMobileOpen ? 'open' : ''}`} aria-hidden="true">
              ▼
            </span>
          </button>

          <div
            id="mobile-services-list"
            className={`header__mobile-services ${servicesMobileOpen ? 'open' : ''}`}
          >
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="header__mobile-link"
                        role="menuitem"
                        onClick={handleServiceClick}
                      >
                        {service.title}
                      </Link>
                </li>
              ))}
            </ul>
          </div>

          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              `header__mobile-link${isActive ? ' router-active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Portfolio
          </NavLink>

          <Link
            to="/contact"
            className="header__mobile-link header__mobile-cta btn-gold"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67 2 2 0 0 1 4.71-.25A2.5 2.5 0 0 1 10 6.5V10a2.5 2.5 0 0 1-2.4 2.4A12.89 12.89 0 0 0 12 19.4a12.69 12.69 0 0 0 5.3-2.13A2.5 2.5 0 0 1 21 14v-3z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h6l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6l2 2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
