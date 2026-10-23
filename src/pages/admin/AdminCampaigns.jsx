import { useState } from 'react';
import { campaignImpacts } from '../../data/campaigns.js';
import { CampaignsIcon, ExternalLinkIcon, EditIcon, TrashIcon, ImageIcon, PlusIcon } from '../../components/admin/AdminIcons.jsx';

const DEFAULT_CAMPAIGNS = campaignImpacts.map((c, idx) => {
  const days = idx === 0 ? 7 : idx === 1 ? 5 : 4;
  const createdDate = Date.now() - (idx * 24 * 60 * 60 * 1000);
  const expiresAt = createdDate + (days * 24 * 60 * 60 * 1000);
  return {
    ...c,
    destinationUrl: c.id === 'campus-drive-2025' ? '/#school-campaign' : '/book-pickup',
    bannerImage: '/assets/images/milestone-campaign.jpg',
    durationDays: days,
    createdAt: createdDate,
    expiresAt: expiresAt,
    status: expiresAt > Date.now() ? 'Active' : 'Completed',
  };
});

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_campaigns_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c) => {
          const isExpired = c.expiresAt && Date.now() > c.expiresAt;
          return {
            ...c,
            status: isExpired ? 'Completed' : (c.status || 'Active')
          };
        });
      }
      return DEFAULT_CAMPAIGNS;
    } catch {
      return DEFAULT_CAMPAIGNS;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    badge: 'Campus Blitz',
    location: 'Dhaka Division',
    durationDays: 7,
    status: 'Active',
    destinationUrl: '/book-pickup',
    summary: '',
  });

  const [bannerImage, setBannerImage] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const saveCampaigns = (newList) => {
    const computed = newList.map((c) => {
      const isExpired = c.expiresAt && Date.now() > c.expiresAt;
      return {
        ...c,
        status: isExpired ? 'Completed' : c.status
      };
    });
    setCampaigns(computed);
    try {
      localStorage.setItem('sv_campaigns_data', JSON.stringify(computed));
      window.dispatchEvent(new Event('sv_campaigns_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenLaunch = () => {
    setEditingCampaign(null);
    setFormData({
      title: '',
      badge: 'Campus Blitz',
      location: 'Dhaka Division',
      durationDays: 7,
      status: 'Active',
      destinationUrl: '/book-pickup',
      summary: '',
    });
    setBannerImage(''); // Blank by default
    setUrlInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (camp) => {
    setEditingCampaign(camp);
    setFormData({
      title: camp.title || '',
      badge: camp.badge || 'Campus Blitz',
      location: camp.location || 'Dhaka',
      durationDays: camp.durationDays || 7,
      status: camp.status || 'Active',
      destinationUrl: camp.destinationUrl || '/book-pickup',
      summary: camp.summary || '',
    });
    setBannerImage(camp.bannerImage || '');
    setUrlInput('');
    setShowModal(true);
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setBannerImage(urlInput.trim());
    setUrlInput('');
  };

  const handleRemoveImage = () => {
    setBannerImage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const daysNum = Number(formData.durationDays) || 7;
    const now = Date.now();
    const expiresAtTimestamp = now + (daysNum * 24 * 60 * 60 * 1000);
    const expiryDateStr = new Date(expiresAtTimestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const payload = {
      id: editingCampaign ? editingCampaign.id : `camp-${Date.now()}`,
      title: formData.title,
      badge: formData.badge,
      location: formData.location,
      durationDays: daysNum,
      createdAt: editingCampaign?.createdAt || now,
      expiresAt: expiresAtTimestamp,
      expiryDateStr: expiryDateStr,
      status: formData.status === 'Completed' ? 'Completed' : 'Active',
      date: `${daysNum} Days`,
      summary: formData.summary || 'Mobilizing citizens to divert bulk recyclable materials into certified circular streams.',
      destinationUrl: formData.destinationUrl || '/book-pickup',
      bannerImage: bannerImage || '/assets/images/milestone-campaign.jpg',
      stats: [
        { label: 'Scrap Target', value: '5,000 kg' },
        { label: 'Participants', value: '1,200+' },
      ],
    };

    if (editingCampaign) {
      const updated = campaigns.map((c) => (c.id === editingCampaign.id ? { ...c, ...payload } : c));
      saveCampaigns(updated);
    } else {
      saveCampaigns([payload, ...campaigns]);
    }

    setShowModal(false);
  };

  const handleUpdateUrl = (id, newUrl) => {
    const updated = campaigns.map((c) => (c.id === id ? { ...c, destinationUrl: newUrl } : c));
    saveCampaigns(updated);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete campaign "${title}"?`)) {
      const remaining = campaigns.filter((c) => c.id !== id);
      saveCampaigns(remaining);
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Community Campaigns</h1>
          <p>Launch targeted environmental drives with custom imagery, durations (4, 5, 7 days), auto-expiration, and direct booking destinations.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={handleOpenLaunch}
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
            <span className="sv-stat-label">Active Running Drives</span>
            <div className="sv-stat-icon-wrap green"><CampaignsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">
            {campaigns.filter((c) => c.status === 'Active' && (!c.expiresAt || c.expiresAt > Date.now())).length} Active
          </div>
          <div className="sv-stat-change">Direct app booking active</div>
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
            <span className="sv-stat-label">Completed / Expired</span>
            <div className="sv-stat-icon-wrap orange"><CampaignsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">
            {campaigns.filter((c) => c.status === 'Completed' || (c.expiresAt && Date.now() > c.expiresAt)).length} Finished
          </div>
          <div className="sv-stat-change">Targets successfully met</div>
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
                <th>Campaign Details & Banner</th>
                <th>Location & Scope</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Destination URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => {
                const isExpired = camp.status === 'Completed' || (camp.expiresAt && Date.now() > camp.expiresAt);

                return (
                  <tr key={camp.id} style={{ background: isExpired ? '#fafafa' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={camp.bannerImage || '/assets/images/milestone-campaign.jpg'}
                          alt={camp.title}
                          style={{
                            width: '56px',
                            height: '40px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid #cbd5e1',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ maxWidth: '300px' }}>
                          <div style={{ fontWeight: 700, color: isExpired ? '#475569' : '#0f172a', marginBottom: '2px' }}>
                            {camp.title}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span className="sv-badge blue" style={{ padding: '1px 6px', fontSize: '10.5px' }}>
                              {camp.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{camp.location}</div>
                    </td>

                    {/* Just duration in days, no timer emoji, no green ball */}
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {camp.durationDays || 7} Days
                      </span>
                    </td>

                    <td>
                      {isExpired ? (
                        <span className="sv-badge gray">
                          Completed
                        </span>
                      ) : (
                        <span className="sv-badge green">
                          Active
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="text"
                          value={camp.destinationUrl}
                          onChange={(e) => handleUpdateUrl(camp.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '11.5px',
                            fontFamily: 'monospace',
                            width: '130px',
                          }}
                        />
                        <a
                          href={camp.destinationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="sv-btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '11px' }}
                          title="Open destination URL"
                        >
                          <ExternalLinkIcon size={12} />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="sv-btn-edit"
                          onClick={() => handleOpenEdit(camp)}
                          title="Edit campaign title, image, duration, and objective"
                        >
                          <EditIcon size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="sv-btn-danger"
                          onClick={() => handleDelete(camp.id, camp.title)}
                          title="Delete campaign"
                        >
                          <TrashIcon size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
            overflowY: 'auto',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '560px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with interactive hover close button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#111827' }}>
                {editingCampaign ? 'Edit Community Campaign' : 'Launch New Campaign Drive'}
              </h2>
              <button
                type="button"
                className="sv-modal-close-btn"
                onClick={() => setShowModal(false)}
                title="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sv-form-group">
                <label className="sv-form-label">Campaign Title *</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mirpur Green Community Zero-Waste Drive"
                />
              </div>

              {/* Banner Image Upload Box with Cross Delete Button */}
              <div className="sv-form-group">
                <label className="sv-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={16} />
                  <span>Campaign Banner Image</span>
                </label>

                {bannerImage ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="sv-img-preview-card" style={{ width: '130px', height: '80px', flexShrink: 0 }}>
                      <img
                        src={bannerImage}
                        alt="Campaign preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="sv-img-delete-btn"
                        onClick={handleRemoveImage}
                        title="Remove banner image"
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Banner Image Selected
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Click the red ✕ button on the image to delete and select a different file.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="sv-upload-dropzone" style={{ display: 'block' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: '#ffedd5',
                          color: '#ea580c',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <PlusIcon size={22} strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Upload Banner Image from PC
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        PNG, JPG, or WEBP wide landscape banner
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageFile}
                      />
                    </label>

                    {/* Or URL input */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input
                        type="text"
                        className="sv-form-input"
                        placeholder="Or paste an image web URL..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        style={{ fontSize: '12px', padding: '6px 10px' }}
                      />
                      <button
                        type="button"
                        className="sv-btn-secondary"
                        onClick={handleAddUrl}
                        style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      >
                        + Set URL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Duration Selector (4 days, 5 days, 7 days, etc.) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Time Duration (Days) *</label>
                  <select
                    className="sv-form-input"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                  >
                    <option value={4}>4 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>

                <div className="sv-form-group">
                  <label className="sv-form-label">Location / Campus</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. UITS & Baridhara"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Badge Label</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Campus Blitz"
                  />
                </div>

                <div className="sv-form-group">
                  <label className="sv-form-label">Destination URL</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.destinationUrl}
                    onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                    placeholder="/book-pickup or /#school-campaign"
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Campaign Objective / Summary</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Mobilizing university students and residential clusters to divert plastic and paper scrap..."
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
                  {editingCampaign ? 'Save Changes' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
