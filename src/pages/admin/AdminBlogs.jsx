import { useState } from 'react';
import { newsArticles } from '../../data/news.js';
import { BlogsIcon, EditIcon, TrashIcon, ImageIcon, PlusIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminBlogs() {
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_blogs_data');
      if (saved) return JSON.parse(saved);
      return newsArticles;
    } catch {
      return newsArticles;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    englishTitle: '',
    paper: 'দৈনিক আমাদের সময়',
    category: 'Innovation & Startup',
    badge: 'National Coverage',
    excerpt: '',
  });

  const [image, setImage] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const saveArticles = (newList) => {
    setArticles(newList);
    try {
      localStorage.setItem('sv_blogs_data', JSON.stringify(newList));
      window.dispatchEvent(new Event('sv_blogs_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      id: `blog-${Date.now()}`,
      title: '',
      englishTitle: '',
      paper: 'দৈনিক আমাদের সময়',
      category: 'Innovation & Startup',
      badge: 'National Coverage',
      excerpt: '',
    });
    setImage(''); // Blank by default as requested
    setUrlInput('');
    setShowModal(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setFormData({
      id: art.id,
      title: art.title || '',
      englishTitle: art.englishTitle || art.title || '',
      paper: art.paper || 'ScrapVenture Media',
      category: art.category || 'Green Tech',
      badge: art.badge || 'News Update',
      excerpt: art.excerpt || '',
    });
    setImage(art.image || '');
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
    if (!formData.englishTitle && !formData.title) return;

    const payload = {
      id: formData.id || `blog-${Date.now()}`,
      title: formData.title || formData.englishTitle,
      englishTitle: formData.englishTitle || formData.title,
      paper: formData.paper || 'ScrapVenture Press',
      category: formData.category || 'Green Tech',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateEn: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      image: image || '/assets/news/uits-launchpad-champions.webp',
      excerpt: formData.excerpt || 'New update from ScrapVenture circular economy initiatives.',
      badge: formData.badge || 'News Update',
      tagColor: 'green',
    };

    if (editingArticle) {
      const updated = articles.map((a) => (a.id === editingArticle.id ? { ...a, ...payload } : a));
      saveArticles(updated);
    } else {
      saveArticles([payload, ...articles]);
    }

    setShowModal(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete blog article "${title}"?`)) {
      const remaining = articles.filter((a) => a.id !== id);
      saveArticles(remaining);
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Blog & Media Releases</h1>
          <p>Dynamically compose, edit, publish, and manage company press articles, environmental features, and circular stories.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={handleOpenCreate}
          >
            <BlogsIcon size={16} />
            <span>+ Create New Blog</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Published Articles</span>
            <div className="sv-stat-icon-wrap green"><BlogsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{articles.length} Stories</div>
          <div className="sv-stat-change">Live on website blog</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Press Features</span>
            <div className="sv-stat-icon-wrap blue"><BlogsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">3 Outlets</div>
          <div className="sv-stat-change">Dainik Amader Shomoy, World Bank, IQAC</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Reader Reach</span>
            <div className="sv-stat-icon-wrap orange"><BlogsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">14.8k+ Views</div>
          <div className="sv-stat-change">High engagement</div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-card-title">All Published Company Articles</div>
        </div>

        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Article Headline</th>
                <th>Source / Paper</th>
                <th>Category & Badge</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '440px' }}>
                      <img
                        src={art.image}
                        alt="Blog thumbnail"
                        style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                          {art.englishTitle || art.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {art.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{art.paper}</span>
                  </td>
                  <td>
                    <span className="sv-badge green">{art.badge}</span>
                  </td>
                  <td style={{ fontSize: '12.5px', color: '#64748b' }}>{art.dateEn || art.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="sv-btn-edit"
                        onClick={() => handleOpenEdit(art)}
                        title="Edit blog article"
                      >
                        <EditIcon size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="sv-btn-danger"
                        onClick={() => handleDelete(art.id, art.englishTitle || art.title)}
                        title="Delete article"
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

      {/* Create / Edit Modal */}
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
                {editingArticle ? 'Edit Blog Article' : 'Create New Blog Article'}
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
                <label className="sv-form-label">Article Headline (English) *</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={formData.englishTitle}
                  onChange={(e) => setFormData({ ...formData, englishTitle: e.target.value })}
                  placeholder="e.g. ScrapVenture Expands Doorstep E-Waste Collection in Dhaka"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Headline (Bengali)</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ঢাকায় স্ক্র্যাপ ভেঞ্চারের নতুন ই-বর্জ্য সংগ্রহ কার্যক্রম শুরু"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Publication / Source</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.paper}
                    onChange={(e) => setFormData({ ...formData, paper: e.target.value })}
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Badge Label</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>
              </div>

              {/* Cover Image Upload Box with Cross Delete Button */}
              <div className="sv-form-group">
                <label className="sv-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={16} />
                  <span>Cover Image</span>
                </label>

                {image ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="sv-img-preview-card" style={{ width: '130px', height: '80px', flexShrink: 0 }}>
                      <img
                        src={image}
                        alt="Blog preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="sv-img-delete-btn"
                        onClick={handleRemoveImage}
                        title="Remove cover image"
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Cover Image Selected
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Click the red ✕ button on the image to remove and choose another.
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
                        Upload Cover Image from PC
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        PNG, JPG, or WEBP article image
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
                <label className="sv-form-label">Short Excerpt / Summary</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Enter a brief summary of the article..."
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
                  {editingArticle ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
