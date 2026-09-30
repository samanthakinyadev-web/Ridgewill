import type { PortfolioEntry } from '../content/portfolio';

interface PortfolioCardProps {
  project: PortfolioEntry;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const imageSrc = project.image ? `/portfolio/${project.image}` : null;

  return (
    <div className="portfolio-card card">
      <div className="portfolio-card__image-wrapper">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.title}
            className="portfolio-card__image"
            loading="lazy"
          />
        ) : (
          <div className="portfolio-card__placeholder" aria-label="No image available">
            <span className="portfolio-card__placeholder-icon" aria-hidden="true">
              🖼
            </span>
          </div>
        )}
      </div>
      <div className="portfolio-card__content">
        <span className="portfolio-card__category">{project.category}</span>
        {project.route && (
          <span className="portfolio-card__route">{project.route}</span>
        )}
        <h3 className="portfolio-card__title">{project.title}</h3>
        <p className="portfolio-card__description">{project.description}</p>
      </div>
    </div>
  );
}
