import { useState } from 'react';
import { campaignImpacts } from '../../data/campaigns.js';
import { CampaignsIcon, ExternalLinkIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState(
    campaignImpacts.map((c) => ({
      ...c,
      destinationUrl: c.id === 'campus-drive-2025' ? '/#school-campaign' : '/book-pickup',
      bannerImage: '/assets/images/milestone-campaign.jpg',
    }))
  );

  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    badge: 'Campus Blitz',
    location: 'Dhaka Division',
    status: 'Active',
    destinationUrl: '/book-pickup',
    date: 'October 2026 – Present',
    summary: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCampaign.title) return;

    const item = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title,
      badge: newCampaign.badge,
      location: newCampaign.location,
      status: newCampaign.status,
      date: newCampaign.date,
      summary: newCampaign.summary || 'Mobilizing citizens to divert bulk recyclable materials into certified circular streams.',
      destinationUrl: newCampaign.destinationUrl || '/book-pickup',
      bannerImage: '/assets/images/milestone-campaign.jpg',
      stats: [
        { label: 'Scrap Target', value: '5,000 kg' },
        { label: 'Participants', value: '1,200+' },
      ],
    };

    setCampaigns([item, ...campaigns]);
    setShowModal(false);
    setNewCampaign({
      title: '',
      badge: 'Campus Blitz',
      location: 'Dhaka Division',
      status: 'Active',
      destinationUrl: '/book-pickup',
      date: 'October 2026 – Present',
      summary: '',
    });
  };

  const handleUpdateUrl = (id, newUrl) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, destinationUrl: newUrl } : c))
    );
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete campaign "${title}"?`)) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Community Campaigns</h1>
          <p>Manage environmental initiatives, campus drives, imagery, and clickable destination URLs.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={() => setShowModal(true)}
          >
            <CampaignsIcon size={16} />
            <span>+ Launch New Campaign</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Diverted Via Campaigns</span>
            <div className="sv-stat-icon-wrap green"><CampaignsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">21.7+ Tons</div>
          <div className="sv-stat-change">4 Certified Drives</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Citizens Mobilized</span>
            <div className="sv-stat-icon-wrap blue"><CampaignsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">5,000+ People</div>
          <div className="sv-stat-change">Universities & Residential Societies</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Active Drives</span>
            <div className="sv-stat-icon-wrap orange"><CampaignsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{campaigns.filter((c) => c.status !== 'Completed').length} Running</div>
          <div className="sv-stat-change">Direct app booking active</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-card-title">All Eco Campaigns & Active Landing Routes</div>
        </div>

        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Campaign Details</th>
                <th>Location & Scope</th>
                <th>Status</th>
                <th>Clickable Destination URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px', maxWidth: '340px' }}>
                      {camp.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      <span className="sv-badge blue" style={{ marginRight: '6px' }}>{camp.badge}</span>
                      {camp.date}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{camp.location}</div>
                  </td>
                  <td>
                    <span
                      className={`sv-badge ${
                        camp.status === 'Completed' ? 'gray' : 'green'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        value={camp.destinationUrl}
                        onChange={(e) => handleUpdateUrl(camp.id, e.target.value)}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          width: '160px',
                        }}
                      />
                      <a
                        href={camp.destinationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sv-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        title="Open destination URL"
                      >
                        <ExternalLinkIcon size={12} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px', color: '#dc2626' }}
                      onClick={() => handleDelete(camp.id, camp.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#111827' }}>
              Launch New Campaign Drive
            </h2>
            <form onSubmit={handleCreate}>
              <div className="sv-form-group">
                <label className="sv-form-label">Campaign Title</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="e.g. Mirpur Green Community Zero-Waste Drive"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Badge</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={newCampaign.badge}
                    onChange={(e) => setNewCampaign({ ...newCampaign, badge: e.target.value })}
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Location / Campus</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={newCampaign.location}
                    onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                    placeholder="e.g. UITS & Baridhara"
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Destination URL</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={newCampaign.destinationUrl}
                  onChange={(e) => setNewCampaign({ ...newCampaign, destinationUrl: e.target.value })}
                  placeholder="/book-pickup or /#school-campaign"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Campaign Objective</label>
                <textarea
                  className="sv-form-input"
                  rows={2}
                  value={newCampaign.summary}
                  onChange={(e) => setNewCampaign({ ...newCampaign, summary: e.target.value })}
                  placeholder="Empowering university students with digital weighing scales..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="sv-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sv-btn-primary">
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

