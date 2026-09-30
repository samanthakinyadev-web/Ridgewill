import { Link } from 'react-router-dom';
import type { Service } from '../content/services';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="service-card card">
      <div className="service-card__icon" aria-hidden="true">
        {service.icon}
      </div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__description">{service.intro}</p>
      <Link to={`/services/${service.slug}`} className="service-card__link btn btn-sm btn-ghost">
        Learn more
      </Link>
    </div>
  );
}
