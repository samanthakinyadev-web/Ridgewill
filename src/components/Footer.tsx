import { useRef } from 'react';
import { company } from '../content/company';
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

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo-link">
              <img src="/logo.png" alt={company.name} className="footer__logo" />
              <span className="footer__logo-text">{company.name}</span>
            </Link>
            <p className="footer__tagline">{company.tagline}</p>
          </div>

          <div className="footer__contacts">
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__contact-list">
              <li>
                <a
                  href={`tel:${company.phoneInternational}`}
                  className="footer__contact-link"
                >
                  <span className="footer__contact-icon" aria-hidden="true">
                    &#x1F4DE;
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
                    &#x1F4F1;
                  </span>
                  WhatsApp Chat
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="footer__contact-link"
                  aria-label={`Email us at ${company.email}`}
                >
                  <span className="footer__contact-icon" aria-hidden="true">
                    &#x2709;
                  </span>
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div className="footer__social">
              <h3 className="footer__title">Follow Us</h3>
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
            </div>
          )}
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
    </footer>
  );
}
