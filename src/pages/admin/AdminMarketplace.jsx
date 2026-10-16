import { useState } from 'react';
import { PRODUCTS, MARKETPLACE_CATEGORIES } from '../../data/marketplaceData.js';
import { MarketplaceIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminMarketplace() {
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'recycled-bags',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    sustainabilityImpact: '',
  });

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const item = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      categoryName: MARKETPLACE_CATEGORIES.find((c) => c.id === newProd.category)?.name || 'Recycled Goods',
      price: Number(newProd.price),
      stock: Number(newProd.stock) || 10,
      image: newProd.image,
      sustainabilityImpact: newProd.sustainabilityImpact || 'Diverts solid plastic waste from landfills.',
      rating: 5.0,
      reviewsCount: 1,
      badges: ['Newly Added', 'Recycled'],
    };

    setProducts([item, ...products]);
    setShowAddModal(false);
    setNewProd({
      name: '',
      category: 'recycled-bags',
      price: '',
      stock: '',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      sustainabilityImpact: '',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Marketplace Products</h1>
          <p>Catalog management for circular and recycled consumer products.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <MarketplaceIcon size={16} />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Active Listings</span>
            <div className="sv-stat-icon-wrap green"><MarketplaceIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{products.length} Items</div>
          <div className="sv-stat-change">All live on consumer store</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Categories</span>
            <div className="sv-stat-icon-wrap blue"><MarketplaceIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{MARKETPLACE_CATEGORIES.length - 1} Departments</div>
          <div className="sv-stat-change">100% upcycled materials</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Average Unit Price</span>
            <div className="sv-stat-icon-wrap orange"><MarketplaceIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">৳2,150</div>
          <div className="sv-stat-change">Fair artisan margins</div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-search-box">
            <input
              type="text"
              placeholder="Search product titles or materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="sv-btn-secondary"
                style={{
                  fontSize: '12px',
                  padding: '5px 10px',
                  background: selectedCategory === cat.id ? '#111827' : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : '#334155',
                }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Availability</th>
                <th>Eco Impact Metric</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{prod.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          ★ {prod.rating} ({prod.reviewsCount} reviews)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sv-badge blue">{prod.categoryName}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    ৳{prod.price.toLocaleString()}
                  </td>
                  <td>
                    <span className="sv-badge green">
                      In Stock ({prod.stock || 12} units)
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '280px' }}>
                    {prod.sustainabilityImpact}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px', color: '#dc2626' }}
                      onClick={() => handleDelete(prod.id)}
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

      {/* Add Product Modal */}
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
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#111827' }}>
              Add New Recycled Product
            </h2>
            <form onSubmit={handleAddProduct}>
              <div className="sv-form-group">
                <label className="sv-form-label">Product Name</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Upcycled Plastic Waste Planter"
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Category</label>
                <select
                  className="sv-form-input"
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                >
                  {MARKETPLACE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Price (৳ BDT)</label>
                  <input
                    type="number"
                    className="sv-form-input"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="1200"
                  />
                </div>
                <div className="sv-form-group">
                  <label className="sv-form-label">Stock Units</label>
                  <input
                    type="number"
                    className="sv-form-input"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">Sustainability Impact Note</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={newProd.sustainabilityImpact}
                  onChange={(e) => setNewProd({ ...newProd, sustainabilityImpact: e.target.value })}
                  placeholder="e.g. Diverts 3.5kg ocean-bound plastic."
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
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

