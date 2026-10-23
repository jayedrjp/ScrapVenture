import { useState } from 'react';
import teamData from '../../data/team.js';
import { TeamMembersIcon, EditIcon, TrashIcon, ImageIcon, PlusIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminTeamMembers() {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_team_members');
      if (saved) return JSON.parse(saved);
      return teamData;
    } catch {
      return teamData;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    rank: '',
    desc: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    github: '',
    portfolio: '',
    instagram: '',
  });

  const [image, setImage] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const saveMembers = (newList) => {
    setMembers(newList);
    try {
      localStorage.setItem('sv_team_members', JSON.stringify(newList));
      window.dispatchEvent(new Event('sv_team_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      id: `member-${Date.now()}`,
      name: '',
      rank: '',
      desc: '',
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: 'https://scrapventure.xyz',
      instagram: '',
    });
    setImage(''); // Blank by default as requested
    setUrlInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember(m);
    setFormData({
      id: m.id || '',
      name: m.name || '',
      rank: m.rank || '',
      desc: m.desc || '',
      facebook: m.socials?.facebook || '',
      twitter: m.socials?.twitter || '',
      linkedin: m.socials?.linkedin || '',
      github: m.socials?.github || '',
      portfolio: m.socials?.portfolio || '',
      instagram: m.socials?.instagram || '',
    });
    setImage(m.image || '');
    setUrlInput('');
    setShowModal(true);
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setImage(urlInput.trim());
    setUrlInput('');
  };

  const handleRemoveImage = () => {
    setImage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rank) return;

    const payload = {
      id: formData.id || `member-${Date.now()}`,
      name: formData.name,
      rank: formData.rank,
      image: image || '/assets/team/developer-sazzad-rahman.jpg?v=4',
      desc: formData.desc || 'Contributing to ScrapVenture circular mission.',
      socialSide: 'right',
      socials: {
        facebook: formData.facebook || 'https://facebook.com',
        twitter: formData.twitter || 'https://twitter.com',
        linkedin: formData.linkedin || 'https://linkedin.com',
        github: formData.github || 'https://github.com',
        portfolio: formData.portfolio || 'https://scrapventure.xyz',
        instagram: formData.instagram || '',
      },
    };

    if (editingMember) {
      const updated = members.map((m) => (m.id === editingMember.id ? { ...m, ...payload } : m));
      saveMembers(updated);
    } else {
      saveMembers([...members, payload]);
    }

    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove team member "${name}"?`)) {
      const updated = members.filter((m) => m.id !== id);
      saveMembers(updated);
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Team Members Management</h1>
          <p>Manage company leadership, executive designations, engineers, developers, and profile representations.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={handleOpenAdd}
          >
            <TeamMembersIcon size={16} />
            <span>+ Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Organization</span>
            <div className="sv-stat-icon-wrap blue"><TeamMembersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{members.length} Members</div>
          <div className="sv-stat-change">Leadership & Development Team</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">C-Suite & Founders</span>
            <div className="sv-stat-icon-wrap orange"><TeamMembersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">4 Executives</div>
          <div className="sv-stat-change">CEO, COO, CBO, CTO</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Innovators & Developers</span>
            <div className="sv-stat-icon-wrap green"><TeamMembersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">Core Tech Team</div>
          <div className="sv-stat-change">Full-Stack Engineers & Advisors</div>
        </div>
      </div>

      {/* Team Table */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-card-title">Corporate Roster & Profile Directory</div>
        </div>

        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Profile & Member</th>
                <th>Designation / Rank</th>
                <th>Role ID</th>
                <th>Role & Core Responsibilities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #e2e8f0',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {member.socials?.linkedin ? 'LinkedIn Linked' : 'Active Member'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sv-badge orange" style={{ fontWeight: 700 }}>
                      {member.rank}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {member.id}
                    </span>
                  </td>
                  <td style={{ fontSize: '12.5px', color: '#475569', maxWidth: '340px' }}>
                    {member.desc}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="sv-btn-edit"
                        onClick={() => handleOpenEdit(member)}
                        title="Edit member details, rank, ID, and bio"
                      >
                        <EditIcon size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="sv-btn-danger"
                        onClick={() => handleDelete(member.id, member.name)}
                        title="Delete team member"
                      >
                        <TrashIcon size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
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
            {/* Modal Header with hover close button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#111827' }}>
                {editingMember ? 'Edit Team Member Profile' : 'Add New Team Member'}
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
                <label className="sv-form-label">Full Name *</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sazzad M Rahman"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Designation / Rank *</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    required
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Member Unique ID</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. fullstack-dev-sazzad"
                  />
                </div>
              </div>

              {/* Photo Image Upload Box with Cross Button */}
              <div className="sv-form-group">
                <label className="sv-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={16} />
                  <span>Profile Photo</span>
                </label>

                {image ? (
                  /* Square / Rounded Rectangle preview with prominent cross delete button */
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      className="sv-img-preview-card"
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '12px',
                        flexShrink: 0,
                        border: '2px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={image}
                        alt="Profile preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="sv-img-delete-btn"
                        onClick={handleRemoveImage}
                        title="Remove photo"
                        style={{
                          top: '6px',
                          right: '6px',
                          width: '26px',
                          height: '26px',
                          fontSize: '13px',
                          background: '#dc2626',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                        Profile Photo Selected
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', lineHeight: '1.45' }}>
                        Square preview shape. Click the red ✕ in the top-right corner to remove this photo and choose another.
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Clean upload box with plus icon and URL input */
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
                        Upload Photo from PC
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        PNG, JPG, or WEBP portrait photo
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

              <div className="sv-form-group">
                <label className="sv-form-label">Role Bio & Responsibilities Description</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="CSE student at UITS and passionate full-stack developer, building scalable web systems and modern digital platforms..."
                />
              </div>

              {/* Complete Social Links: Facebook, Twitter, LinkedIn, GitHub, Portfolio (Earth icon), Instagram */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
                  Social & Portfolio Links (Connected to Website Hover Dock)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Facebook Profile URL</label>
                    <input
                      type="text"
                      className="sv-form-input"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Twitter / X URL</label>
                    <input
                      type="text"
                      className="sv-form-input"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="sv-form-group">
                    <label className="sv-form-label">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      className="sv-form-input"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="sv-form-group">
                    <label className="sv-form-label">GitHub Profile URL</label>
                    <input
                      type="text"
                      className="sv-form-input"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Portfolio URL (Earth Icon 🌐)</label>
                    <input
                      type="text"
                      className="sv-form-input"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="https://myportfolio.dev"
                    />
                  </div>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Instagram URL (Optional)</label>
                    <input
                      type="text"
                      className="sv-form-input"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
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
                  {editingMember ? 'Save Changes' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
