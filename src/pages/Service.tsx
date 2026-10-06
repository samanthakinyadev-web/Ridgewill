import { Link, useParams, Navigate } from 'react-router-dom';
import { serviceBySlug, services, type Service } from '../content/services';
import { Seo } from '../components/Seo';

export function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service: Service | undefined = slug ? serviceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  return (
    <article className="service-page" aria-labelledby={`service-title-${service.id}`}>
      <Seo title={service.title} description={service.intro} />
      <section
        className="service-page__hero"
        aria-labelledby={`service-title-${service.id}`}
      >
        <div className="container">
          <div className="service-page__hero-grid">
            <div>
              <p className="section-eyebrow">Our services</p>
              <div
                className="service-page__icon"
                aria-hidden="true"
                style={{ fontSize: '2rem' }}
              >
                {service.icon}
              </div>
              <h1 id={`service-title-${service.id}`}>{service.title}</h1>
              <p className="service-page__tagline">{service.tagline}</p>
              <p className="service-page__intro">{service.intro}</p>
            </div>
            {service.image && (
              <div className="service-page__image-card">
                <img
                  src={service.image}
                  alt={`${service.title} — ${service.tagline}`}
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="service-page__offers" aria-labelledby="what-we-offer">
        <div className="container">
          <div className="section__header">
            <p className="section-eyebrow">What we offer</p>
            <h2 id="what-we-offer">What We Offer</h2>
          </div>
          <div className="grid-2">
            {service.highlights.map((highlight, index) => (
              <div key={index} className="offer-card card">
                <span className="offer-card__icon" aria-hidden="true">
                  <CheckIcon />
                </span>
                <p className="offer-card__text">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="service-page__ideal" aria-labelledby="ideal-for">
        <div className="container">
          <h2 id="ideal-for">Ideal For</h2>
          <p className="service-page__ideal-text">{service.idealFor}</p>
        </div>
      </section>

      <section className="service-page__cta" aria-label="Request a quote">
        <div className="container">
          <div className="service-page__cta-content card">
            <h2>Need this service?</h2>
            <p>Request a quotation and get a fast response.</p>
            <Link
              to={`/contact?s=${encodeURIComponent(service.title)}`}
              className="btn btn-lg btn-primary"
            >
              Request a {service.shortName} quote
            </Link>
          </div>
        </div>
      </section>

      <section className="service-page__related" aria-labelledby="other-services">
        <div className="container">
          <h2 id="other-services">Other Services</h2>
          <div className="service-page__chips">
            {services
              .filter((s) => s.id !== service.id)
              .map((related) => (
                <Link
                  key={related.id}
                  to={`/services/${related.slug}`}
                  className="service-chip"
                >
                  {related.icon} {related.title}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </article>
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

export default ServicePage;
