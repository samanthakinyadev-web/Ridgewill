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
        className={`service-page__hero ${service.image ? 'service-page__hero--bg' : ''}`}
        aria-labelledby={`service-title-${service.id}`}
        style={service.image ? { backgroundImage: `url(${service.image})` } : undefined}
      >
        <div className="container">
          <div className="service-page__hero-content">
            <div
              className="service-page__icon"
              aria-hidden="true"
              style={{ fontSize: '4rem' }}
            >
              {service.icon}
            </div>
            <h1 id={`service-title-${service.id}`}>{service.title}</h1>
            <p className="service-page__tagline text-accent">{service.tagline}</p>
            <p className="service-page__intro">{service.intro}</p>
          </div>
        </div>
      </section>

      <section className="service-page__offers" aria-labelledby="what-we-offer">
        <div className="container">
          <h2 id="what-we-offer">What We Offer</h2>
          <div className="grid-2">
            {service.highlights.map((highlight, index) => (
              <div key={index} className="offer-card card">
                <div className="offer-card__icon" aria-hidden="true">
                  ✓
                </div>
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

export default ServicePage;
