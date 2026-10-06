import { useSearchParams } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { company } from '../content/company';
import { services } from '../content/services';
import { Seo } from '../components/Seo';

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('s') || '';
  const preselectedService = services.find((s) => s.title === serviceParam)?.title || serviceParam;

  return (
    <div className="contact-page">
      <Seo
        title="Contact Us"
        description="Get a quote or send an inquiry. We respond quickly via WhatsApp or email."
      />
      <section className="contact-page__hero" aria-labelledby="contact-title">
        <div className="container">
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>
            Get in touch
          </p>
          <h1 id="contact-title">Contact Us</h1>
          <p className="contact-page__subtitle">
            Whether you need a quote or have a general inquiry, we're here to help.
          </p>
        </div>
      </section>

      <section className="contact-page__content" aria-label="Contact form">
        <div className="container">
          <div className="contact-page__layout">
            <div className="contact-page__form">
              <ContactForm preselectedService={preselectedService} />
            </div>

            <aside className="contact-page__sidebar" aria-label="Contact information">
              <div className="contact-card card">
                <div className="contact-card__icon" aria-hidden="true">
                  📞
                </div>
                <h3 className="contact-card__title">Phone / WhatsApp</h3>
                <a
                  href={`tel:${company.phoneInternational}`}
                  className="contact-card__value"
                >
                  {company.phone}
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
                  📱
                </div>
                <h3 className="contact-card__title">WhatsApp</h3>
                <a
                  href={company.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card__value"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
