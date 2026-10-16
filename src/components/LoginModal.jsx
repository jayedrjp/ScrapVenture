import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    onClose();
    if (role === 'user') {
      navigate('/login');
    } else if (role === 'collector') {
      navigate('/collector/login');
    }
  };

  return (
    <div className="sv-login-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sv-login-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="sv-login-modal-close"
          onClick={onClose}
          aria-label="Close login options"
        >
          &times;
        </button>

        <div className="sv-login-modal-header">
          <div className="sv-login-modal-icon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h2 className="sv-login-modal-title">Select Portal / লগইন সিলেক্ট করুন</h2>
          <p className="sv-login-modal-subtitle">
            Choose your account type to access personalized services &amp; dashboards.
          </p>
        </div>

        <div className="sv-login-modal-options">
          {/* Option 1: Customer / User Login */}
          <button
            type="button"
            className="sv-login-option-btn sv-login-option--user"
            onClick={() => handleSelectRole('user')}
          >
            <div className="sv-login-option-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="sv-login-option-info">
              <span className="sv-login-option-title">User Login (ইউজার লগইন)</span>
              <span className="sv-login-option-desc">
                Book pickups, track scrap weighing, manage marketplace orders &amp; profile.
              </span>
            </div>
            <div className="sv-login-option-arrow">→</div>
          </button>

          {/* Option 2: Collector Login */}
          <button
            type="button"
            className="sv-login-option-btn sv-login-option--collector"
            onClick={() => handleSelectRole('collector')}
          >
            <div className="sv-login-option-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="sv-login-option-info">
              <span className="sv-login-option-title">Collector Login (কালেক্টর লগইন)</span>
              <span className="sv-login-option-desc">
                Authorized collection partner portal, pickup routes, digital weighing &amp; payouts.
              </span>
            </div>
            <div className="sv-login-option-arrow">→</div>
          </button>
        </div>

        <div className="sv-login-modal-footer">
          <span>Need help? Contact ScrapVenture support at <a href="mailto:support@scrapventure.xyz">support@scrapventure.xyz</a></span>
        </div>
      </div>
    </div>
  );
}

