import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { EyeIcon, EyeOffIcon } from '../../components/icons.jsx';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  POPULAR_THANAS,
} from '../../data/bangladeshGeo.js';

export default function CollectorLogin() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { loginCollector, submitCollectorApplication, approveCollectorApplication } = useAuth();

  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [pendingAppId, setPendingAppId] = useState(null);

  // Register state
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    nid: '',
    division: 'Dhaka',
    district: 'Dhaka',
    thana: '',
    vehicle: 'Van / Three-Wheeler',
    experience: '1-2 Years',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });
  const [regError, setRegError] = useState('');

  const availableDistricts = regData.division
    ? BANGLADESH_DISTRICTS[regData.division] || []
    : [];

  const availableThanas = regData.district
    ? POPULAR_THANAS[regData.district] || []
    : [];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setPendingAppId(null);

    if (!loginPhone.trim() || !loginPass) {
      setLoginError('Please enter your phone/email and password.');
      return;
    }
    const res = loginCollector(loginPhone.trim(), loginPass);
    if (!res.success) {
      setLoginError(res.error || 'Login failed.');
      if (res.pending && res.application) {
        setPendingAppId(res.application.id);
      }
      return;
    }
    navigate('/collector/dashboard');
  };

  const handleDemoCollectorLogin = () => {
    loginCollector('01819-876543', 'demo123');
    navigate('/collector/dashboard');
  };

  const handleAdminApproveAndLogin = (appId) => {
    approveCollectorApplication(appId);
    loginCollector(loginPhone.trim(), loginPass);
    navigate('/collector/dashboard');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.phone.trim() || !regData.nid.trim() || !regData.password) {
      setRegError('Please complete all required fields including NID and password.');
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
    const res = submitCollectorApplication(regData);
    setSubmittedApp(res.application);
  };

  return (
    <div className="sv-auth-page">
      {/* Top Header bar with Back Link */}
      <div className="sv-auth-top-bar" style={{ maxWidth: activeTab === 'register' ? '640px' : '540px', justifyContent: 'flex-start' }}>
        <Link to="/" className="sv-auth-back-link">
          <span>&larr; Back to Website</span>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="sv-auth-card" style={{ maxWidth: activeTab === 'register' ? '640px' : '540px' }}>
        <div className="sv-auth-header">
          {/* Centered ScrapVenture Logo */}
          <div className="sv-auth-logo-center">
            <Link to="/" title="ScrapVenture Home">
              <img src="/assets/images/logo.png" alt="ScrapVenture" className="sv-auth-card-logo" />
            </Link>
          </div>
          <h1 className="sv-auth-title">
            {activeTab === 'login' ? 'Collector Login' : 'Register as a Scrap Collector'}
          </h1>
          <p className="sv-auth-subtitle">
            {activeTab === 'login'
              ? 'Access daily collection routes, digital scale weighing & weekly payouts'
              : 'Join Bangladesh’s verified digital scrap collection partner network'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="sv-auth-tabs">
          <button
            type="button"
            className={`sv-auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
          >
            Collector Sign In
          </button>
          <button
            type="button"
            className={`sv-auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setRegError(''); }}
          >
            Register as Collector
          </button>
        </div>

        {activeTab === 'login' ? (
          /* ============ COLLECTOR LOGIN ============ */
          <form onSubmit={handleLoginSubmit}>
            {loginError && (
              <div style={{
                padding: '12px 14px',
                background: pendingAppId ? '#fef3c7' : '#fee2e2',
                color: pendingAppId ? '#92400e' : '#b91c1c',
                borderRadius: '12px',
                fontSize: '13px',
                marginBottom: '16px',
                fontWeight: 600,
                border: pendingAppId ? '1px solid #fde68a' : '1px solid #fecaca',
                lineHeight: 1.5
              }}>
                <div>{loginError}</div>
                {pendingAppId && (
                  <button
                    type="button"
                    style={{
                      marginTop: '10px',
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onClick={() => handleAdminApproveAndLogin(pendingAppId)}
                  >
                    <span>⚡ Admin Demo: Approve Application ({pendingAppId}) Now &amp; Sign In</span>
                  </button>
                )}
              </div>
            )}

            <div className="sv-form-group">
              <label className="sv-form-label">
                Collector Phone or Email / ফোন বা ইমেইল <span className="req">*</span>
              </label>
              <div className="sv-input-wrap">
                <span className="sv-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="sv-input"
                  placeholder="e.g. 01XXXXXXXXX or name@example.com"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="sv-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="sv-form-label" style={{ marginBottom: 0 }}>
                  Password / পাসওয়ার্ড <span className="req">*</span>
                </label>
                <a href="#help" onClick={(e) => { e.preventDefault(); alert('Please contact ScrapVenture Partner Support to reset your collector PIN/password: 09612-888999'); }} style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>
                  Forgot PIN?
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
                  type={showLoginPass ? 'text' : 'password'}
                  className="sv-input sv-input--password"
                  placeholder="Enter your password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
                <button
                  type="button"
                  className="sv-password-toggle-btn"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  title={showLoginPass ? 'Hide password' : 'Show password'}
                  aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                >
                  {showLoginPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="sv-auth-btn-primary" style={{ background: '#059669' }}>
              <span>Sign In to Collector Portal</span>
              <span>&rarr;</span>
            </button>

            {/* Quick Demo Button */}
            <button
              type="button"
              className="sv-auth-btn-demo"
              style={{ color: '#059669', borderColor: '#059669' }}
              onClick={handleDemoCollectorLogin}
            >
              🚚 Instant Demo Collector Login (1-Click)
            </button>
          </form>
        ) : submittedApp ? (
          /* ============ APPLICATION SUBMITTED VIEW ============ */
          <div style={{ textAlign: 'center', padding: '20px 8px 10px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#059669',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <span style={{
              display: 'inline-block',
              fontSize: '11.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: '#fef3c7',
              color: '#b45309',
              padding: '4px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '12px'
            }}>
              Pending Admin Review
            </span>

            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Collector Application Submitted!
            </h2>

            <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>
              Your application reference is <strong>{submittedApp.id}</strong>.<br />
              It has been forwarded to the ScrapVenture Admin Panel for verification. Once approved by the Admin, you will be able to log in to the Collector Portal using your registered phone/email and password.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px 16px',
              textAlign: 'left',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Applicant Name:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{submittedApp.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Registered Phone:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{submittedApp.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Admin Review Status:</span>
                <span style={{ fontWeight: 800, color: '#d97706' }}>Under Verification</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="sv-auth-btn-primary"
                style={{ background: '#059669' }}
                onClick={() => {
                  setLoginPhone(submittedApp.phone);
                  setSubmittedApp(null);
                  setActiveTab('login');
                }}
              >
                <span>Go to Collector Sign In</span>
                <span>&rarr;</span>
              </button>

              <button
                type="button"
                className="sv-auth-btn-demo"
                style={{ color: '#059669', borderColor: '#059669' }}
                onClick={() => {
                  approveCollectorApplication(submittedApp.id);
                  loginCollector(submittedApp.phone, submittedApp.password);
                  navigate('/collector/dashboard');
                }}
              >
                ⚡ Admin Demo: Approve Application ({submittedApp.id}) Now &amp; Sign In
              </button>
            </div>
          </div>
        ) : (
          /* ============ COLLECTOR REGISTRATION ============ */
          <form onSubmit={handleRegisterSubmit}>
            {regError && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
                {regError}
              </div>
            )}

            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">
                  Full Name / পুরো নাম <span className="req">*</span>
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
            </div>

            <div className="sv-form-row">
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
                    placeholder="e.g. name@example.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">
                  National ID (NID) / জাতীয় পরিচয়পত্র <span className="req">*</span>
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 7h10" />
                      <path d="M7 12h10" />
                      <path d="M7 17h10" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="sv-input"
                    placeholder="e.g. 199XXXXXXXXXX (10, 13, or 17 digits)"
                    value={regData.nid}
                    onChange={(e) => setRegData({ ...regData, nid: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">Division / বিভাগ</label>
                <select
                  className="sv-input"
                  style={{ paddingLeft: '14px' }}
                  value={regData.division}
                  onChange={(e) => setRegData({ ...regData, division: e.target.value, district: '', thana: '' })}
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">District / জেলা</label>
                <select
                  className="sv-input"
                  style={{ paddingLeft: '14px' }}
                  value={regData.district}
                  onChange={(e) => setRegData({ ...regData, district: e.target.value, thana: '' })}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">Thana / Covered Zone</label>
                <input
                  type="text"
                  className="sv-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Banani, Gulshan, Uttara"
                  value={regData.thana}
                  onChange={(e) => setRegData({ ...regData, thana: e.target.value })}
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Transport / Vehicle Type / যানবাহনের ধরন</label>
                <select
                  className="sv-input"
                  style={{ paddingLeft: '14px' }}
                  value={regData.vehicle}
                  onChange={(e) => setRegData({ ...regData, vehicle: e.target.value })}
                >
                  <option value="Van / Three-Wheeler">Van / Three-Wheeler (রিকশা ভ্যান)</option>
                  <option value="Motorcycle / Scooter">Motorcycle / Scooter (মোটরসাইকেল / স্কুটার)</option>
                  <option value="Pickup Truck / Mini Truck">Pickup Truck / Mini Truck (পিকআপ / মিনি ট্রাক)</option>
                  <option value="Bicycle / Hand Trolley">Bicycle / Hand Trolley (বাইসাইকেল / ঠেলাগাড়ি)</option>
                  <option value="On Foot / Neighborhood Cart">On Foot / Neighborhood Cart (পায়ে হেঁটে / ট্রলি)</option>
                </select>
              </div>
            </div>

            {/* Set Password & Confirm Password with Eye Toggles */}
            <div className="sv-form-row">
              <div className="sv-form-group">
                <label className="sv-form-label">
                  Set Password / পাসওয়ার্ড দিন <span className="req">*</span>
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    className="sv-input sv-input--password"
                    placeholder="Min 6 characters"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="sv-password-toggle-btn"
                    onClick={() => setShowRegPass(!showRegPass)}
                    title={showRegPass ? 'Hide password' : 'Show password'}
                    aria-label={showRegPass ? 'Hide password' : 'Show password'}
                  >
                    {showRegPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">
                  Confirm Password / নিশ্চিত করুন <span className="req">*</span>
                </label>
                <div className="sv-input-wrap">
                  <span className="sv-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showRegConfirmPass ? 'text' : 'password'}
                    className="sv-input sv-input--password"
                    placeholder="Repeat password"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="sv-password-toggle-btn"
                    onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                    title={showRegConfirmPass ? 'Hide password' : 'Show password'}
                    aria-label={showRegConfirmPass ? 'Hide password' : 'Show password'}
                  >
                    {showRegConfirmPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="sv-auth-btn-primary" style={{ background: '#059669' }}>
              <span>Submit Collector Application</span>
              <span>&rarr;</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
