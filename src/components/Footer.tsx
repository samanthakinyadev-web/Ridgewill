import { company } from '../content/company';
import { Link } from 'react-router-dom';
import { SocialIcon } from './SocialIcon';

const YEAR = new Date().getFullYear();

export function Footer() {
  const socialLinks = company.socialLinks || [];

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
            &copy; {YEAR} {company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
