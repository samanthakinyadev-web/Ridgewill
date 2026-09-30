import { useState, useRef, useEffect, type KeyboardEvent, type ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { services } from '../content/services';
import { company } from '../content/company';
import { ThemeToggle } from './ThemeToggle';

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

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, ReactElement> = {
    WhatsApp: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.38 0 0 5.38 0 12c0 2.11.55 4.16 1.6 6.02L0 24l5.92-1.56c1.79 1 3.83 1.56 5.79 1.56 6.62 0 12-5.38 12-12 0-3.2-.5-6.3-1.93-9.18zM12 22c-1.85 0-3.67-.5-5.27-1.46l-.38-.22-3.52.92.93-3.43-.22-.37A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10z" />
        <path d="M17.53 13.92c-.36-.19-2.08-.86-2.08-.86s-.26-.13-.26-.33c0-.21 0-.38.26-.33.32.05 2.08.86 2.08.86.36.19.36.26.36.38 0 .21-0 3.53-0 3.53 0 .21-0 .26-0.14.4-.14.14-2.08-.86-3.64-1.62-1.62s-.86-2.08-.86-2.08v-.26c0-.21-.07-.38-.07-.38s-.07-2.71-.1-3.64c-.02-.93.25-1.56 0-1.93-.25-.38-.86-.73-1.26-.77-1.13-.38-2.6-.1-3.33-.12-.04.21-.17.54-.63.94-.4.36-.86.76-.86 1.56 0 .33-.04 1.15-0.04 2.42 0 1.27.07 2.29 0 3.02.33.72 1.91 3.1 4.51 4.29 1.56.66 2.79.66 3.74.54 1.74-.28 2.68-.88 3.06-1.41.38-.53.08-.1 0 .42-2.16 2.86-2.36 3-3.01 3.12-.33.03-.65.05-.65.05z" />
      </svg>
    ),
    LinkedIn: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v5.79zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.93-2.07 2.06-2.07s2.07.93 2.07 2.07c0 1.15-.93 2.07-2.07 2.07z" />
      </svg>
    ),
    Facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.48v-9.294H9.692V11.41h3.41-0.01V8.414c0-3.1 1.894-4.788 4.66-4.788 1.34 0 2.48.113 2.48.113v2.816h-1.386c-1.376 0-1.834.62-1.834 1.775v2.307h3.68l-.66 3.696h-2.61V24h5.123c.728 0 1.326-.6 1.326-1.326V1.326C24 .6 23.4 0 22.675 0" />
      </svg>
    ),
  };
  return icons[name] || null;
}
