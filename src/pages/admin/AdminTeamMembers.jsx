import { useState } from 'react';
import teamData from '../../data/team.js';
import { TeamMembersIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminTeamMembers() {
  const [members, setMembers] = useState(teamData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    rank: '',
    image: '/assets/team/founder-ceo-motaleb-emon.jpg',
    desc: '',
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.rank) return;

    const item = {
      id: `member-${Date.now()}`,
      name: newMember.name,
      rank: newMember.rank,
      image: newMember.image,
      desc: newMember.desc || 'Contributing to Scrap Venture mission.',
      socials: {
        facebook: 'https://facebook.com',
        linkedin: 'https://linkedin.com',
      },
    };

    setMembers([...members, item]);
    setShowAddModal(false);
    setNewMember({
      name: '',
      rank: '',
      image: '/assets/team/founder-ceo-motaleb-emon.jpg',
      desc: '',
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove team member "${name}"?`)) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Team Members Management</h1>
          <p>Manage company leadership, executive designations, engineers, and profile representations.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={() => setShowAddModal(true)}
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
          <div className="sv-stat-change">Leadership & Advisory Board</div>
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
            <span className="sv-stat-label">Academic Advisors</span>
            <div className="sv-stat-icon-wrap green"><TeamMembersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">1 Director</div>
          <div className="sv-stat-change">UITS IQAC Strategic Mentor</div>
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
                        <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sv-badge orange" style={{ fontWeight: 700 }}>
                      {member.rank}
                    </span>
                  </td>
                  <td style={{ fontSize: '12.5px', color: '#475569', maxWidth: '380px' }}>
                    {member.desc}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px', color: '#dc2626' }}
                      onClick={() => handleDelete(member.id, member.name)}
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

      {/* Add Modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#111827' }}>
              Add Team Member
            </h2>
            <form onSubmit={handleAddMember}>
              <div className="sv-form-group">
                <label className="sv-form-label">Full Name</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Ayesha Siddiqa"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Designation / Rank</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={newMember.rank}
                  onChange={(e) => setNewMember({ ...newMember, rank: e.target.value })}
                  placeholder="e.g. Head of Community Recycling"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Role Bio & Responsibilities</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={newMember.desc}
                  onChange={(e) => setNewMember({ ...newMember, desc: e.target.value })}
                  placeholder="Directing grassroots campaign activations..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="sv-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sv-btn-primary">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

