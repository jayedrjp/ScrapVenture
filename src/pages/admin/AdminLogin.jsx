import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import '../../components/admin/admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@scrapventure.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login('admin@scrapventure.com', 'admin123');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sv-admin-login-wrapper">
      <div className="sv-login-card">
        <div className="sv-login-brand-header">
          <Link to="/" title="Return to public homepage">
            <img
              src="/assets/images/logo.png"
              alt="Scrap Venture"
              className="sv-login-logo"
            />
          </Link>
          <h1 className="sv-login-title">Admin Console</h1>
          <p className="sv-login-subtitle">
            Sign in to manage Scrap Venture operations and platform resources.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="sv-form-group">
            <label className="sv-form-label" htmlFor="admin-email">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              className="sv-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scrapventure.com"
              required
            />
          </div>

          <div className="sv-form-group">
            <label className="sv-form-label" htmlFor="admin-pass">
              Password
            </label>
            <input
              id="admin-pass"
              type="password"
              className="sv-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="sv-demo-hint-box">
            <div style={{ fontWeight: 700, marginBottom: 3, color: '#0f172a' }}>
              Demo Credentials:
            </div>
            <div>Email: <code>admin@scrapventure.com</code></div>
            <div>Password: <code>admin123</code></div>
          </div>

          <button
            type="submit"
            className="sv-btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', marginBottom: '10px' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="sv-btn-secondary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
          >
            Instant 1-Click Demo Login
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12.5px', color: '#64748b' }}>
          <Link to="/" style={{ color: '#f97316', fontWeight: 600 }}>
            ← Back to Scrap Venture Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
