import { useState } from 'react';
import { newsArticles } from '../../data/news.js';
import { BlogsIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminBlogs() {
  const [articles, setArticles] = useState(newsArticles);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    englishTitle: '',
    paper: 'দৈনিক আমাদের সময়',
    category: 'Innovation & Startup',
    badge: 'National Coverage',
    excerpt: '',
    image: '/assets/news/uits-launchpad-champions.webp',
  });

  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!newBlog.englishTitle && !newBlog.title) return;

    const created = {
      id: `blog-${Date.now()}`,
      title: newBlog.title || newBlog.englishTitle,
      englishTitle: newBlog.englishTitle || newBlog.title,
      paper: newBlog.paper || 'ScrapVenture Press',
      category: newBlog.category || 'Green Tech',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      image: newBlog.image,
      excerpt: newBlog.excerpt || 'New update from Scrap Venture circular economy initiatives.',
      badge: newBlog.badge || 'News Update',
      tagColor: 'green',
    };

    setArticles([created, ...articles]);
    setShowCreateModal(false);
    setNewBlog({
      title: '',
      englishTitle: '',
      paper: 'দৈনিক আমাদের সময়',
      category: 'Innovation & Startup',
      badge: 'National Coverage',
      excerpt: '',
      image: '/assets/news/uits-launchpad-champions.webp',
    });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete blog article "${title}"?`)) {
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Blog & Media Releases</h1>
          <p>Dynamically compose, edit, publish, and delete company articles, news features, and circular stories.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={() => setShowCreateModal(true)}
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
                    <div style={{ maxWidth: '420px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                        {art.englishTitle || art.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {art.title}
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="sv-btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px', color: '#dc2626' }}
                        onClick={() => handleDelete(art.id, art.englishTitle || art.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#111827' }}>
              Create New Blog Article
            </h2>
            <form onSubmit={handleCreateBlog}>
              <div className="sv-form-group">
                <label className="sv-form-label">Article Headline (English)</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={newBlog.englishTitle}
                  onChange={(e) => setNewBlog({ ...newBlog, englishTitle: e.target.value })}
                  placeholder="e.g. ScrapVenture Expands Doorstep E-Waste Collection in Dhaka"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Headline (Bengali)</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="e.g. ঢাকায় স্ক্র্যাপ ভেঞ্চারের নতুন ই-বর্জ্য সংগ্রহ কার্যক্রম শুরু"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Publication / Source</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={newBlog.paper}
                    onChange={(e) => setNewBlog({ ...newBlog, paper: e.target.value })}
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Badge Label</label>
                  <input
                    type="text"
                    className="sv-form-input"
                    value={newBlog.badge}
                    onChange={(e) => setNewBlog({ ...newBlog, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Short Excerpt / Summary</label>
                <textarea
                  className="sv-form-input"
                  rows={3}
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  placeholder="Enter a brief summary of the article..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="sv-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sv-btn-primary">
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

