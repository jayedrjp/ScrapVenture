import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function UserDashboard() {
  const { currentUser, userOrders = [], userPickups = [], updateUserSettings, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  // Active Category in Left Sidebar: 'overview' | 'pickups' | 'orders' | 'settings'
  const [activeCategory, setActiveCategory] = useState('overview');
  const [pickupFilter, setPickupFilter] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Settings form state
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [passData, setPassData] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  // Update profile data if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
      });
    }
  }, [currentUser]);

  // Safe data extraction helpers to prevent crashes with any data shape
  const getPickupItems = (p) => {
    if (!p) return [];
    if (Array.isArray(p.items)) return p.items.map((i) => (typeof i === 'object' ? i.name : i));
    if (Array.isArray(p.materials)) return p.materials.map((i) => (typeof i === 'object' ? i.name : i));
    return ['Scrap Materials'];
  };

  const getOrderItems = (o) => {
    if (!o) return [];
    if (Array.isArray(o.items)) return o.items.map((i) => (typeof i === 'object' ? i.name : i));
    if (Array.isArray(o.itemsList)) return o.itemsList.map((i) => i.name);
    return ['Eco Product'];
  };

  if (!currentUser) {
    return null;
  }

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserSettings(profileData);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passData.newPass || passData.newPass.length < 6) {
      setPassMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passData.newPass !== passData.confirmPass) {
      setPassMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    changePassword(passData.currentPass, passData.newPass);
    setPassMessage({ type: 'success', text: 'Password successfully changed!' });
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPassMessage({ type: '', text: '' }), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredPickups = pickupFilter === 'all'
    ? userPickups
    : userPickups.filter((p) => (p.status || '').toLowerCase() === pickupFilter.toLowerCase());

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'pickups':
        return 'My Scrap Pickups';
      case 'orders':
        return 'Marketplace Orders';
      case 'settings':
        return 'Account Settings';
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <div className="sv-portal-layout">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sv-portal-backdrop ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* ================= LEFT SIDEBAR (CATEGORIES) ================= */}
      <aside className={`sv-portal-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sv-portal-brand-header">
          <Link to="/" className="sv-portal-brand-link">
            <img src="/assets/images/logo.png" alt="ScrapVenture" />
          </Link>
          <span className="sv-portal-role-tag">Customer</span>
        </div>

        {/* User Identity Snippet */}
        <div className="sv-portal-user-brief">
          <div className="sv-portal-user-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sv-portal-user-details">
            <span className="sv-portal-user-name">{currentUser?.name || 'Customer'}</span>
            <span className="sv-portal-user-status">Verified Account</span>
          </div>
        </div>

        {/* Category Navigation Menu */}
        <nav className="sv-portal-nav">
          <span className="sv-portal-nav-heading">Main Categories</span>

          {/* 1. Overview */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('overview'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            </span>
            <span>Overview &amp; Stats</span>
          </button>

          {/* 2. Scrap Pickups */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'pickups' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('pickups'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <span>My Scrap Pickups</span>
            <span className="sv-portal-nav-badge">{userPickups.length}</span>
          </button>

          {/* 3. Marketplace Orders */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('orders'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span>Marketplace Orders</span>
            <span className="sv-portal-nav-badge">{userOrders.length}</span>
          </button>

          <span className="sv-portal-nav-heading" style={{ marginTop: '12px' }}>Preferences</span>

          {/* 4. Settings */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('settings'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            <span>Account Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sv-portal-sidebar-footer">
          <Link to="/" className="sv-portal-footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Back to Website</span>
          </Link>
          <button type="button" className="sv-portal-logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN CONTENT (STATS & INFO) ================= */}
      <div className="sv-portal-main">
        {/* Top Header */}
        <header className="sv-portal-header">
          <div className="sv-portal-header-left">
            <button
              type="button"
              className="sv-portal-mobile-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open categories menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="sv-portal-title">{getCategoryTitle()}</h1>
          </div>

          <div className="sv-portal-header-right">
            <Link to="/marketplace" className="sv-portal-footer-link" style={{ color: '#16a34a' }}>
              Eco Marketplace &rarr;
            </Link>
            <Link to="/book-pickup" className="sv-portal-quick-btn">
              <span>+ Book a Pickup</span>
            </Link>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="sv-portal-body">
          {/* STATS ROW (ON RIGHT TOP) */}
          <div className="sv-portal-stats-grid">
            {/* Stat 1: Pickups */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Total Pickups</span>
                <span className="sv-portal-stat-value">{userPickups.length}</span>
              </div>
            </div>

            {/* Stat 2: Orders */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Marketplace Orders</span>
                <span className="sv-portal-stat-value">{userOrders.length}</span>
              </div>
            </div>

            {/* Stat 3: Total Weight */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="M7 21h10" />
                  <path d="M12 3v18" />
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Recycled Scrap</span>
                <span className="sv-portal-stat-value">54.5 kg</span>
              </div>
            </div>

            {/* Stat 4: Earnings & Savings */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Total Earned / Saved</span>
                <span className="sv-portal-stat-value">৳ 1,420</span>
              </div>
            </div>
          </div>

          {/* ================= DYNAMIC CATEGORY VIEWS ================= */}

          {/* CATEGORY 1: OVERVIEW */}
          {activeCategory === 'overview' && (
            <>
              {/* Welcome Banner */}
              <div className="sv-portal-welcome-banner">
                <div>
                  <h2>Welcome back, {currentUser?.name || 'Customer'}!</h2>
                  <p>Turn your household and office scrap into real value while keeping Bangladesh clean and green.</p>
                </div>
                <Link to="/book-pickup" className="sv-portal-quick-btn" style={{ background: '#ffffff', color: '#15803d' }}>
                  + Book New Pickup
                </Link>
              </div>

              {/* Recent Scrap Pickups Snippet */}
              <div className="sv-portal-card">
                <div className="sv-portal-card-header">
                  <div>
                    <h3 className="sv-portal-card-title">Recent Scrap Pickups</h3>
                    <p className="sv-portal-card-subtitle">Your latest door-to-door scrap collection requests</p>
                  </div>
                  <button
                    type="button"
                    className="sv-portal-quick-btn"
                    style={{ background: '#f1f5f9', color: '#334155', boxShadow: 'none' }}
                    onClick={() => setActiveCategory('pickups')}
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="sv-table-wrap">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Pickup ID</th>
                        <th>Date &amp; Time</th>
                        <th>Scrap Items</th>
                        <th>Collector</th>
                        <th>Est. Weight</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userPickups.slice(0, 3).map((pickup) => (
                        <tr key={pickup.id}>
                          <td><strong>{pickup.id}</strong></td>
                          <td>{pickup.date || pickup.scheduledDate || pickup.requestDate || 'N/A'}</td>
                          <td>{getPickupItems(pickup).join(', ')}</td>
                          <td>{pickup.collectorName}</td>
                          <td>{pickup.estimatedWeight}</td>
                          <td>
                            <span className={`sv-badge sv-badge--${
                              pickup.status === 'Completed' ? 'success' : pickup.status === 'En Route' ? 'warning' : 'info'
                            }`}>
                              {pickup.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Marketplace Orders Snippet */}
              <div className="sv-portal-card">
                <div className="sv-portal-card-header">
                  <div>
                    <h3 className="sv-portal-card-title">Recent Marketplace Purchases</h3>
                    <p className="sv-portal-card-subtitle">Recycled and eco-friendly products purchased by you</p>
                  </div>
                  <button
                    type="button"
                    className="sv-portal-quick-btn"
                    style={{ background: '#f1f5f9', color: '#334155', boxShadow: 'none' }}
                    onClick={() => setActiveCategory('orders')}
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="sv-table-wrap">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Product Items</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.slice(0, 3).map((order) => (
                        <tr key={order.id}>
                          <td><strong>{order.id}</strong></td>
                          <td>{getOrderItems(order).join(', ')}</td>
                          <td>{order.date}</td>
                          <td><strong>৳ {order.totalAmount || order.total || 0}</strong></td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <span className={`sv-badge sv-badge--${
                              order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'warning'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* CATEGORY 2: SCRAP PICKUPS (FULL) */}
          {activeCategory === 'pickups' && (
            <div className="sv-portal-card">
              <div className="sv-portal-card-header">
                <div>
                  <h3 className="sv-portal-card-title">My Scrap Collection Requests</h3>
                  <p className="sv-portal-card-subtitle">Live tracking and full history of your scrap pickups</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'scheduled', 'en route', 'completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className="sv-portal-quick-btn"
                      style={{
                        background: pickupFilter === st ? '#16a34a' : '#f1f5f9',
                        color: pickupFilter === st ? '#ffffff' : '#475569',
                        boxShadow: 'none',
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        textTransform: 'capitalize'
                      }}
                      onClick={() => setPickupFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredPickups.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>No pickups found in this status.</p>
                  <Link to="/book-pickup" className="sv-portal-quick-btn" style={{ marginTop: '10px' }}>
                    Book a Pickup Now
                  </Link>
                </div>
              ) : (
                <div className="sv-table-wrap">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Date &amp; Time</th>
                        <th>Scrap Categories</th>
                        <th>Assigned Collector</th>
                        <th>Estimated Weight</th>
                        <th>Address</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPickups.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.id}</strong></td>
                          <td>{p.date || p.scheduledDate || p.requestDate || 'N/A'}</td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {getPickupItems(p).map((it, idx) => (
                                <span key={idx} className="sv-task-item-tag">{it}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong>{p.collectorName}</strong>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{p.collectorPhone}</div>
                          </td>
                          <td>{p.estimatedWeight}</td>
                          <td style={{ maxWidth: '200px', fontSize: '12.5px' }}>{p.address}</td>
                          <td>
                            <span className={`sv-badge sv-badge--${
                              p.status === 'Completed' ? 'success' : p.status === 'En Route' ? 'warning' : 'info'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 3: MARKETPLACE ORDERS (FULL) */}
          {activeCategory === 'orders' && (
            <div className="sv-portal-card">
              <div className="sv-portal-card-header">
                <div>
                  <h3 className="sv-portal-card-title">My Eco Marketplace Orders</h3>
                  <p className="sv-portal-card-subtitle">History of recycled, upcycled and sustainable goods ordered by you</p>
                </div>
                <Link to="/marketplace" className="sv-portal-quick-btn">
                  Browse Products &rarr;
                </Link>
              </div>

              {userOrders.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>You haven't placed any marketplace orders yet.</p>
                  <Link to="/marketplace" className="sv-portal-quick-btn" style={{ marginTop: '10px' }}>
                    Shop Recycled Products
                  </Link>
                </div>
              ) : (
                <div className="sv-table-wrap">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Ordered Products</th>
                        <th>Date Placed</th>
                        <th>Total Amount</th>
                        <th>Payment Mode</th>
                        <th>Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>{ord.id}</strong></td>
                          <td>
                            <strong>{getOrderItems(ord).join(', ')}</strong>
                          </td>
                          <td>{ord.date}</td>
                          <td><strong>৳ {ord.totalAmount || ord.total || 0}</strong></td>
                          <td>{ord.paymentMethod}</td>
                          <td>
                            <span className={`sv-badge sv-badge--${
                              ord.status === 'Delivered' ? 'success' : ord.status === 'Shipped' ? 'info' : 'warning'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 4: ACCOUNT SETTINGS */}
          {activeCategory === 'settings' && (
            <div className="sv-settings-grid">
              {/* Profile Information */}
              <div className="sv-portal-card">
                <div className="sv-portal-card-header">
                  <div>
                    <h3 className="sv-portal-card-title">Profile Information</h3>
                    <p className="sv-portal-card-subtitle">Manage your name, phone number, and pickup address</p>
                  </div>
                </div>

                {profileSaved && (
                  <div style={{ padding: '10px 14px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
                    ✓ Profile successfully updated!
                  </div>
                )}

                <form onSubmit={handleProfileSave}>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Full Name / পুরো নাম</label>
                    <input
                      type="text"
                      className="sv-input"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="sv-form-group">
                    <label className="sv-form-label">Phone Number / ফোন নম্বর</label>
                    <input
                      type="tel"
                      className="sv-input"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="sv-form-group">
                    <label className="sv-form-label">Email Address / ইমেইল</label>
                    <input
                      type="email"
                      className="sv-input"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="sv-form-group">
                    <label className="sv-form-label">Default Pickup Address / ঠিকানা</label>
                    <textarea
                      className="sv-input"
                      rows="3"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="sv-portal-quick-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    Save Changes (পরিবর্তন সেভ করুন)
                  </button>
                </form>
              </div>

              {/* Security & Password */}
              <div className="sv-portal-card">
                <div className="sv-portal-card-header">
                  <div>
                    <h3 className="sv-portal-card-title">Change Password</h3>
                    <p className="sv-portal-card-subtitle">Ensure your account remains safe with a strong password</p>
                  </div>
                </div>

                {passMessage.text && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '16px',
                    background: passMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: passMessage.type === 'success' ? '#15803d' : '#b91c1c'
                  }}>
                    {passMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSave}>
                  <div className="sv-form-group">
                    <label className="sv-form-label">Current Password / বর্তমান পাসওয়ার্ড</label>
                    <input
                      type="password"
                      className="sv-input"
                      placeholder="••••••••"
                      value={passData.currentPass}
                      onChange={(e) => setPassData({ ...passData, currentPass: e.target.value })}
                      required
                    />
                  </div>

                  <div className="sv-form-group">
                    <label className="sv-form-label">New Password / নতুন পাসওয়ার্ড</label>
                    <input
                      type="password"
                      className="sv-input"
                      placeholder="At least 6 characters"
                      value={passData.newPass}
                      onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                      required
                    />
                  </div>

                  <div className="sv-form-group">
                    <label className="sv-form-label">Confirm New Password / পাসওয়ার্ড নিশ্চিত করুন</label>
                    <input
                      type="password"
                      className="sv-input"
                      placeholder="••••••••"
                      value={passData.confirmPass}
                      onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="sv-portal-quick-btn" style={{ width: '100%', justifyContent: 'center', background: '#0f172a' }}>
                    Update Password (পাসওয়ার্ড আপডেট করুন)
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
