import { useRef } from 'react';
import { company } from '../content/company';
import { services } from '../content/services';
import { Link, useNavigate } from 'react-router-dom';
import { SocialIcon } from './SocialIcon';

const YEAR = new Date().getFullYear();

/** Taps needed, and the window they must fall inside. */
const SECRET_TAP_COUNT = 5;
const SECRET_TAP_WINDOW_MS = 3000;

export function Footer() {
  const navigate = useNavigate();
  const socialLinks = company.socialLinks || [];
  // Held in a ref so that ordinary taps never trigger a re-render.
  const tapTimes = useRef<number[]>([]);

  /**
   * Undisclosed route to the staff area for people who already work here.
   * Not a security boundary: Row Level Security is what actually protects
   * shipment data, and this only avoids advertising the panel.
   */
  const handleSymbolTap = () => {
    const now = Date.now();
    const recent = tapTimes.current.filter((t) => now - t <= SECRET_TAP_WINDOW_MS);
    recent.push(now);
    tapTimes.current = recent;

    if (recent.length >= SECRET_TAP_COUNT) {
      tapTimes.current = [];
      navigate('/admin');
    }
  };

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services/air-freight' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Track a shipment', to: '/track' },
    { label: 'Contact us', to: '/contact' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__container">
          <div className="footer__top">
            {/* Brand: logo on a white rounded tile + the single tagline */}
            <div className="footer__brand">
              <Link to="/" className="footer__logo-link" aria-label={company.name}>
                <span className="footer__logo-tile">
                  <img
                    src="/logo-240.png"
                    alt=""
                    className="footer__logo"
                    width="240"
                    height="240"
                    loading="lazy"
                  />
                </span>
                <span className="footer__logo-text">{company.name}</span>
              </Link>
              <p className="footer__tagline">{company.tagline}</p>
            </div>

            {/* Quick links */}
            <nav aria-label="Footer">
              <h3 className="footer__title">Quick links</h3>
              <ul className="footer__links">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services */}
            <nav aria-label="Services">
              <h3 className="footer__title">Services</h3>
              <ul className="footer__links">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="footer__link"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact details and socials */}
            <div>
              <h3 className="footer__title">Contact</h3>
              <ul className="footer__contact-list">
                <li>
                  <a
                    href={`tel:${company.phoneInternational}`}
                    className="footer__contact-link"
                  >
                    <span className="footer__contact-icon" aria-hidden="true">
                      <PhoneIcon />
                    </span>
                    {company.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={company.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__contact-link"
                    aria-label="WhatsApp"
                  >
                    <span className="footer__contact-icon" aria-hidden="true">
                      <SocialIcon name="WhatsApp" size={18} />
                    </span>
                    WhatsApp chat
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="footer__contact-link"
                    aria-label={`Email us at ${company.email}`}
                  >
                    <span className="footer__contact-icon" aria-hidden="true">
                      <EmailIcon />
                    </span>
                    {company.email}
                  </a>
                </li>
                <li>
                  <span className="footer__contact-link">
                    <span className="footer__contact-icon" aria-hidden="true">
                      <LocationIcon />
                    </span>
                    {company.address}
                  </span>
                </li>
              </ul>

              {socialLinks.length > 0 && (
                <ul className="footer__social-list">
                  {socialLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                        className="footer__social-link"
                      >
                        <SocialIcon name={link.name} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              <span className="footer__copyright-symbol" onClick={handleSymbolTap}>
                &copy;
              </span>{' '}
              {YEAR} {company.name}. All rights reserved.
            </p>
            <p className="footer__privacy">
              Shipment tracking stores your name, email and phone number only to send
              you updates about your own consignment. Tracking pages never display
              your contact details. We keep your data in line with Kenya's Data
              Protection Act, 2019.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
