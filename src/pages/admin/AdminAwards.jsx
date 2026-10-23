import { useState } from 'react';
import awardsData from '../../data/awards.js';
import { AwardsIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminAwards() {
  const [awards, setAwards] = useState(awardsData);
  const [showModal, setShowModal] = useState(false);
  const [newAward, setNewAward] = useState({
    title: '',
    date: '',
    tag: '',
    desc: '',
    img: 'assets/awards/1.jpg',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newAward.title || !newAward.tag) return;

    const item = {
      title: newAward.title,
      date: newAward.date || 'October 2026',
      tag: newAward.tag,
      desc: newAward.desc || 'Recognized for smart circular recycling solutions in Bangladesh.',
      img: newAward.img,
    };

    setAwards([item, ...awards]);
    setShowModal(false);
    setNewAward({
      title: '',
      date: '',
      tag: '',
      desc: '',
      img: 'assets/awards/1.jpg',
    });
  };

  const handleDelete = (index, title) => {
    if (window.confirm(`Are you sure you want to remove award "${title}"?`)) {
      setAwards(awards.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Company Awards & Recognitions</h1>
          <p>Dynamically manage company honors, certificates, national competitions, and global accolades.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={() => setShowModal(true)}
          >
            <AwardsIcon size={16} />
            <span>+ Add New Award</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Recognitions</span>
            <div className="sv-stat-icon-wrap orange"><AwardsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{awards.length} Honors</div>
          <div className="sv-stat-change">Verified credentials</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">International Accolades</span>
            <div className="sv-stat-icon-wrap green"><AwardsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">2 Global</div>
          <div className="sv-stat-change">CIRDAP & Hult Prize</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">National ICT Division</span>
            <div className="sv-stat-icon-wrap blue"><AwardsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">4 National</div>
          <div className="sv-stat-change">iDEA Project, BHTPA, DEIED</div>
        </div>
      </div>

      {/* Awards Table */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-card-title">All Certified Awards & Credentials</div>
        </div>

        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Certificate & Title</th>
                <th>Issuing Authority / Tag</th>
                <th>Conferred Date</th>
                <th>Achievement Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((aw, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={`/${aw.img}`}
                        alt={aw.title}
                        style={{
                          width: '56px',
                          height: '42px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <div style={{ fontWeight: 700, color: '#0f172a', maxWidth: '320px' }}>
                        {aw.title}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sv-badge orange">{aw.tag}</span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{aw.date}</td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '340px' }}>
                    {aw.desc}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px', color: '#dc2626' }}
                      onClick={() => handleDelete(idx, aw.title)}
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
              Add Award or Recognition
            </h2>
            <form onSubmit={handleAdd}>
              <div className="sv-form-group">
                <label className="sv-form-label">Award Title</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={newAward.title}
                  onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                  placeholder="e.g. Winner — Smart Bangladesh Circular Economy Challenge"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Issuing Authority / Tag</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    required
                    value={newAward.tag}
                    onChange={(e) => setNewAward({ ...newAward, tag: e.target.value })}
                    placeholder="e.g. ICT Division · iDEA Project"
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Date Conferred</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={newAward.date}
                    onChange={(e) => setNewAward({ ...newAward, date: e.target.value })}
                    placeholder="e.g. August 2026"
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Description / Citation</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={newAward.desc}
                  onChange={(e) => setNewAward({ ...newAward, desc: e.target.value })}
                  placeholder="Presented for innovative doorstep waste collection and digital scale transparency..."
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
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

