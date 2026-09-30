import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <Seo title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <div className="container">
        <div className="not-found__content">
          <h1 id="not-found-title" className="not-found__title">
            404
          </h1>
          <h2 className="not-found__subtitle">Page not found</h2>
          <p className="not-found__text">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn btn-lg btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
