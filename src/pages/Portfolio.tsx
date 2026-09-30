import { useState } from 'react';
import { portfolio, type PortfolioEntry } from '../content/portfolio';
import { PortfolioCard } from '../components/PortfolioCard';
import { Seo } from '../components/Seo';

export function PortfolioPage() {
  const [selectedImage, setSelectedImage] = useState<PortfolioEntry | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...new Set(portfolio.map((p) => p.category))];

  const filtered =
    activeCategory === 'all'
      ? portfolio
      : portfolio.filter((p) => p.category === activeCategory);

  return (
    <div className="portfolio-page">
      <Seo title="Portfolio" description="Our completed projects across air, sea, and specialized logistics." />
      <section className="portfolio-page__intro" aria-labelledby="portfolio-title">
        <div className="container">
          <h1 id="portfolio-title">Our Portfolio</h1>
          <p className="portfolio-page__subtitle">
            A selection of projects showcasing our global logistics solutions across
            continents.
          </p>
        </div>
      </section>

      <section className="portfolio-page__filters" aria-label="Filter by category">
        <div className="container">
          <div className="portfolio-page__filter-bar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`portfolio-page__filter-btn ${
                  activeCategory === category ? 'active' : ''
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-page__grid" aria-label="Portfolio projects">
        <div className="container">
          {filtered.length === 0 ? (
            <p className="portfolio-page__empty">No projects in this category.</p>
          ) : (
            <div className="grid-2 grid-3">
              {filtered.map((project, index) => (
                <div
                  key={index}
                  className="portfolio-page__card"
                  onClick={() => project.image && setSelectedImage(project)}
                  style={{ cursor: project.image ? 'pointer' : 'default' }}
                  tabIndex={project.image ? 0 : -1}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && project.image) {
                      e.preventDefault();
                      setSelectedImage(project);
                    }
                  }}
                >
                  <PortfolioCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Project image"
          onClick={() => setSelectedImage(null)}
        >
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox__close"
              aria-label="Close"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            {selectedImage.image && (
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="lightbox__img"
              />
            )}
            <h3 className="lightbox__title">{selectedImage.title}</h3>
            <p className="lightbox__description">{selectedImage.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioPage;
