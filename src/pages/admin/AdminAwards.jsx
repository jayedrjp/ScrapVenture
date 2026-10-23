import { useState } from 'react';
import awardsData from '../../data/awards.js';
import { AwardsIcon, EditIcon, TrashIcon, ImageIcon, PlusIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminAwards() {
  const [awards, setAwards] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_awards_data');
      if (saved) return JSON.parse(saved);
      return awardsData;
    } catch {
      return awardsData;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    tag: '',
    desc: '',
  });

  const [image, setImage] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const saveAwards = (newList) => {
    setAwards(newList);
    try {
      localStorage.setItem('sv_awards_data', JSON.stringify(newList));
      window.dispatchEvent(new Event('sv_awards_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      title: '',
      date: 'October 2026',
      tag: 'ICT Division · iDEA',
      desc: '',
    });
    setImage(''); // Blank by default
    setUrlInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (aw, idx) => {
    setEditingIndex(idx);
    setFormData({
      title: aw.title || '',
      date: aw.date || '',
      tag: aw.tag || '',
      desc: aw.desc || '',
    });
    setImage(aw.img || '');
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
    if (!formData.title || !formData.tag) return;

    const payload = {
      title: formData.title,
      date: formData.date || 'October 2026',
      tag: formData.tag,
      desc: formData.desc || 'Recognized for smart circular recycling solutions in Bangladesh.',
      img: image || 'assets/awards/1.jpg',
    };

    if (editingIndex !== null) {
      const updated = [...awards];
      updated[editingIndex] = payload;
      saveAwards(updated);
    } else {
      saveAwards([payload, ...awards]);
    }

    setShowModal(false);
  };

  const handleDelete = (index, title) => {
    if (window.confirm(`Are you sure you want to remove award "${title}"?`)) {
      const remaining = awards.filter((_, idx) => idx !== index);
      saveAwards(remaining);
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Company Awards & Recognitions</h1>
          <p>Manage company honors, national competitions, certificates, conferred dates, and credentials with real-time editing.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={handleOpenAdd}
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
              {awards.map((aw, idx) => {
                const imgSrc = aw.img?.startsWith('data:') || aw.img?.startsWith('http') || aw.img?.startsWith('/')
                  ? aw.img
                  : `/${aw.img || 'assets/awards/1.jpg'}`;

                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={imgSrc}
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
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="sv-btn-edit"
                          onClick={() => handleOpenEdit(aw, idx)}
                          title="Edit award title, tag, date, and achievement summary"
                        >
                          <EditIcon size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="sv-btn-danger"
                          onClick={() => handleDelete(idx, aw.title)}
                          title="Delete award"
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
              maxWidth: '540px',
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
                {editingIndex !== null ? 'Edit Award & Recognition' : 'Add Award or Recognition'}
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
                <label className="sv-form-label">Award Title *</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Winner — Smart Bangladesh Circular Economy Challenge"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Tag / Issuing Authority *</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. ICT Division · iDEA Project"
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Conferred Date *</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. August 2026"
                  />
                </div>
              </div>

              {/* Certificate Image Upload Box with Cross Delete Button */}
              <div className="sv-form-group">
                <label className="sv-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={16} />
                  <span>Certificate / Plaque Image</span>
                </label>

                {image ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="sv-img-preview-card" style={{ width: '120px', height: '80px', flexShrink: 0 }}>
                      <img
                        src={image.startsWith('data:') || image.startsWith('http') || image.startsWith('/') ? image : `/${image}`}
                        alt="Award preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="sv-img-delete-btn"
                        onClick={handleRemoveImage}
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Certificate Photo Selected
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
                        Upload Certificate Photo from PC
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        PNG, JPG, or WEBP award image
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
                <label className="sv-form-label">Achievement Summary / Citation Description</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
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
                  {editingIndex !== null ? 'Save Changes' : 'Save Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
