import { Link } from 'react-router-dom';
import { company } from '../content/company';
import { ceo } from '../content/ceo';
import { Seo } from '../components/Seo';

export function HomePage() {
  const ceoName = ceo.name;
  const ceoInitials =
    ceo.photo === ''
      ? ceoName.length > 1
        ? ceoName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
        : 'RG'
      : null;

  return (
    <>
      <Seo title="Home" description={company.tagline} />

      {/* ===== Hero: white split layout ===== */}
      <section className="hero" aria-label="Hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <p className="hero__eyebrow">
                <span className="hero__eyebrow-dot" aria-hidden="true"></span>
                Africa to the world
              </p>

              <h1 className="hero__title">
                Global logistics, delivered with{' '}
                <span className="hero__title-highlight">confidence</span>.
              </h1>

              <p className="hero__body">
                Reliable freight forwarding and end-to-end supply chain
                solutions connecting Africa to Europe, the Middle East, Asia
                and beyond. From fresh produce to dangerous goods, we deliver
                with precision, compliance and care.
              </p>

              <div className="hero__cta">
                <Link to="/contact" className="btn btn-lg btn-primary">
                  Get a Quote
                </Link>
                <Link
                  to="/services/air-freight"
                  className="btn btn-lg btn-outline"
                >
                  Our Services
                </Link>
              </div>

              <ul className="hero__chips" aria-label="Services at a glance">
                <li className="chip">
                  <PlaneIcon />
                  Air
                </li>
                <li className="chip">
                  <ShipIcon />
                  Sea
                </li>
                <li className="chip">
                  <TruckIcon />
                  Road
                </li>
                <li className="chip">
                  <ShieldIcon />
                  Customs
                </li>
              </ul>
            </div>

            <div className="hero__media">
              <div className="hero__image-card">
                <picture>
                  <source
                    media="(max-width: 1023px)"
                    srcSet="/hero-mobile.webp"
                    width="800"
                    height="500"
                  />
                  <source
                    media="(min-width: 1024px)"
                    srcSet="/hero-desktop.webp"
                    width="1200"
                    height="900"
                  />
                  <img
                    src="/hero-desktop.webp"
                    alt="Container ship loading cargo at a port, ready for global freight forwarding"
                    width="1200"
                    height="900"
                    fetchPriority="high"
                  />
                </picture>
                <p className="hero__float">
                  <ShipIcon />
                  Air · Sea · Road
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="trust-strip" aria-label="Why choose Ridgewill">
        <div className="container">
          <ul className="trust-strip__list">
            <li className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                <GlobeIcon />
              </span>
              Africa to Europe, the Middle East and Asia
            </li>
            <li className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                <LinkIcon />
              </span>
              End-to-end supply chain
            </li>
            <li className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                <ShieldCheckIcon />
              </span>
              Compliance-first handling
            </li>
            <li className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                <ChatIcon />
              </span>
              Transparent communication
            </li>
          </ul>
        </div>
      </section>

      {/* ===== About ===== */}
      <section
        className="section section--offwhite"
        aria-labelledby="about-title"
      >
        <div className="container">
          <div className="section__header">
            <p className="section-eyebrow">About us</p>
            <h2 id="about-title">Moving African cargo to the world</h2>
          </div>
          <div className="about__content">
            <div className="about__text">
              <p className="about__body">
                At Ridgewill Global Logistics, logistics is more than moving
                cargo — it is about moving businesses forward. We specialize
                in reliable freight forwarding, cargo handling, customs
                clearance, export coordination and end-to-end supply chain
                solutions connecting Africa to the world.
              </p>
              <p className="about__body about__body--muted">
                From fresh produce and perishables to general cargo, dangerous
                goods and time-sensitive shipments, we ensure every consignment
                moves with precision, compliance and care. Every shipment
                carries deadlines, investments, customer promises and business
                reputation, so we focus on speed, transparency, communication
                and dependable execution.
              </p>
              <p className="about__body">
                Whether by air, sea or road, we open access to markets across
                Europe, the Middle East, Asia and beyond.
              </p>
            </div>

            <div className="highlight-panel">
              <h3 className="highlight-panel__title">Our Promise</h3>
              <ul className="highlight-panel__list">
                <li>
                  <CheckIcon />
                  <span>
                    <strong>Speed</strong> — Fast, reliable transit times
                  </span>
                </li>
                <li>
                  <CheckIcon />
                  <span>
                    <strong>Transparency</strong> — Real-time tracking &amp;
                    updates
                  </span>
                </li>
                <li>
                  <CheckIcon />
                  <span>
                    <strong>Communication</strong> — Personal account
                    management
                  </span>
                </li>
                <li>
                  <CheckIcon />
                  <span>
                    <strong>Dependable execution</strong> — Every shipment,
                    every time
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why Ridgewill ===== */}
      <section
        className="section section--white"
        aria-labelledby="why-title"
      >
        <div className="container">
          <div className="section__header section__header--center">
            <p className="section-eyebrow">Why Ridgewill</p>
            <h2 id="why-title">Why Ridgewill?</h2>
            <p className="section__subtitle">
              Speed, transparency, communication, and dependable execution —
              every time.
            </p>
          </div>
          <div className="grid-2 grid-4">
            <div className="why-card card">
              <span className="why-card__icon" aria-hidden="true">
                <BoltIcon />
              </span>
              <h3 className="why-card__title">Speed</h3>
              <p className="why-card__text">
                Fast transit times with priority handling for urgent
                shipments.
              </p>
            </div>
            <div className="why-card card">
              <span className="why-card__icon" aria-hidden="true">
                <EyeIcon />
              </span>
              <h3 className="why-card__title">Transparency</h3>
              <p className="why-card__text">
                Real-time tracking and proactive updates on your shipment
                status.
              </p>
            </div>
            <div className="why-card card">
              <span className="why-card__icon" aria-hidden="true">
                <ChatIcon />
              </span>
              <h3 className="why-card__title">Communication</h3>
              <p className="why-card__text">
                Dedicated account managers keeping you informed at every step.
              </p>
            </div>
            <div className="why-card card">
              <span className="why-card__icon" aria-hidden="true">
                <TargetIcon />
              </span>
              <h3 className="why-card__title">Dependable Execution</h3>
              <p className="why-card__text">
                Precision in planning and reliability in delivery — always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Leadership ===== */}
      <section
        className="section section--offwhite"
        aria-labelledby="ceo-title"
      >
        <div className="container">
          <div className="section__header">
            <p className="section-eyebrow">Leadership</p>
            <h2 id="ceo-title">Leadership</h2>
          </div>
          <div className="ceo__content">
            <div className="ceo__photo">
              {ceo.photo ? (
                <img
                  src={ceo.photo}
                  alt={ceo.name}
                  className="ceo__photo-img"
                  width="200"
                  height="200"
                  loading="lazy"
                />
              ) : (
                <div className="ceo__initials" aria-label={`Photo of ${ceo.name}`}>
                  {ceoInitials}
                </div>
              )}
            </div>
            <div className="ceo__message">
              <h3 className="ceo__name">{ceo.name}</h3>
              <p className="ceo__title">{ceo.title}</p>
              <p className="ceo__text">{ceo.message}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contacts ===== */}
      <section
        className="section section--white"
        aria-labelledby="contacts-title"
      >
        <div className="container">
          <div className="section__header">
            <p className="section-eyebrow">Contacts</p>
            <h2 id="contacts-title">Our Contacts</h2>
            <p className="section__subtitle contacts__subtitle">
              Ready to ship? Get in touch with us via any of the channels
              below.
            </p>
          </div>
          <div className="grid-2 grid-4">
            <div className="contact-card card">
              <span className="contact-card__icon" aria-hidden="true">
                <PhoneIcon />
              </span>
              <h3 className="contact-card__title">Phone</h3>
              <a
                href={`tel:${company.phoneInternational}`}
                className="contact-card__value"
              >
                {company.phone}
              </a>
            </div>
            <div className="contact-card card">
              <span className="contact-card__icon" aria-hidden="true">
                <SocialIcon />
              </span>
              <h3 className="contact-card__title">WhatsApp</h3>
              <a
                href={company.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card__value"
              >
                Chat with us
              </a>
            </div>
            <div className="contact-card card">
              <span className="contact-card__icon" aria-hidden="true">
                <MailIcon />
              </span>
              <h3 className="contact-card__title">Email</h3>
              <a
                href={`mailto:${company.email}`}
                className="contact-card__value"
              >
                {company.email}
              </a>
            </div>
            <div className="contact-card card">
              <span className="contact-card__icon" aria-hidden="true">
                <QuoteIcon />
              </span>
              <h3 className="contact-card__title">Request a Quote</h3>
              <Link to="/contact" className="contact-card__value">
                Get a quotation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ===== Inline SVG icons (gold-deep via currentColor) ===== */

function PlaneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function ShipIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1" />
      <path d="M4 18l-1-5h18l-2 5" />
      <path d="M5 13V7h14v6" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18h-5" />
      <path d="M15 8h4l4 4v4a1 1 0 0 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function GlobeIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LinkIcon() {
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ShieldCheckIcon() {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ChatIcon() {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
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

function SocialIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.52-.52s.347-.297.52-.52.402-.198.497-.299c.095-.099.074-.148-.023-.272-.099-.124-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01a1.06 1.06 0 0 0-.793.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
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

function QuoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15h6" />
      <path d="M9 11h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default HomePage;
