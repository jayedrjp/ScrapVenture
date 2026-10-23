import { useState, useEffect } from 'react';
import { PRODUCTS, MARKETPLACE_CATEGORIES } from '../../data/marketplaceData.js';
import { MarketplaceIcon, StarIcon, EditIcon, TrashIcon, ImageIcon, PlusIcon } from '../../components/admin/AdminIcons.jsx';

export default function AdminMarketplace() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_marketplace_products');
      if (saved) return JSON.parse(saved);
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New product form state
  const [formProd, setFormProd] = useState({
    name: '',
    category: 'recycled-bags',
    originalPrice: '',
    price: '',
    stock: 15,
    isOutOfStock: false,
    sustainabilityImpact: '',
    shortDesc: '',
    description: '',
  });

  // Images state (array of up to 3 images)
  const [productImages, setProductImages] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  // Sync to localStorage and dispatch event for live Marketplace sync
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('sv_marketplace_products', JSON.stringify(newProducts));
      window.dispatchEvent(new Event('sv_marketplace_sync'));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
      p.sustainabilityImpact?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate discount percentage
  const calculateDiscount = (orig, off) => {
    const origNum = Number(orig);
    const offNum = Number(off);
    if (origNum > 0 && offNum > 0 && origNum > offNum) {
      return Math.round(((origNum - offNum) / origNum) * 100);
    }
    return 0;
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormProd({
      name: '',
      category: 'recycled-bags',
      originalPrice: '',
      price: '',
      stock: 15,
      isOutOfStock: false,
      sustainabilityImpact: '',
      shortDesc: '',
      description: '',
    });
    setProductImages([]); // Empty initially as requested
    setUrlInput('');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormProd({
      name: prod.name || '',
      category: prod.category || 'recycled-bags',
      originalPrice: prod.originalPrice || prod.price || '',
      price: prod.price || '',
      stock: prod.stock ?? 10,
      isOutOfStock: prod.availability?.toLowerCase().includes('out of stock') || prod.stock === 0,
      sustainabilityImpact: prod.sustainabilityImpact || '',
      shortDesc: prod.shortDesc || '',
      description: prod.description || '',
    });

    const existingImages = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : (prod.image ? [prod.image] : []);
    setProductImages(existingImages);
    setUrlInput('');
    setShowAddModal(true);
  };

  // Handle local file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (productImages.length >= 3) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages((prev) => {
          if (prev.length >= 3) return prev;
          return [...prev, reader.result];
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Handle adding image via URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (productImages.length >= 3) {
      alert('You can upload up to 3 images.');
      return;
    }
    setProductImages([...productImages, urlInput.trim()]);
    setUrlInput('');
  };

  // Delete an image
  const handleRemoveImage = (indexToRemove) => {
    setProductImages(productImages.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Add or Edit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formProd.name || !formProd.price) return;

    const sellingPrice = Number(formProd.price);
    const origPrice = formProd.originalPrice ? Number(formProd.originalPrice) : sellingPrice;
    const stockNum = formProd.isOutOfStock ? 0 : Number(formProd.stock) || 10;
    const availText = formProd.isOutOfStock ? 'Out of Stock' : `In Stock (${stockNum} units)`;

    // If no images uploaded, use a fallback recycled image
    const finalImages = productImages.length > 0
      ? productImages
      : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'];
    const primaryImg = finalImages[0];
    const catObj = MARKETPLACE_CATEGORIES.find((c) => c.id === formProd.category);

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formProd.name,
            category: formProd.category,
            categoryName: catObj?.name || p.categoryName || 'Recycled Goods',
            price: sellingPrice,
            originalPrice: origPrice > sellingPrice ? origPrice : (origPrice || sellingPrice),
            stock: stockNum,
            availability: availText,
            image: primaryImg,
            images: finalImages,
            shortDesc: formProd.shortDesc || p.shortDesc || formProd.name,
            description: formProd.description || p.description || formProd.name,
            sustainabilityImpact: formProd.sustainabilityImpact || p.sustainabilityImpact || 'Diverts solid plastic waste from landfills.',
          };
        }
        return p;
      });
      saveProducts(updated);
    } else {
      // Create new
      const newItem = {
        id: `prod-${Date.now()}`,
        name: formProd.name,
        category: formProd.category,
        categoryName: catObj?.name || 'Recycled Goods',
        price: sellingPrice,
        originalPrice: origPrice > sellingPrice ? origPrice : (origPrice || sellingPrice),
        stock: stockNum,
        availability: availText,
        image: primaryImg,
        images: finalImages,
        shortDesc: formProd.shortDesc || formProd.name,
        description: formProd.description || formProd.name,
        sustainabilityImpact: formProd.sustainabilityImpact || 'Diverts solid plastic waste from landfills.',
        rating: 5.0,
        reviewsCount: 1,
        badges: ['Newly Added', 'Recycled'],
        materials: 'Reclaimed & Upcycled Eco Materials',
        specs: { Origin: 'Bangladesh', Certified: 'ScrapVenture Circular' },
        reviews: [],
      };
      saveProducts([newItem, ...products]);
    }

    setShowAddModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      const remaining = products.filter((p) => p.id !== id);
      saveProducts(remaining);
    }
  };

  const discountPercent = calculateDiscount(formProd.originalPrice, formProd.price);

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Marketplace Products</h1>
          <p>Real-time catalog control. Edit existing listings, manage stock, offer discounts, and upload multi-image recycled products.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={handleOpenAddModal}
          >
            <MarketplaceIcon size={16} />
            <span>+ Add New Recycle Product</span>
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
          <div className="sv-stat-change">Live on customer store</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">In Stock Items</span>
            <div className="sv-stat-icon-wrap blue"><MarketplaceIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">
            {products.filter((p) => (p.stock ?? 1) > 0 && !p.availability?.toLowerCase().includes('out of stock')).length} In Stock
          </div>
          <div className="sv-stat-change">Ready for dispatch</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Discount Offers</span>
            <div className="sv-stat-icon-wrap orange"><MarketplaceIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">
            {products.filter((p) => p.originalPrice && p.originalPrice > p.price).length} On Sale
          </div>
          <div className="sv-stat-change">Showing % OFF badges</div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="sv-card">
        <div className="sv-card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div className="sv-search-box">
            <input
              type="text"
              placeholder="Search product titles, categories or impact..."
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
                <th>Pricing & Offer</th>
                <th>Stock Availability</th>
                <th>Eco Impact Metric</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No products matched your search or category filter.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const hasDiscount = prod.originalPrice && prod.originalPrice > prod.price;
                  const itemDiscountPercent = hasDiscount
                    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                    : 0;
                  const isOutOfStock = prod.stock === 0 || prod.availability?.toLowerCase().includes('out of stock');

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{prod.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <StarIcon size={12} fill="#f59e0b" className="text-amber-500" />
                              <span>{prod.rating || 5.0} ({prod.reviewsCount || 1} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="sv-badge blue">{prod.categoryName || prod.category}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '14px' }}>
                              ৳{prod.price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '12px' }}>
                                ৳{prod.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {hasDiscount && (
                            <span className="sv-badge orange" style={{ fontSize: '10.5px', padding: '1px 6px', width: 'fit-content' }}>
                              {itemDiscountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {isOutOfStock ? (
                          <span className="sv-badge red">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="sv-badge green">
                            In Stock ({prod.stock ?? 12} units)
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '12px', color: '#475569', maxWidth: '240px' }}>
                        {prod.sustainabilityImpact}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="sv-btn-edit"
                            onClick={() => handleOpenEditModal(prod)}
                            title="Edit product details, price, and stock"
                          >
                            <EditIcon size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="sv-btn-danger"
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="Delete product listing"
                          >
                            <TrashIcon size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '640px',
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
                {editingProduct ? 'Edit Recycled Product' : 'Add New Recycle Product'}
              </h2>
              <button
                type="button"
                className="sv-modal-close-btn"
                onClick={() => setShowAddModal(false)}
                title="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              {/* Product Name */}
              <div className="sv-form-group">
                <label className="sv-form-label">Product Name *</label>
                <input
                  type="text"
                  className="sv-form-input"
                  required
                  value={formProd.name}
                  onChange={(e) => setFormProd({ ...formProd, name: e.target.value })}
                  placeholder="e.g. Upcycled Denim Everyday Backpack"
                />
              </div>

              {/* Category */}
              <div className="sv-form-group">
                <label className="sv-form-label">Category *</label>
                <select
                  className="sv-form-input"
                  value={formProd.category}
                  onChange={(e) => setFormProd({ ...formProd, category: e.target.value })}
                >
                  {MARKETPLACE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price & Current Offer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Original Price (৳ BDT) *</label>
                  <input
                    type="number"
                    className="sv-form-input"
                    value={formProd.originalPrice}
                    onChange={(e) => setFormProd({ ...formProd, originalPrice: e.target.value })}
                    placeholder="e.g. 1200"
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Original regular retail price</span>
                </div>

                <div className="sv-form-group">
                  <label className="sv-form-label">Selling / Offer Price (৳ BDT) *</label>
                  <input
                    type="number"
                    className="sv-form-input"
                    required
                    value={formProd.price}
                    onChange={(e) => setFormProd({ ...formProd, price: e.target.value })}
                    placeholder="e.g. 1000"
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Actual selling price at checkout</span>
                </div>
              </div>

              {/* Dynamic Discount Display */}
              {discountPercent > 0 && (
                <div
                  style={{
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#c2410c', fontWeight: 600 }}>
                    🔥 Active Discount: <strong>{discountPercent}% OFF</strong> (Save ৳{(Number(formProd.originalPrice) - Number(formProd.price)).toLocaleString()})
                  </span>
                  <span className="sv-badge orange" style={{ fontSize: '12px' }}>
                    {discountPercent}% OFF
                  </span>
                </div>
              )}

              {/* Stock and Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="sv-form-group">
                  <label className="sv-form-label">Stock Units</label>
                  <input
                    type="number"
                    className="sv-form-input"
                    value={formProd.stock}
                    onChange={(e) => setFormProd({ ...formProd, stock: e.target.value })}
                    placeholder="e.g. 25"
                    disabled={formProd.isOutOfStock}
                  />
                </div>

                <div className="sv-form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="sv-form-label">Availability Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}>
                    <input
                      type="checkbox"
                      checked={formProd.isOutOfStock}
                      onChange={(e) => setFormProd({ ...formProd, isOutOfStock: e.target.checked })}
                    />
                    <span style={{ fontWeight: 600, color: formProd.isOutOfStock ? '#dc2626' : '#16a34a' }}>
                      {formProd.isOutOfStock ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Sustainability Impact */}
              <div className="sv-form-group">
                <label className="sv-form-label">Sustainability / Eco Impact Note</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={formProd.sustainabilityImpact}
                  onChange={(e) => setFormProd({ ...formProd, sustainabilityImpact: e.target.value })}
                  placeholder="e.g. Diverts 3.5 kg of solid plastic waste from waterways."
                />
              </div>

              {/* Short Description */}
              <div className="sv-form-group">
                <label className="sv-form-label">Short Description</label>
                <input
                  type="text"
                  className="sv-form-input"
                  value={formProd.shortDesc}
                  onChange={(e) => setFormProd({ ...formProd, shortDesc: e.target.value })}
                  placeholder="Brief 1-line product overview..."
                />
              </div>

              {/* Custom Image Upload & URL Box (Up to 3 Times with Cross Button) */}
              <div className="sv-form-group" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="sv-form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={16} />
                    <span>Product Images ({productImages.length}/3 Uploaded)</span>
                  </label>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                    Upload from PC or paste URL (max 3 images)
                  </span>
                </div>

                {/* Upload Box (Visible if less than 3 images uploaded) */}
                {productImages.length < 3 && (
                  <div style={{ marginBottom: '14px' }}>
                    <label className="sv-upload-dropzone" style={{ display: 'block' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: '#ffedd5',
                          color: '#ea580c',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <PlusIcon size={24} strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        Click to Upload Image from PC
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                        JPG, PNG, WEBP (Supports up to 3 photos)
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                    </label>

                    {/* Or URL Input */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <input
                        type="text"
                        className="sv-form-input"
                        placeholder="Or paste an image web URL..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        style={{ fontSize: '12.5px', padding: '7px 12px' }}
                      />
                      <button
                        type="button"
                        className="sv-btn-secondary"
                        onClick={handleAddUrl}
                        style={{ padding: '7px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                )}

                {/* Uploaded Images Preview Grid with Cross (X) buttons to remove */}
                {productImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                    {productImages.map((img, idx) => (
                      <div key={idx} className="sv-img-preview-card" style={{ height: '110px' }}>
                        <img
                          src={img}
                          alt={`Uploaded ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Cross Delete Button on Image */}
                        <button
                          type="button"
                          className="sv-img-delete-btn"
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove image"
                        >
                          ✕
                        </button>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(15,23,42,0.65)',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 6px',
                            textAlign: 'center',
                          }}
                        >
                          {idx === 0 ? 'Primary Cover' : `Photo #${idx + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  className="sv-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sv-btn-primary">
                  {editingProduct ? 'Save & Update Product' : 'Save & Publish to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
