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
      <section className="hero" aria-label="Hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <img
                src="/assests/LOGO.png"
                alt={company.name}
                className="hero__logo"
                width="200"
                height="200"
              />
              <p className="hero__brand-line text-accent">{company.brandLine}</p>
              <h1 className="hero__title">
                Your <span className="text-accent">Partner</span> For All Your Logistics Solutions
              </h1>
              <p className="hero__subtitle">{company.tagline}</p>
              <p className="hero__body">
                Reliable freight forwarding and supply chain solutions connecting Africa
                to Europe, the Middle East, Asia and beyond. From fresh produce to dangerous
                goods — we deliver confidence, continuity, and global connection.
              </p>
              <div className="hero__cta">
                <Link to="/contact" className="btn btn-lg btn-primary">
                  Get a Quote
                </Link>
                <Link to="/services/air-freight" className="btn btn-lg btn-outline">
                  Our Services
                </Link>
              </div>
            </div>
            <div className="hero__logo-card">
              <img
                src="/logo.svg"
                alt={company.name}
                className="hero__logo-card-img"
                width="300"
                height="300"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about" aria-labelledby="about-title">
        <div className="container">
          <div className="about__content">
            <div className="about__text">
              <h2 id="about-title">About Us</h2>
              <p className="about__body">
                At Ridgewill Global Logistics, logistics is more than moving cargo — it is
                about moving businesses forward. We specialize in reliable freight forwarding,
                cargo handling, customs clearance, export coordination and end-to-end supply
                chain solutions connecting Africa to the world.
              </p>
              <p className="about__body">
                From fresh produce and perishables to general cargo, dangerous goods and
                time-sensitive shipments, we ensure every consignment moves with precision,
                compliance and care. Every shipment carries deadlines, investments, customer
                promises and business reputation, so we focus on speed, transparency,
                communication and dependable execution.
              </p>
              <p className="about__body">
                Whether by air, sea or road, we open access to markets across Europe, the
                Middle East, Asia and beyond.
              </p>
            </div>
            <div className="about__promise card">
              <h3 className="about__promise-title">Our Promise</h3>
              <ul className="about__promise-list">
                <li>Speed — Fast, reliable transit times</li>
                <li>Transparency — Real-time tracking & updates</li>
                <li>Communication — Personal account management</li>
                <li>Dependable execution — Every shipment, every time</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="why-us" aria-labelledby="why-title">
        <div className="container">
          <h2 id="why-title" className="why-us__title">
            Why Ridgewill?
          </h2>
          <p className="why-us__subtitle">
            Speed, transparency, communication, and dependable execution — every time.
          </p>
          <div className="grid-2 grid-3">
            <div className="why-card card">
              <div className="why-card__icon" aria-hidden="true">
                ⚡
              </div>
              <h3 className="why-card__title">Speed</h3>
              <p className="why-card__text">
                Fast transit times with priority handling for urgent shipments.
              </p>
            </div>
            <div className="why-card card">
              <div className="why-card__icon" aria-hidden="true">
                🔍
              </div>
              <h3 className="why-card__title">Transparency</h3>
              <p className="why-card__text">
                Real-time tracking and proactive updates on your shipment status.
              </p>
            </div>
            <div className="why-card card">
              <div className="why-card__icon" aria-hidden="true">
                💬
              </div>
              <h3 className="why-card__title">Communication</h3>
              <p className="why-card__text">
                Dedicated account managers keeping you informed at every step.
              </p>
            </div>
            <div className="why-card card">
              <div className="why-card__icon" aria-hidden="true">
                🎯
              </div>
              <h3 className="why-card__title">Dependable Execution</h3>
              <p className="why-card__text">
                Precision in planning and reliability in delivery — always.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ceo" aria-labelledby="ceo-title">
        <div className="container">
          <h2 id="ceo-title">Leadership</h2>
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

      <section className="contacts" aria-labelledby="contacts-title">
        <div className="container">
          <h2 id="contacts-title">Our Contacts</h2>
          <p className="contacts__subtitle">
            Ready to ship? Get in touch with us via any of the channels below.
          </p>
          <div className="grid-2 grid-4">
            <div className="contact-card card">
              <div className="contact-card__icon" aria-hidden="true">
                📞
              </div>
              <h3 className="contact-card__title">Phone</h3>
              <a
                href={`tel:${company.phoneInternational}`}
                className="contact-card__value"
              >
                {company.phone}
              </a>
            </div>
            <div className="contact-card card">
              <div className="contact-card__icon" aria-hidden="true">
                📱
              </div>
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
              <div className="contact-card__icon" aria-hidden="true">
                ✉
              </div>
              <h3 className="contact-card__title">Email</h3>
              <a
                href={`mailto:${company.email}`}
                className="contact-card__value"
              >
                {company.email}
              </a>
            </div>
            <div className="contact-card card">
              <div className="contact-card__icon" aria-hidden="true">
                📝
              </div>
              <h3 className="contact-card__title">Request a Quote</h3>
              <Link to="/contact" className="contact-card__value link">
                Get a quotation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
