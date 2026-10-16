import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { SettingsIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminSettings() {
  const { adminUser } = useAdminAuth();
  const [profileName, setProfileName] = useState(adminUser?.name || 'Motaleb Hossain Emon');
  const [profileEmail, setProfileEmail] = useState(adminUser?.email || 'admin@scrapventure.com');
  const [minWeight, setMinWeight] = useState('10');
  const [currency, setCurrency] = useState('BDT (৳)');
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Admin Settings</h1>
          <p>System configurations, operational dispatch rules, notifications, and administrator credentials.</p>
        </div>
      </div>

      {saveSuccess && (
        <div
          style={{
            padding: '12px 18px',
            background: '#dcfce7',
            color: '#15803d',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          ✓ System settings and operational parameters saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Administrator Profile Card */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div className="sv-card-title">Super Administrator Profile</div>
          </div>
          <div className="sv-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div className="sv-form-group">
                <label className="sv-form-label">Full Name</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Email Address</label>
                <input
                  type="email"
                  className="sv-form-input"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operational Dispatch Settings */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div className="sv-card-title">Field Collection & Operational Dispatch</div>
          </div>
          <div className="sv-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div className="sv-form-group">
                <label className="sv-form-label">Minimum Scrap Pickup Weight (kg)</label>
                <input
                  type="number"
                  className="sv-form-input"
                  value={minWeight}
                  onChange={(e) => setMinWeight(e.target.value)}
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Default Payout Currency</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                />
                <span>Send automated SMS notification to citizen when collector is dispatched</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                />
                <span>Auto-assign nearest available field collector based on GPS / Thana proximity</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button type="submit" className="sv-btn-primary">
            <SettingsIcon size={16} />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}

