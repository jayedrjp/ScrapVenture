import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { EyeIcon, EyeOffIcon } from '../../components/icons.jsx';

export default function UserLogin() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { loginUser, loginWithGoogle, loginWithApple, registerUser } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Google OAuth state / modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError('Please enter your phone or email and password.');
      return;
    }
    loginUser(loginIdentifier.trim(), loginPassword);
    navigate('/dashboard');
  };

  const handleDemoCustomerLogin = () => {
    loginUser('sazzad.customer@gmail.com', 'demo123');
    navigate('/dashboard');
  };

  const handleOpenGoogleModal = () => {
    setIsGoogleModalOpen(true);
  };

  const handleConfirmGoogleLogin = (email, name) => {
    loginWithGoogle({
      email: email || googleCustomEmail || 'customer.google@gmail.com',
      name: name || googleCustomName || (email ? email.split('@')[0] : 'Google Customer')
    });
    setIsGoogleModalOpen(false);
    navigate('/dashboard');
  };

  const handleAppleLogin = () => {
    loginWithApple();
    navigate('/dashboard');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.phone.trim() || !regData.password) {
      setRegError('Please fill in your name, phone number, and password.');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regData.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    registerUser(regData);
    navigate('/dashboard');
  };

  return (
    <div className="sv-auth-page">
      {/* Top Header bar with Back Link */}
      <div className="sv-auth-top-bar" style={{ justifyContent: 'flex-start' }}>
        <Link to="/" className="sv-auth-back-link">
          <span>&larr; Back to Website</span>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="sv-auth-card">
        <div className="sv-auth-header">
          {/* Centered ScrapVenture Logo */}
          <div className="sv-auth-logo-center">
            <Link to="/" title="ScrapVenture Home">
              <img src="/assets/images/logo.png" alt="ScrapVenture" className="sv-auth-card-logo" />
            </Link>
          </div>
          <h1 className="sv-auth-title">
            {activeTab === 'login' ? 'User Login' : 'Create Account'}
          </h1>
          <p className="sv-auth-subtitle">
            {activeTab === 'login'
              ? 'Sign in to track orders, scrap pickups, and rewards'
              : 'Join ScrapVenture to turn your household & business scrap into value'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="sv-auth-tabs">
          <button
            type="button"
            className={`sv-auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`sv-auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setRegError(''); }}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'login' ? (
          /* ============ LOGIN FORM ============ */
          <form onSubmit={handleLoginSubmit}>
            {loginError && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
                {loginError}
              </div>
            )}

            <div className="sv-form-group">
              <label className="sv-form-label">
                Email or Phone Number / ইমেইল বা ফোন নম্বর <span className="req">*</span>
              </label>
              <div className="sv-input-wrap">
                <span className="sv-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="sv-input"
                  placeholder="e.g. 01XXXXXXXXX or name@example.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="sv-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="sv-form-label" style={{ marginBottom: 0 }}>
                  Password / পাসওয়ার্ড <span className="req">*</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link will be sent to your registered email/phone.'); }} style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
                  Forgot password?
                </a>
              </div>
              <div className="sv-input-wrap">
                <span className="sv-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="sv-input sv-input--password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="sv-password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="sv-auth-btn-primary">
              <span>Sign In to Dashboard</span>
              <span>&rarr;</span>
            </button>

            {/* Quick Demo Button for effortless testing */}
            <button
              type="button"
              className="sv-auth-btn-demo"
              onClick={handleDemoCustomerLogin}
            >
              🚀 Instant Demo Customer Login (1-Click)
            </button>

            <div className="sv-auth-divider">
              <span>Or Continue With</span>
            </div>

            <div className="sv-social-btn-group">
              <button type="button" className="sv-social-btn" onClick={handleOpenGoogleModal}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24Z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15Z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
                </svg>
                <span>Google</span>
              </button>

              <button type="button" className="sv-social-btn" onClick={handleAppleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-.95 2.76 1.01.08 2.05-.51 2.67-1.26"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </form>
        ) : (
          /* ============ REGISTER FORM ============ */
          <form onSubmit={handleRegisterSubmit}>
            {regError && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
                {regError}
              </div>
            )}

            <div className="sv-form-group">
              <label className="sv-form-label">
                Full Name / আপনার পুরো নাম <span className="req">*</span>
              </label>
              <div className="sv-input-wrap">
                <span className="sv-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="sv-input"
                  placeholder="e.g. Your Name"
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">
                  Phone Number / ফোন নম্বর <span className="req">*</span>
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    className="sv-input"
                    placeholder="e.g. 01XXXXXXXXX"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">
                  Email Address / ইমেইল
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="sv-input"
                    placeholder="name@gmail.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sv-form-group">
              <label className="sv-form-label">
                Address / ঠিকানা (বাসা/রোড/এলাকা)
              </label>
              <div className="sv-input-wrap">
                <span className="sv-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="sv-input"
                  placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">
                  Set Password <span className="req">*</span>
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    className="sv-input sv-input--password"
                    placeholder="Min 6 characters"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="sv-password-toggle-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    title={showRegPassword ? 'Hide password' : 'Show password'}
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">
                  Confirm Password <span className="req">*</span>
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    className="sv-input sv-input--password"
                    placeholder="Repeat password"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="sv-password-toggle-btn"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    title={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="sv-auth-btn-primary">
              <span>Create Account &amp; Proceed</span>
              <span>&rarr;</span>
            </button>
          </form>
        )}
      </div>

      {/* ============ GOOGLE AUTH MODAL (REALISTIC OAUTH POPUP SIMULATOR) ============ */}
      {isGoogleModalOpen && (
        <div className="sv-google-modal-backdrop" onClick={() => setIsGoogleModalOpen(false)}>
          <div className="sv-google-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sv-google-modal-header">
              <button
                type="button"
                className="sv-google-modal-close"
                onClick={() => setIsGoogleModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: '#f8faff', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24Z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15Z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                Sign in with Google
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Choose or enter an account to continue to ScrapVenture
              </p>
            </div>

            <div className="sv-google-modal-body">
              {/* Quick Select Account */}
              <div className="sv-google-account-list">
                <button
                  type="button"
                  className="sv-google-account-btn"
                  onClick={() => handleConfirmGoogleLogin('nafis.rahman@gmail.com', 'Nafis Rahman')}
                >
                  <div className="sv-google-avatar">N</div>
                  <div className="sv-google-account-info">
                    <div className="sv-google-account-name">Nafis Rahman</div>
                    <div className="sv-google-account-email">nafis.rahman@gmail.com</div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4285F4' }}>Select</span>
                </button>
              </div>

              {/* Or enter your own Google Account */}
              <div className="sv-google-custom-box">
                <div className="sv-google-custom-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  <span>Use your personal Google Account</span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    className="sv-input"
                    style={{ height: '40px', padding: '8px 12px', fontSize: '13px' }}
                    placeholder="yourname@gmail.com"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    className="sv-input"
                    style={{ height: '40px', padding: '8px 12px', fontSize: '13px' }}
                    placeholder="e.g. Nafis / Tanvir"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="sv-google-custom-submit"
                  onClick={() => handleConfirmGoogleLogin(googleCustomEmail, googleCustomName)}
                >
                  <span>Continue with this Google Account</span>
                  <span>&rarr;</span>
                </button>
              </div>

              <div className="sv-google-modal-footer">
                🔒 Architecture ready for Google OAuth 2.0 / Firebase SDK (`signInWithPopup`). Just set client ID in production.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
