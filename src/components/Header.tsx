import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { services } from '../content/services';
import { company } from '../content/company';
import { SocialIcon } from './SocialIcon';

export function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const servicesBtnRef = useRef<HTMLButtonElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  const location = useLocation();

  // Close the desktop dropdown on outside click
  useEffect(() => {
    if (!servicesOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [servicesOpen]);

  // Escape closes dropdown and mobile menu
  useEffect(() => {
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        setServicesMobileOpen(false);
        hamburgerRef.current?.focus();
      }
      if (servicesOpen) {
        setServicesOpen(false);
        servicesBtnRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, servicesOpen]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close the mobile menu on outside tap
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
        setServicesMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [mobileMenuOpen]);

  // Close the mobile menu on navigation (derived during render, per React docs)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    setMobileMenuOpen(false);
    setServicesMobileOpen(false);
    setServicesOpen(false);
  }

  // Simple focus trap inside the mobile menu while it is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleTab(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusables = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleServicesDropdown = () => setServicesOpen((prev) => !prev);

  const handleServicesKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setServicesOpen(true);
      setTimeout(() => servicesBtnRef.current?.focus(), 0);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      if (prev) setServicesMobileOpen(false);
      return !prev;
    });
  };

  return (
    <header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      role="banner"
      ref={headerRef}
    >
      {/* Contact bar: one slim row on desktop, hidden on mobile */}
      <div className="header__topbar">
        <div className="container">
          <div className="header__topbar-left">
            <span className="header__topbar-item">
              <PhoneIcon />
              <a href={`tel:${company.phoneInternational}`}>
                {company.phone}
              </a>
            </span>
            <span className="header__topbar-item">
              <EmailIcon />
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </span>
            <span className="header__topbar-item header__topbar-item--muted">
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
                <SocialIcon name={link.name} size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="header__container container">
        <Link to="/" className="header__logo" aria-label={company.name}>
          <img
            src="/logo-240.png"
            alt={company.name}
            className="header__logo-img"
            width="240"
            height="240"
          />
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
                  servicesOpen ? 'open' : ''}`}
                onClick={toggleServicesDropdown}
                onKeyDown={handleServicesKeyDown}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                aria-controls="services-dropdown"
              >
                Services
                <span
                  className={`header__arrow ${servicesOpen ? 'open' : ''}`}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              <div
                id="services-dropdown"
                className={`header__dropdown ${servicesOpen ? 'open' : ''}`}
                role="menu"
                aria-orientation="vertical"
                aria-label="Services"
              >
                <ul>
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="header__dropdown-link"
                        role="menuitem"
                        onClick={() => setServicesOpen(false)}
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
            Get a Quote
          </Link>
        </nav>

        {/* Mobile actions: Call, WhatsApp, menu */}
        <div className="header__actions">
          <a
            className="header__action-btn"
            href={`tel:${company.phoneInternational}`}
            aria-label="Call us"
          >
            <PhoneIcon size={22} />
          </a>
          <a
            className="header__action-btn"
            href={company.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <SocialIcon name="WhatsApp" size={22} />
          </a>
          <button
            ref={hamburgerRef}
            type="button"
            className="header__hamburger"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMobileMenu}
          >
            <span className="header__hamburger-line" aria-hidden="true"></span>
            <span className="header__hamburger-line" aria-hidden="true"></span>
            <span className="header__hamburger-line" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu: full-width white panel under the header */}
      <div
        id="mobile-menu"
        className={`header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile"
        ref={menuRef}
      >
        <nav className="header__mobile-nav">
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
              servicesMobileOpen ? 'open' : ''}`}
            onClick={() => setServicesMobileOpen((prev) => !prev)}
            aria-expanded={servicesMobileOpen}
            aria-controls="mobile-services-list"
          >
            Services
            <span
              className={`header__arrow ${servicesMobileOpen ? 'open' : ''}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          <div
            id="mobile-services-list"
            className={`header__mobile-services ${
              servicesMobileOpen ? 'open' : ''}`}
          >
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="header__mobile-link"
                    onClick={() => setMobileMenuOpen(false)}
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

          <NavLink
            to="/track"
            className={({ isActive }) =>
              `header__mobile-link${isActive ? ' router-active' : ''}`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Track
          </NavLink>

          <Link
            to="/contact"
            className="btn btn-gold header__mobile-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get a Quote
          </Link>

          <div className="header__mobile-contact">
            <a
              className="header__mobile-contact-item"
              href={`tel:${company.phoneInternational}`}
            >
              <PhoneIcon />
              <span>{company.phone}</span>
            </a>
            <a
              className="header__mobile-contact-item"
              href={`mailto:${company.email}`}
            >
              <EmailIcon />
              <span>{company.email}</span>
            </a>
            <span className="header__mobile-contact-item">
              <LocationIcon />
              <span>{company.address}</span>
            </span>
          </div>

          <div className="header__mobile-socials">
            {company.socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="header__social-link"
                aria-label={link.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={link.name} size={22} />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67 2 2 0 0 1 4.71-.25A2.5 2.5 0 0 1 10 6.5V10a2.5 2.5 0 0 1-2.4 2.4A12.89 12.89 0 0 0 12 19.4a12.69 12.69 0 0 0 5.3-2.13A2.5 2.5 0 0 1 21 14v-3z" />
    </svg>
  );
}

function EmailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function LocationIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
