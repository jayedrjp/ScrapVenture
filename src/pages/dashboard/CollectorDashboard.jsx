import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CollectorDashboard() {
  const { currentUser, collectorPickups = [], updateCollectorTask, logout } = useAuth();
  const navigate = useNavigate();

  // Authentication Guard: redirect to collector login if not authenticated as collector
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'collector') {
      navigate('/collector/login', { replace: true });
    }
  }, [currentUser, navigate]);

  // Active Category in Left Sidebar: 'overview' | 'routes' | 'completed' | 'weighing' | 'earnings'
  const [activeCategory, setActiveCategory] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Safe data extraction helper to prevent any crashes
  const getTaskItems = (task) => {
    if (!task) return [];
    if (Array.isArray(task.scrapItems)) return task.scrapItems;
    if (Array.isArray(task.materials)) return task.materials;
    if (Array.isArray(task.items)) return task.items;
    return ['Scrap Materials'];
  };

  // Modal state for digital scale weighing completion
  const [weighingModal, setWeighingModal] = useState({
    isOpen: false,
    task: null,
    weight: '',
    payout: '',
  });

  const handleOpenWeighing = (task) => {
    setWeighingModal({
      isOpen: true,
      task,
      weight: task?.estimatedWeight ? String(task.estimatedWeight).replace(/[^0-9.]/g, '') : '25',
      payout: task?.payout ? String(task.payout).replace(/[^0-9.]/g, '') : '550',
    });
  };

  const handleCloseWeighing = () => {
    setWeighingModal({ isOpen: false, task: null, weight: '', payout: '' });
  };

  const handleSubmitWeighing = (e) => {
    e.preventDefault();
    if (!weighingModal.task) return;
    updateCollectorTask(
      weighingModal.task.id,
      'Completed',
      weighingModal.weight,
      weighingModal.payout
    );
    handleCloseWeighing();
  };

  const handleSetEnRoute = (taskId) => {
    updateCollectorTask(taskId, 'En Route');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser || currentUser.role !== 'collector') {
    return null;
  }

  const pendingTasks = collectorPickups.filter((t) => t.status !== 'Completed');
  const completedTasks = collectorPickups.filter((t) => t.status === 'Completed');

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'routes':
        return 'Active Route & House Visits';
      case 'completed':
        return 'Completed Pickups History';
      case 'weighing':
        return 'Digital Scale Weighing Tool';
      case 'earnings':
        return 'Earnings & Commission Statement';
      default:
        return 'Collector Partner Overview';
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
          <span className="sv-portal-role-tag" style={{ background: 'rgba(5, 150, 105, 0.2)', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
            Collector
          </span>
        </div>

        {/* Collector Identity Card */}
        <div className="sv-portal-user-brief">
          <div className="sv-portal-user-avatar" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="sv-portal-user-details">
            <span className="sv-portal-user-name">{currentUser?.name || 'Collector Partner'}</span>
            <span className="sv-portal-user-status" style={{ color: '#34d399' }}>
              {currentUser?.badgeId || 'ID #COL-104'} &bull; Active
            </span>
          </div>
        </div>

        {/* Categories Menu */}
        <nav className="sv-portal-nav">
          <span className="sv-portal-nav-heading">Collection Operations</span>

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
            <span>Overview &amp; KPIs</span>
          </button>

          {/* 2. Active Route & Pickups */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'routes' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('routes'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <span>Active House Route</span>
            {pendingTasks.length > 0 && (
              <span className="sv-portal-nav-badge" style={{ background: '#f59e0b', color: '#ffffff' }}>
                {pendingTasks.length}
              </span>
            )}
          </button>

          {/* 3. Completed Pickups */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'completed' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('completed'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
            <span>Completed Pickups</span>
            <span className="sv-portal-nav-badge">{completedTasks.length}</span>
          </button>

          <span className="sv-portal-nav-heading" style={{ marginTop: '12px' }}>Finance &amp; Scale</span>

          {/* 4. Digital Scale */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'weighing' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('weighing'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
            </span>
            <span>Digital Scale (ওজন)</span>
          </button>

          {/* 5. Earnings */}
          <button
            type="button"
            className={`sv-portal-nav-btn ${activeCategory === 'earnings' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('earnings'); setMobileSidebarOpen(false); }}
          >
            <span className="sv-portal-nav-btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
            </span>
            <span>Earnings &amp; Payouts</span>
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
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 800,
              background: '#ecfdf5',
              color: '#059669',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(5, 150, 105, 0.3)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              Duty: Active &bull; Zone Dhaka
            </span>

            <button
              type="button"
              className="sv-portal-quick-btn"
              onClick={() => handleOpenWeighing(pendingTasks[0] || null)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 7h18M7 21h10" />
              </svg>
              <span>+ Record Scale Weight</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="sv-portal-body">
          {/* STATS ROW ON RIGHT (KPI METRICS) */}
          <div className="sv-portal-stats-grid">
            {/* Stat 1: Completed Pickups */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Pickups Completed</span>
                <span className="sv-portal-stat-value">{completedTasks.length}</span>
              </div>
            </div>

            {/* Stat 2: Weight Collected */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="M7 21h10" />
                  <path d="M12 3v18" />
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Total Weight Collected</span>
                <span className="sv-portal-stat-value">85.5 kg</span>
              </div>
            </div>

            {/* Stat 3: Total Earnings */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Total Earnings</span>
                <span className="sv-portal-stat-value">৳ 2,450</span>
              </div>
            </div>

            {/* Stat 4: Pending Visits */}
            <div className="sv-portal-stat-card">
              <div className="sv-portal-stat-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="sv-portal-stat-info">
                <span className="sv-portal-stat-label">Pending House Visits</span>
                <span className="sv-portal-stat-value">{pendingTasks.length}</span>
              </div>
            </div>
          </div>

          {/* ================= DYNAMIC CATEGORY VIEWS ================= */}

          {/* CATEGORY 1: OVERVIEW */}
          {activeCategory === 'overview' && (
            <>
              {/* Partner Banner */}
              <div className="sv-portal-welcome-banner" style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 60%, #0d9488 100%)' }}>
                <div>
                  <h2>Today&apos;s Collection Route: {currentUser?.zone || 'Dhaka North (Banani, Gulshan)'}</h2>
                  <p>
                    Vehicle: <strong>{currentUser?.vehicle || 'Motorized Van'}</strong> &bull; Scheduled Stops: <strong>{pendingTasks.length} houses</strong>
                  </p>
                </div>
                <button
                  type="button"
                  className="sv-portal-quick-btn"
                  style={{ background: '#ffffff', color: '#047857' }}
                  onClick={() => setActiveCategory('routes')}
                >
                  View Active Route &rarr;
                </button>
              </div>

              {/* Next Immediate Pickups */}
              <div className="sv-portal-card">
                <div className="sv-portal-card-header">
                  <div>
                    <h3 className="sv-portal-card-title">Pending House-to-House Pickups</h3>
                    <p className="sv-portal-card-subtitle">Customers waiting for scrap collection</p>
                  </div>
                  <button
                    type="button"
                    className="sv-portal-quick-btn"
                    style={{ background: '#f1f5f9', color: '#334155', boxShadow: 'none' }}
                    onClick={() => setActiveCategory('routes')}
                  >
                    View All Stops ({pendingTasks.length}) &rarr;
                  </button>
                </div>

                <div className="sv-task-grid">
                  {pendingTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="sv-task-card">
                      <div>
                        <div className="sv-task-card-header">
                          <span className="sv-task-cust-name">{task.customerName}</span>
                          <span className={`sv-badge sv-badge--${task.status === 'En Route' ? 'warning' : 'info'}`}>
                            {task.status}
                          </span>
                        </div>

                        <div className="sv-task-card-body">
                          <div className="sv-task-row">
                            <span>📍</span>
                            <span><strong>Address:</strong> {task.address}</span>
                          </div>
                          <div className="sv-task-row">
                            <span>🕒</span>
                            <span><strong>Time:</strong> {task.scheduledTime || task.timeSlot || 'Today'}</span>
                          </div>
                          <div className="sv-task-row">
                            <span>⚖️</span>
                            <span><strong>Est. Weight:</strong> {task.estimatedWeight}</span>
                          </div>
                          <div className="sv-task-items-tags">
                            {getTaskItems(task).map((item, idx) => (
                              <span key={idx} className="sv-task-item-tag">{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="sv-task-card-actions">
                        <a href={`tel:${task.phone || task.customerPhone || '01700-000000'}`} className="sv-task-call-btn">
                          📞 Call
                        </a>
                        {task.status !== 'En Route' ? (
                          <button
                            type="button"
                            className="sv-task-action-btn sv-task-action-btn--enroute"
                            onClick={() => handleSetEnRoute(task.id)}
                          >
                            Mark En Route 🚚
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sv-task-action-btn sv-task-action-btn--primary"
                            onClick={() => handleOpenWeighing(task)}
                          >
                            Scale &amp; Complete ⚖️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* CATEGORY 2: ACTIVE ROUTE & PICKUPS (FULL) */}
          {activeCategory === 'routes' && (
            <div className="sv-portal-card">
              <div className="sv-portal-card-header">
                <div>
                  <h3 className="sv-portal-card-title">House-to-House Collection Stops</h3>
                  <p className="sv-portal-card-subtitle">Assigned residential &amp; office scrap pickups for today</p>
                </div>
                <span className="sv-badge sv-badge--warning">
                  {pendingTasks.length} Pending Stops
                </span>
              </div>

              {pendingTasks.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#059669' }}>
                    🎉 All assigned stops completed for today!
                  </p>
                  <p style={{ fontSize: '13.5px' }}>New pickup requests will appear here in real-time.</p>
                </div>
              ) : (
                <div className="sv-task-grid">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="sv-task-card">
                      <div>
                        <div className="sv-task-card-header">
                          <span className="sv-task-cust-name">{task.customerName}</span>
                          <span className={`sv-badge sv-badge--${task.status === 'En Route' ? 'warning' : 'info'}`}>
                            {task.status}
                          </span>
                        </div>

                        <div className="sv-task-card-body">
                          <div className="sv-task-row">
                            <span>📍</span>
                            <span><strong>Address:</strong> {task.address}</span>
                          </div>
                          <div className="sv-task-row">
                            <span>🕒</span>
                            <span><strong>Time:</strong> {task.scheduledTime || task.timeSlot || 'Today'}</span>
                          </div>
                          <div className="sv-task-row">
                            <span>⚖️</span>
                            <span><strong>Est. Weight:</strong> {task.estimatedWeight}</span>
                          </div>
                          <div className="sv-task-items-tags">
                            {getTaskItems(task).map((item, idx) => (
                              <span key={idx} className="sv-task-item-tag">{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="sv-task-card-actions">
                        <a href={`tel:${task.phone || task.customerPhone || '01700-000000'}`} className="sv-task-call-btn">
                          📞 Call Customer
                        </a>
                        {task.status !== 'En Route' ? (
                          <button
                            type="button"
                            className="sv-task-action-btn sv-task-action-btn--enroute"
                            onClick={() => handleSetEnRoute(task.id)}
                          >
                            Mark En Route
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sv-task-action-btn sv-task-action-btn--primary"
                            onClick={() => handleOpenWeighing(task)}
                          >
                            Weigh on Scale &amp; Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 3: COMPLETED PICKUPS */}
          {activeCategory === 'completed' && (
            <div className="sv-portal-card">
              <div className="sv-portal-card-header">
                <div>
                  <h3 className="sv-portal-card-title">Completed Collections</h3>
                  <p className="sv-portal-card-subtitle">Verified weights, digital receipts, and client payouts</p>
                </div>
              </div>

              {completedTasks.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  No completed pickups yet today.
                </div>
              ) : (
                <div className="sv-table-wrap">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Pickup ID</th>
                        <th>Customer</th>
                        <th>Location</th>
                        <th>Scrap Items</th>
                        <th>Weighed (kg)</th>
                        <th>Client Payout</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTasks.map((t) => (
                        <tr key={t.id}>
                          <td><strong>{t.id}</strong></td>
                          <td>
                            <strong>{t.customerName}</strong>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>{t.phone || t.customerPhone}</div>
                          </td>
                          <td style={{ maxWidth: '180px', fontSize: '12.5px' }}>{t.address}</td>
                          <td>{getTaskItems(t).join(', ')}</td>
                          <td><strong>{t.finalWeight || t.collectedWeight || t.estimatedWeight}</strong></td>
                          <td><strong style={{ color: '#059669' }}>৳ {t.payout || t.cashPaid ? String(t.payout || t.cashPaid).replace(/[^0-9]/g, '') : '450'}</strong></td>
                          <td>
                            <span className="sv-badge sv-badge--success">Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 4: DIGITAL SCALE WEIGHING */}
          {activeCategory === 'weighing' && (
            <div className="sv-portal-card">
              <div className="sv-portal-card-header">
                <div>
                  <h3 className="sv-portal-card-title">Digital Scale Weighing Tool</h3>
                  <p className="sv-portal-card-subtitle">Bluetooth &amp; Manual Digital Scale integration for fair pricing</p>
                </div>
              </div>

              <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '24px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="M7 21h10" />
                    <path d="M12 3v18" />
                    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Calibrated Digital Weight Scale Active
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
                  Ensure the scale is set on a flat surface. Record the exact weight in front of the customer to build trust and issue an instant digital receipt.
                </p>

                <button
                  type="button"
                  className="sv-portal-quick-btn"
                  style={{ padding: '12px 28px', fontSize: '15px' }}
                  onClick={() => handleOpenWeighing(pendingTasks[0] || null)}
                >
                  Open Weighing Confirmation Modal
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 5: EARNINGS & PAYOUTS */}
          {activeCategory === 'earnings' && (
            <div className="sv-portal-card">
              <div className="sv-portal-card-header">
                <div>
                  <h3 className="sv-portal-card-title">Earnings &amp; Payout Statement</h3>
                  <p className="sv-portal-card-subtitle">Collection partner daily commissions, tips, and bKash settlements</p>
                </div>
                <button type="button" className="sv-portal-quick-btn">
                  Withdraw to bKash / Nagad
                </button>
              </div>

              <div className="sv-portal-stats-grid" style={{ marginBottom: '24px' }}>
                <div className="sv-portal-stat-card">
                  <div className="sv-portal-stat-info">
                    <span className="sv-portal-stat-label">Available Balance</span>
                    <span className="sv-portal-stat-value" style={{ color: '#059669' }}>৳ 1,850</span>
                  </div>
                </div>
                <div className="sv-portal-stat-card">
                  <div className="sv-portal-stat-info">
                    <span className="sv-portal-stat-label">This Week&apos;s Commission</span>
                    <span className="sv-portal-stat-value">৳ 6,420</span>
                  </div>
                </div>
                <div className="sv-portal-stat-card">
                  <div className="sv-portal-stat-info">
                    <span className="sv-portal-stat-label">Per kg Bonus Rate</span>
                    <span className="sv-portal-stat-value">৳ 5.00 / kg</span>
                  </div>
                </div>
                <div className="sv-portal-stat-card">
                  <div className="sv-portal-stat-info">
                    <span className="sv-portal-stat-label">Rating &amp; Reliability</span>
                    <span className="sv-portal-stat-value">⭐ 4.95 / 5</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= DIGITAL WEIGHING MODAL ================= */}
      {weighingModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={handleCloseWeighing}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '30px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Digital Scale Confirmation / ওজন নিশ্চিতকরণ
              </h3>
              <button
                type="button"
                onClick={handleCloseWeighing}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}
              >
                &times;
              </button>
            </div>

            {weighingModal.task && (
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', marginBottom: '18px', fontSize: '13px' }}>
                <div><strong>Customer / কাস্টমার:</strong> {weighingModal.task.customerName}</div>
                <div><strong>Address / ঠিকানা:</strong> {weighingModal.task.address}</div>
                <div><strong>Items / আইটেম:</strong> {getTaskItems(weighingModal.task).join(', ')}</div>
              </div>
            )}

            <form onSubmit={handleSubmitWeighing}>
              <div className="sv-form-group">
                <label className="sv-form-label">
                  Actual Scale Weight (kg) / স্কেলে মাপা ওজন (কেজি) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="sv-input"
                  placeholder="e.g. 28.5"
                  value={weighingModal.weight}
                  onChange={(e) => setWeighingModal({ ...weighingModal, weight: e.target.value })}
                  required
                />
              </div>

              <div className="sv-form-group">
                <label className="sv-form-label">
                  Client Cash / Digital Payout (৳) / কাস্টমারকে পরিশোধকৃত টাকা <span className="req">*</span>
                </label>
                <input
                  type="number"
                  className="sv-input"
                  placeholder="e.g. 620"
                  value={weighingModal.payout}
                  onChange={(e) => setWeighingModal({ ...weighingModal, payout: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  onClick={handleCloseWeighing}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel (বাতিল)
                </button>
                <button
                  type="submit"
                  className="sv-portal-quick-btn"
                  style={{ flex: 1, justifyContent: 'center', borderRadius: '12px' }}
                >
                  Confirm &amp; Complete (সম্পন্ন)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
