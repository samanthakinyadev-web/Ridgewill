import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import { NoIndex } from './Seo';

export function ProtectedRoute() {
  const { session, loading, staff } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading" role="status">
        <div className="page-loader__spinner" />
        <p>Checking your access…</p>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-empty">
        <NoIndex />
        <h1>Supabase is not configured</h1>
        <p>
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>{' '}
          in your <code>.env</code> file, then restart the dev server.
        </p>
        <Link to="/" className="btn btn-md btn-primary">
          Back to site
        </Link>
      </div>
    );
  }

  if (!session) {
    // The attempted path is passed along so login can return the user to it.
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!staff) {
    return (
      <div className="admin-empty">
        <NoIndex />
        <h1>Access denied</h1>
        <p>
          Your account signed in successfully, but it is not on the staff list, so
          it has no access to shipment records. Ask the site owner to add your user
          to the <code>staff</code> table.
        </p>
        <Link to="/" className="btn btn-md btn-primary">
          Back to site
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
