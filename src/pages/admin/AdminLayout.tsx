import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { NoIndex } from '../../components/Seo';

export function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin">
      <NoIndex />
      <header className="admin__bar">
        <Link to="/admin" className="admin__brand">
          Ridgewill Admin
        </Link>
        <div className="admin__bar-actions">
          <Link to="/" className="admin__bar-link">
            View site
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => void handleSignOut()}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
