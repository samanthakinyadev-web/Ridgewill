import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';
import { NoIndex } from '../../components/Seo';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      // Only ever a path this app generated, never user-supplied input.
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign in failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <NoIndex />
      <div className="admin-login__card card">
        <h1>Staff sign in</h1>
        <p className="admin-login__hint">
          This area is for Ridgewill staff only.
        </p>

        {!isSupabaseConfigured ? (
          <div className="track-notice" role="status">
            <p>
              Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> and restart the dev server.
            </p>
            <Link to="/" className="btn btn-md btn-primary">
              Back to site
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="admin-login__form" noValidate>
            <div className="admin-field">
              <label htmlFor="email" className="admin-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                aria-invalid={!!error}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="password" className="admin-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                aria-invalid={!!error}
              />
            </div>

            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-md btn-primary admin-login__submit"
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLoginPage;
