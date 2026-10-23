import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../components/admin/admin.css';
import './collector-dashboard.css';
import {
  DashboardIcon,
  OrdersIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
  ExternalLinkIcon,
  ScrapPickupIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  ScaleIcon,
  TruckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SearchIcon,
  FileTextIcon,
  DownloadIcon,
  ClipboardIcon,
  BellIcon,
} from '../../components/admin/AdminIcons.jsx';

export default function CollectorDashboard() {
  const {
    currentUser,
    collectorPickups = [],
    updateCollectorTask,
    reportCollectorIssue,
    updateUserSettings,
    changePassword,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Role-Based Authorization Guard
  useEffect(() => {
    if (!currentUser) {
      navigate('/collector/login', { replace: true });
      return;
    }
    if (currentUser.role === 'user') {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (currentUser.role !== 'collector') {
      navigate('/collector/login', { replace: true });
      return;
    }
  }, [currentUser, navigate]);

  // Determine active tab based on URL path or query params
  const getInitialTab = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'orders', 'settings'].includes(tabParam)) {
      return tabParam;
    }
    if (location.pathname.includes('/orders')) return 'orders';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Sync state when URL changes
  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
  }, [location.pathname, searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    setSearchParams({ tab });
  };

  /* -------------------------------------------------------------------------
     IN-APP NOTIFICATIONS FOR COLLECTOR
  ------------------------------------------------------------------------- */
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_collector_notifications');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'NOTIF-INIT-1',
          pickupId: 'TASK-501',
          title: 'Morning Route Assigned',
          message: 'You have 3 scheduled stops in Banani and Uttara today.',
          createdAt: '08:30 AM',
          read: false,
        },
      ];
    } catch {
      return [];
    }
  });

  // Reload notifications on sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('sv_collector_notifications');
        if (saved) setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('sv_pickups_sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('sv_pickups_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleMarkAllNotifsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem('sv_collector_notifications', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotificationClick = (notif) => {
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem('sv_collector_notifications', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setNotifDropdownOpen(false);
    handleTabChange('orders');
  };

  /* -------------------------------------------------------------------------
     DATA FILTERING: ONLY ASSIGNMENTS AUTHORIZED FOR LOGGED-IN COLLECTOR
  ------------------------------------------------------------------------- */
  const authorizedPickups = useMemo(() => {
    if (!currentUser) return [];

    const cId = (currentUser.id || '').toLowerCase();
    const cBadge = (currentUser.badgeId || '').toLowerCase();
    const cName = (currentUser.name || '').toLowerCase();
    const cPhone = (currentUser.phone || '').replace(/[\s-]/g, '');

    return collectorPickups.filter((p) => {
      if (p.collectorId && (p.collectorId.toLowerCase() === cId || p.collectorId.toLowerCase() === cBadge)) {
        return true;
      }
      if (p.collectorPhone) {
        const cleanColPhone = p.collectorPhone.replace(/[\s-]/g, '');
        if (cleanColPhone === cPhone) return true;
      }
      const colStr = (p.collector || p.collectorName || '').toLowerCase();
      if (colStr) {
        if (colStr.includes(cName)) return true;
        if (cBadge && colStr.includes(cBadge)) return true;
        if (cId && colStr.includes(cId)) return true;
      }
      if (cId === 'col-104' || cName.includes('rafiqul')) {
        if (
          !p.collectorId &&
          !p.collector &&
          !p.collectorName &&
          ['TASK-501', 'TASK-502', 'TASK-498', 'PKP-9011', 'PKP-8842'].includes(p.id)
        ) {
          return true;
        }
      }
      return false;
    });
  }, [collectorPickups, currentUser]);

  /* -------------------------------------------------------------------------
     KEY STATUS SUBSETS & OVERVIEW METRICS
  ------------------------------------------------------------------------- */
  const completedPickups = useMemo(() => {
    return authorizedPickups.filter((p) => p.status === 'Completed');
  }, [authorizedPickups]);

  const activePendingPickups = useMemo(() => {
    return authorizedPickups.filter(
      (p) => p.status !== 'Completed' && p.status !== 'Cancelled' && p.status !== 'Issue Reported'
    );
  }, [authorizedPickups]);

  const newAssignedPickups = useMemo(() => {
    return authorizedPickups.filter((p) => p.status === 'Assigned');
  }, [authorizedPickups]);

  const inProgressPickups = useMemo(() => {
    return authorizedPickups.filter(
      (p) => p.status === 'In Progress' || p.status === 'En Route' || p.status === 'In Transit'
    );
  }, [authorizedPickups]);

  const todayPickups = useMemo(() => {
    return authorizedPickups.filter((p) => {
      const dateStr = (p.scheduledDate || p.scheduledTime || p.timeSlot || '').toLowerCase();
      return dateStr.includes('today') || dateStr.includes('14 oct');
    });
  }, [authorizedPickups]);

  // Metric 1: Completed Pickups Count
  const pickupsCompletedCount = completedPickups.length;

  // Metric 2: Total Weight Collected (numeric parsing in kg)
  const totalWeightKg = useMemo(() => {
    return completedPickups.reduce((sum, p) => {
      const weightVal = p.actualWeight || p.collectedWeight || p.finalWeight || p.estimatedWeight || '0';
      const parsed = parseFloat(String(weightVal).replace(/[^0-9.]/g, '')) || 0;
      return sum + parsed;
    }, 0);
  }, [completedPickups]);

  const formattedTotalWeight = useMemo(() => {
    const baseWeight = currentUser?.totalWeightCollected || 0;
    const combinedWeight = baseWeight + totalWeightKg;
    if (combinedWeight >= 1000) {
      return `${combinedWeight.toLocaleString()} kg (${(combinedWeight / 1000).toFixed(2)} Tons)`;
    }
    return `${combinedWeight.toFixed(1)} kg`;
  }, [totalWeightKg, currentUser]);

  // Metric 3: Total Earnings
  const totalEarningsDisplay = useMemo(() => {
    const baseEarnings = currentUser?.totalEarnings || 42500;
    const sessionEarnings = completedPickups.reduce((sum, p) => {
      if (p.collectorEarnings) return sum + Number(p.collectorEarnings);
      const weightVal = p.actualWeight || p.collectedWeight || '0';
      const kg = parseFloat(String(weightVal).replace(/[^0-9.]/g, '')) || 0;
      return sum + Math.round(kg * 5);
    }, 0);
    return `৳ ${(baseEarnings + sessionEarnings).toLocaleString()}`;
  }, [completedPickups, currentUser]);

  // Metric 4: Pending House Visits
  const pendingVisitsCount = activePendingPickups.length;

  /* -------------------------------------------------------------------------
     ORDERS VIEW FILTERS & SEARCH
  ------------------------------------------------------------------------- */
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return authorizedPickups.filter((p) => {
      if (orderStatusFilter !== 'all') {
        const s = (p.status || '').toLowerCase();
        if (orderStatusFilter === 'assigned' && s !== 'assigned') return false;
        if (orderStatusFilter === 'pending' && s !== 'pending' && s !== 'assigned') return false;
        if (orderStatusFilter === 'in_progress' && s !== 'in progress' && s !== 'en route' && s !== 'in transit') return false;
        if (orderStatusFilter === 'completed' && s !== 'completed') return false;
        if (orderStatusFilter === 'issue' && s !== 'issue reported') return false;
      }
      if (orderDateFilter === 'today') {
        const d = (p.scheduledDate || p.scheduledTime || p.timeSlot || '').toLowerCase();
        if (!d.includes('today') && !d.includes('14 oct')) return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = (p.id || '').toLowerCase().includes(q);
        const matchName = (p.customerName || p.customer || '').toLowerCase().includes(q);
        const matchPhone = (p.phone || p.customerPhone || '').toLowerCase().includes(q);
        const matchAddress = (p.address || '').toLowerCase().includes(q);
        const matchMaterials = Array.isArray(p.materials || p.scrapItems || p.items) &&
          (p.materials || p.scrapItems || p.items).some((m) => String(m).toLowerCase().includes(q));
        if (!matchId && !matchName && !matchPhone && !matchAddress && !matchMaterials) return false;
      }
      return true;
    });
  }, [authorizedPickups, orderStatusFilter, orderDateFilter, orderSearchQuery]);

  const handleFilterPillClick = (filterKey) => {
    setOrderStatusFilter(filterKey);
    handleTabChange('orders');
  };

  /* -------------------------------------------------------------------------
     DIGITAL SCALE WEIGHING MODAL
  ------------------------------------------------------------------------- */
  const [weighingModal, setWeighingModal] = useState({
    isOpen: false,
    pickup: null,
    actualWeight: '',
    clientPayout: '',
    notes: '',
    error: '',
    success: false,
  });

  const handleOpenWeighingModal = (pickup) => {
    const estNum = pickup?.estimatedWeight
      ? String(pickup.estimatedWeight).replace(/[^0-9.]/g, '')
      : '25';
    const estPayout = pickup?.payout || pickup?.estPayout
      ? String(pickup.payout || pickup.estPayout).replace(/[^0-9]/g, '')
      : '550';

    setWeighingModal({
      isOpen: true,
      pickup: pickup || activePendingPickups[0] || null,
      actualWeight: estNum,
      clientPayout: estPayout,
      notes: 'Verified scale weight on site.',
      error: '',
      success: false,
    });
  };

  const handleCloseWeighingModal = () => {
    setWeighingModal({
      isOpen: false,
      pickup: null,
      actualWeight: '',
      clientPayout: '',
      notes: '',
      error: '',
      success: false,
    });
  };

  const handleSubmitWeighing = (e) => {
    e.preventDefault();
    if (!weighingModal.pickup) {
      setWeighingModal((prev) => ({ ...prev, error: 'Please select a valid pickup.' }));
      return;
    }
    const weightNum = parseFloat(weighingModal.actualWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setWeighingModal((prev) => ({ ...prev, error: 'Actual scale weight must be greater than 0 kg.' }));
      return;
    }

    updateCollectorTask(
      weighingModal.pickup.id,
      'Completed',
      weightNum,
      weighingModal.clientPayout,
      weighingModal.notes
    );

    setWeighingModal((prev) => ({ ...prev, success: true }));
    setTimeout(() => {
      handleCloseWeighingModal();
    }, 1200);
  };

  /* -------------------------------------------------------------------------
     REPORT ISSUE MODAL
  ------------------------------------------------------------------------- */
  const [issueModal, setIssueModal] = useState({
    isOpen: false,
    pickup: null,
    category: 'Customer Not Available / Door Locked',
    note: '',
    submitted: false,
  });

  const handleOpenIssueModal = (pickup) => {
    setIssueModal({
      isOpen: true,
      pickup,
      category: 'Customer Not Available / Door Locked',
      note: '',
      submitted: false,
    });
  };

  const handleCloseIssueModal = () => {
    setIssueModal({
      isOpen: false,
      pickup: null,
      category: 'Customer Not Available / Door Locked',
      note: '',
      submitted: false,
    });
  };

  const handleSubmitIssue = (e) => {
    e.preventDefault();
    if (!issueModal.pickup) return;
    reportCollectorIssue(issueModal.pickup.id, issueModal.category, issueModal.note);
    setIssueModal((prev) => ({ ...prev, submitted: true }));
    setTimeout(() => {
      handleCloseIssueModal();
    }, 1200);
  };

  /* -------------------------------------------------------------------------
     RECEIPT INSPECTION MODAL
  ------------------------------------------------------------------------- */
  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    pickup: null,
  });

  /* -------------------------------------------------------------------------
     SETTINGS STATE
  ------------------------------------------------------------------------- */
  const [profileForm, setProfileForm] = useState({
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || '',
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserSettings({
      phone: profileForm.phone,
      email: profileForm.email,
      avatar: profileForm.avatar,
    });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPasswordFeedback({ type: '', text: '' });
    if (!passwordForm.currentPass || !passwordForm.newPass) {
      setPasswordFeedback({ type: 'error', text: 'Please complete all password fields.' });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordFeedback({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordFeedback({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    changePassword(passwordForm.currentPass, passwordForm.newPass);
    setPasswordFeedback({ type: 'success', text: 'Password updated successfully!' });
    setPasswordForm({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPasswordFeedback({ type: '', text: '' }), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper for materials list display
  const getScrapItemsList = (task) => {
    if (!task) return ['Mixed Scrap'];
    if (Array.isArray(task.scrapItems) && task.scrapItems.length) return task.scrapItems;
    if (Array.isArray(task.materials) && task.materials.length) return task.materials;
    if (Array.isArray(task.items) && task.items.length) return task.items;
    return ['Mixed Scrap Recyclables'];
  };

  // Export Completed Pickups CSV
  const exportCompletedCSV = useCallback(() => {
    if (!completedPickups.length) return;
    const headers = ['Pickup ID', 'Customer Name', 'Phone', 'Address', 'Materials', 'Estimated Weight', 'Actual Weighed (kg)', 'Client Payout (BDT)', 'Completion Date'];
    const rows = completedPickups.map((p) => [
      p.id,
      `"${p.customerName || p.customer || ''}"`,
      p.phone || p.customerPhone || '',
      `"${p.address || ''}"`,
      `"${getScrapItemsList(p).join('; ')}"`,
      p.estimatedWeight || '',
      p.actualWeight || p.collectedWeight || '',
      p.cashPaid || p.payout || '',
      p.completedAt || p.scheduledDate || 'Completed'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ScrapVenture_Collector_Pickups_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [completedPickups]);

  if (!currentUser) return null;

  return (
    <div className="sv-admin-layout sv-collector-dashboard">
      {/* Mobile Backdrop */}
      <div
        className={`sv-sidebar-backdrop ${mobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ================= LEFT SIDEBAR (ADMIN PANEL GREEN DESIGN) ================= */}
      <aside
        className={`sv-admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        aria-label="Collector Navigation"
      >
        {/* Brand Header */}
        <div className="sv-sidebar-brand-header">
          <Link
            to="/collector/dashboard"
            className="sv-sidebar-brand-link"
            title="Scrap Venture Collector Panel"
            onClick={() => handleTabChange('dashboard')}
          >
            <img
              src="/assets/images/logo.png"
              alt="Scrap Venture"
              className="sv-sidebar-brand-logo-img"
            />
            <div className="sv-sidebar-brand-meta">
              <span className="sv-sidebar-brand-title">Collector Panel</span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="sv-sidebar-mobile-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close mobile sidebar"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Collector Profile Card inside Green Sidebar */}
        <div className="sv-collector-sidebar-card">
          <div className="sv-collector-sidebar-avatar">
            {profileForm.avatar || currentUser.avatar ? (
              <img src={profileForm.avatar || currentUser.avatar} alt={currentUser.name} />
            ) : (
              currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'
            )}
          </div>
          <div className="sv-collector-sidebar-meta">
            <span className="sv-collector-sidebar-name" title={currentUser.name}>
              {currentUser.name || 'Field Collector'}
            </span>
            <span className="sv-collector-sidebar-badge">
              {currentUser.badgeId || currentUser.id || 'COL-104'} &bull; Active
            </span>
          </div>
        </div>

        {/* EXACT 4 NAVIGATION ITEMS */}
        <nav className="sv-sidebar-nav-container" aria-label="Collector Nav">
          <ul className="sv-sidebar-nav-list" role="menu">
            {/* 1. Dashboard */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabChange('dashboard')}
                role="menuitem"
                title="Dashboard Overview"
              >
                <span className="sv-sidebar-item-icon">
                  <DashboardIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Dashboard</span>
              </button>
            </li>

            {/* 2. Orders */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => handleTabChange('orders')}
                role="menuitem"
                title="Pickup Orders"
              >
                <span className="sv-sidebar-item-icon">
                  <OrdersIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Orders</span>
                {activePendingPickups.length > 0 && (
                  <span className="sv-sidebar-nav-pill">{activePendingPickups.length}</span>
                )}
              </button>
            </li>

            {/* 3. Settings */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleTabChange('settings')}
                role="menuitem"
                title="Account Settings"
              >
                <span className="sv-sidebar-item-icon">
                  <SettingsIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Subtle Divider */}
        <div className="sv-sidebar-divider" role="separator" />

        {/* Bottom Section: Back to Website & Logout */}
        <div className="sv-sidebar-footer">
          <Link
            to="/"
            className="sv-sidebar-item-link"
            title="Back to Public Website"
          >
            <span className="sv-sidebar-item-icon">
              <ExternalLinkIcon size={18} />
            </span>
            <span className="sv-sidebar-item-label">Back to Website</span>
          </Link>

          {/* 4. Logout Action */}
          <button
            type="button"
            className="sv-sidebar-item-btn logout-btn"
            onClick={handleLogout}
            title="Logout securely"
          >
            <span className="sv-sidebar-item-icon">
              <LogoutIcon size={19} />
            </span>
            <span className="sv-sidebar-item-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="sv-admin-main-wrapper">
        {/* Top Header matching Admin Panel (Duty Status Indicator Removed) */}
        <header className="sv-admin-header">
          {/* Left: Mobile hamburger + Breadcrumbs */}
          <div className="sv-header-left">
            <button
              type="button"
              className="sv-mobile-menu-trigger"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <MenuIcon size={20} />
            </button>

            <nav aria-label="Breadcrumb" className="sv-header-breadcrumbs">
              <span className="sv-breadcrumb-root">Collector Portal</span>
              <span className="sv-breadcrumb-separator">/</span>
              <span className="sv-breadcrumb-current">
                {activeTab === 'orders'
                  ? 'Pickup Orders Management'
                  : activeTab === 'settings'
                  ? 'Collector Profile & Settings'
                  : 'Dashboard Overview'}
              </span>
            </nav>
          </div>

          {/* Right: Notification Bell & Record Scale Weight button */}
          <div className="sv-header-right">
            {/* Notification Bell Dropdown */}
            <div className="sv-notif-container">
              <button
                type="button"
                className="sv-notif-bell-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                aria-label="Notifications"
                title="Assignment Notifications"
              >
                <BellIcon size={18} />
                {unreadNotifCount > 0 && (
                  <span className="sv-notif-count-badge">{unreadNotifCount}</span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="sv-notif-dropdown">
                  <div className="sv-notif-dropdown-header">
                    <h4>Assignment Notifications</h4>
                    {unreadNotifCount > 0 && (
                      <button
                        type="button"
                        className="sv-notif-clear-btn"
                        onClick={handleMarkAllNotifsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="sv-notif-list">
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`sv-notif-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <div className="sv-notif-item-title">
                            <span>{n.title}</span>
                            {!n.read && (
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#269C26' }} />
                            )}
                          </div>
                          <div className="sv-notif-item-msg">{n.message}</div>
                          <div className="sv-notif-item-time">{n.createdAt || 'Today'}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Record Scale Weight Action Button */}
            <button
              type="button"
              className="sv-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}
              onClick={() => handleOpenWeighingModal(activePendingPickups[0] || null)}
            >
              <ScaleIcon size={16} />
              <span>+ Record Scale Weight</span>
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="sv-admin-page-content">
          {/* =========================================================================
             SECTION: DASHBOARD OVERVIEW (TAB 1)
             ========================================================================= */}
          {activeTab === 'dashboard' && (
            <>
              {/* Partner Banner with Active Route details */}
              <div className="sv-collector-welcome-banner">
                <div>
                  <h2>Today&apos;s Collection Route: {currentUser?.zone || 'Dhaka North (Banani, Gulshan, Uttara)'}</h2>
                  <p>
                    Vehicle: <strong>{currentUser?.vehicle || 'Motorized Van (ঢাকা মেট্রো-হ ১১-২২৩৩)'}</strong> &bull; Scheduled Stops:{' '}
                    <strong>{activePendingPickups.length} houses remaining</strong>
                  </p>
                </div>
                <button
                  type="button"
                  className="sv-banner-white-btn"
                  onClick={() => handleTabChange('orders')}
                >
                  <span>View All Assigned Orders ({authorizedPickups.length}) &rarr;</span>
                </button>
              </div>

              {/* 4 Standardized Metric Cards (Clickable) */}
              <div className="sv-stats-grid" style={{ marginBottom: '18px' }}>
                {/* Card 1: Pickups Completed */}
                <div
                  className="sv-stat-card"
                  onClick={() => handleFilterPillClick('completed')}
                  style={{ cursor: 'pointer' }}
                  title="Click to view Completed Orders"
                >
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Pickups Completed</span>
                    <div className="sv-stat-icon-wrap green">
                      <ScrapPickupIcon size={18} />
                    </div>
                  </div>
                  <div className="sv-stat-value">{pickupsCompletedCount} Verified</div>
                  <div className="sv-stat-change" style={{ color: '#16a34a' }}>
                    + {pickupsCompletedCount} collections finalized
                  </div>
                </div>

                {/* Card 2: Total Weight Collected */}
                <div
                  className="sv-stat-card"
                  onClick={() => handleFilterPillClick('completed')}
                  style={{ cursor: 'pointer' }}
                  title="Click to view Weighed Collections"
                >
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Total Weight Collected</span>
                    <div className="sv-stat-icon-wrap blue">
                      <ScaleIcon size={18} />
                    </div>
                  </div>
                  <div className="sv-stat-value">{formattedTotalWeight}</div>
                  <div className="sv-stat-change">Calibrated digital scales</div>
                </div>

                {/* Card 3: Total Earnings */}
                <div
                  className="sv-stat-card"
                  style={{ cursor: 'default' }}
                  title="Recorded Collector Earnings"
                >
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Total Earnings</span>
                    <div className="sv-stat-icon-wrap green">
                      <span style={{ fontWeight: 800, fontSize: '15px' }}>৳</span>
                    </div>
                  </div>
                  <div className="sv-stat-value" style={{ color: '#15803d' }}>
                    {totalEarningsDisplay}
                  </div>
                  <div className="sv-stat-change">Includes per-kg collection bonus</div>
                </div>

                {/* Card 4: Pending House Visits */}
                <div
                  className="sv-stat-card"
                  onClick={() => handleFilterPillClick('pending')}
                  style={{ cursor: 'pointer' }}
                  title="Click to view Pending Orders"
                >
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Pending House Visits</span>
                    <div className="sv-stat-icon-wrap orange">
                      <OrdersIcon size={18} />
                    </div>
                  </div>
                  <div className="sv-stat-value">{pendingVisitsCount} Stops</div>
                  <div className="sv-stat-change" style={{ color: '#ea580c' }}>
                    Requires doorstep collection
                  </div>
                </div>
              </div>

              {/* Compact Job-Status Summary Pills */}
              <div className="sv-job-status-summary-bar">
                <div
                  className="sv-job-status-pill"
                  onClick={() => handleFilterPillClick('assigned')}
                  title="View New Assignments"
                >
                  <div className="sv-job-status-pill-info">
                    <span className="sv-job-status-pill-label">New Assignments</span>
                    <span className="sv-job-status-pill-count">{newAssignedPickups.length}</span>
                  </div>
                  <div className="sv-job-status-pill-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <ClipboardIcon size={16} />
                  </div>
                </div>

                <div
                  className="sv-job-status-pill"
                  onClick={() => handleFilterPillClick('pending')}
                  title="View Pending Pickups"
                >
                  <div className="sv-job-status-pill-info">
                    <span className="sv-job-status-pill-label">Pending Pickups</span>
                    <span className="sv-job-status-pill-count">{activePendingPickups.length}</span>
                  </div>
                  <div className="sv-job-status-pill-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                    <ClockIcon size={16} />
                  </div>
                </div>

                <div
                  className="sv-job-status-pill"
                  onClick={() => handleFilterPillClick('in_progress')}
                  title="View In-Progress Trips"
                >
                  <div className="sv-job-status-pill-info">
                    <span className="sv-job-status-pill-label">In Progress</span>
                    <span className="sv-job-status-pill-count">{inProgressPickups.length}</span>
                  </div>
                  <div className="sv-job-status-pill-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                    <TruckIcon size={16} />
                  </div>
                </div>

                <div
                  className="sv-job-status-pill"
                  onClick={() => handleFilterPillClick('completed')}
                  title="View Completed Collections"
                >
                  <div className="sv-job-status-pill-info">
                    <span className="sv-job-status-pill-label">Completed Pickups</span>
                    <span className="sv-job-status-pill-count">{completedPickups.length}</span>
                  </div>
                  <div className="sv-job-status-pill-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                    <CheckCircleIcon size={16} />
                  </div>
                </div>

                <div
                  className="sv-job-status-pill"
                  onClick={() => {
                    setOrderDateFilter('today');
                    handleTabChange('orders');
                  }}
                  title="View Today's Scheduled Pickups"
                >
                  <div className="sv-job-status-pill-info">
                    <span className="sv-job-status-pill-label">Today&apos;s Pickups</span>
                    <span className="sv-job-status-pill-count">{todayPickups.length}</span>
                  </div>
                  <div className="sv-job-status-pill-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                    <CalendarIcon size={16} />
                  </div>
                </div>
              </div>

              {/* Active Collection Route Section */}
              <div className="sv-card" style={{ marginBottom: '22px' }}>
                <div className="sv-card-header">
                  <div>
                    <div className="sv-card-title">Active Collection Route — Scheduled Stops</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      Doorstep recyclable collections assigned to you in order of priority
                    </div>
                  </div>
                  <span className="sv-badge blue">
                    {activePendingPickups.length} Stops Active
                  </span>
                </div>

                {activePendingPickups.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ marginBottom: '10px', color: '#16a34a', display: 'flex', justifyContent: 'center' }}>
                      <CheckCircleIcon size={36} />
                    </div>
                    <p style={{ fontSize: '15.5px', fontWeight: 700, color: '#16a34a', margin: '0 0 4px' }}>
                      All assigned stops completed for today!
                    </p>
                    <p style={{ fontSize: '13px', margin: 0 }}>
                      New customer requests assigned by the administrator will automatically appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: '16px' }}>
                    {activePendingPickups.map((task, idx) => (
                      <div key={task.id} className="sv-route-stop-card">
                        <div className="sv-route-stop-left">
                          <div className="sv-stop-number-badge">#{idx + 1}</div>
                          <div className="sv-route-stop-info">
                            <h4>
                              {task.customerName || task.customer} &bull;{' '}
                              <span style={{ color: '#269C26', fontSize: '13px' }}>{task.id}</span>
                            </h4>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <MapPinIcon size={13} />
                              <span><strong>Address:</strong> {task.address}</span>
                            </p>
                            <p style={{ marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <ClockIcon size={12} />
                                <span>{task.scheduledTime || task.timeSlot || 'Scheduled Today'}</span>
                              </span>
                              <span>&bull;</span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <ScaleIcon size={12} />
                                <span>Est: {task.estimatedWeight || task.weight}</span>
                              </span>
                            </p>
                            <div className="sv-material-tags-row">
                              {getScrapItemsList(task).map((m, i) => (
                                <span key={i} className="sv-material-tag">{m}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {/* Call Customer Button */}
                          <a
                            href={`tel:${task.phone || task.customerPhone || '01700-000000'}`}
                            className="sv-btn-action-sm sv-btn-call"
                          >
                            <PhoneIcon size={13} />
                            <span>Call</span>
                          </a>

                          {/* Open in Google Maps */}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address || 'Dhaka')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sv-btn-action-sm sv-btn-map"
                          >
                            <MapPinIcon size={13} />
                            <span>Open Maps</span>
                          </a>

                          {/* Status Progression Action */}
                          {task.status !== 'In Progress' && task.status !== 'En Route' ? (
                            <button
                              type="button"
                              className="sv-btn-primary sv-btn-action-sm"
                              onClick={() => updateCollectorTask(task.id, 'In Progress')}
                            >
                              <TruckIcon size={13} />
                              <span>Start Pickup</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="sv-btn-primary sv-btn-action-sm"
                              onClick={() => handleOpenWeighingModal(task)}
                            >
                              <ScaleIcon size={13} />
                              <span>Record Scale Weight</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Completed Pickups Preview */}
              <div className="sv-card">
                <div className="sv-card-header">
                  <div className="sv-card-title">Recent Completed Collections</div>
                  <button
                    type="button"
                    className="sv-filter-pill-btn"
                    onClick={() => handleFilterPillClick('completed')}
                  >
                    <span>View All ({completedPickups.length})</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                {completedPickups.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No collections completed yet.
                  </div>
                ) : (
                  <div className="sv-table-container" style={{ border: 'none' }}>
                    <table className="sv-table">
                      <thead>
                        <tr>
                          <th>Pickup ID</th>
                          <th>Customer</th>
                          <th>Address</th>
                          <th>Materials</th>
                          <th>Weighed (kg)</th>
                          <th>Client Payout</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedPickups.slice(0, 4).map((c) => (
                          <tr key={c.id}>
                            <td><strong>{c.id}</strong></td>
                            <td>
                              <strong>{c.customerName || c.customer}</strong>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{c.phone || c.customerPhone}</div>
                            </td>
                            <td style={{ maxWidth: '200px', fontSize: '12px' }}>{c.address}</td>
                            <td>{getScrapItemsList(c).join(', ')}</td>
                            <td><strong style={{ color: '#0f172a' }}>{c.actualWeight || c.collectedWeight || c.finalWeight}</strong></td>
                            <td><strong style={{ color: '#16a34a' }}>{c.cashPaid || c.payout || '৳ 550'}</strong></td>
                            <td><span className="sv-badge green">Completed</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* =========================================================================
             SECTION: ORDERS PAGE — COMPLETE PICKUP MANAGEMENT (FULL-WIDTH ROWS)
             ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="sv-card">
              <div className="sv-card-header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h1 className="sv-card-title" style={{ fontSize: '18px' }}>Pickup Orders &amp; Field Collections</h1>
                  <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748b' }}>
                    Manage authorized doorstep recyclable collections, verify weights, and update job progress.
                  </p>
                </div>
                {completedPickups.length > 0 && (
                  <button
                    type="button"
                    className="sv-btn-secondary"
                    style={{ fontSize: '12.5px', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={exportCompletedCSV}
                    title="Export completed pickups as CSV"
                  >
                    <DownloadIcon size={14} />
                    <span>Export Completed (CSV)</span>
                  </button>
                )}
              </div>

              {/* Search and Filters Bar */}
              <div style={{ padding: '0 20px 16px' }}>
                <div className="sv-orders-filter-bar">
                  {/* Status Pills */}
                  <div className="sv-status-pill-group">
                    {[
                      { key: 'all', label: 'All Jobs' },
                      { key: 'assigned', label: `Assigned (${newAssignedPickups.length})` },
                      { key: 'in_progress', label: `In Progress (${inProgressPickups.length})` },
                      { key: 'completed', label: `Completed (${completedPickups.length})` },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        className={`sv-filter-pill-btn ${orderStatusFilter === f.key ? 'active' : ''}`}
                        onClick={() => setOrderStatusFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input, Date Filter, and Reset */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div className="sv-search-box" style={{ maxWidth: '240px' }}>
                      <input
                        type="text"
                        placeholder="Search ID, customer, address..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      className={`sv-filter-pill-btn ${orderDateFilter === 'today' ? 'active' : ''}`}
                      onClick={() => setOrderDateFilter(orderDateFilter === 'today' ? 'all' : 'today')}
                    >
                      <CalendarIcon size={13} />
                      <span>Today Only</span>
                    </button>

                    {(orderStatusFilter !== 'all' || orderDateFilter !== 'all' || orderSearchQuery) && (
                      <button
                        type="button"
                        className="sv-filter-pill-btn"
                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                        onClick={() => {
                          setOrderStatusFilter('all');
                          setOrderDateFilter('all');
                          setOrderSearchQuery('');
                        }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtered Pickup Orders: Full-Width Row-Wise List */}
                {filteredOrders.length === 0 ? (
                  <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ marginBottom: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'center' }}>
                      <SearchIcon size={36} />
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                      No pickup orders found
                    </p>
                    <p style={{ fontSize: '13px', margin: 0 }}>
                      Try adjusting your status or search filters to find assigned pickup jobs.
                    </p>
                  </div>
                ) : (
                  <div className="sv-collector-orders-list">
                    {filteredOrders.map((p) => {
                      const isCompleted = p.status === 'Completed';
                      const isInProgress = p.status === 'In Progress' || p.status === 'En Route' || p.status === 'In Transit';
                      const isAssigned = p.status === 'Assigned' || p.status === 'Pending';
                      const isIssue = p.status === 'Issue Reported';

                      return (
                        <div key={p.id} className="sv-collector-order-row">
                          {/* Section 1: Order identification */}
                          <div className="sv-order-col-ident">
                            <div className="sv-order-id-label">{p.id}</div>
                            <div className="sv-order-cust-name">{p.customerName || p.customer}</div>
                            <div className="sv-order-cust-phone">
                              <PhoneIcon size={12} />
                              <span>{p.phone || p.customerPhone || 'Phone unlisted'}</span>
                            </div>
                          </div>

                          {/* Section 2: Pickup details */}
                          <div className="sv-order-col-pickup">
                            <div className="sv-order-detail-line" title={p.address}>
                              <MapPinIcon size={13} style={{ flexShrink: 0, marginTop: '2px', color: '#64748b' }} />
                              <span className="sv-order-address-text">{p.address}</span>
                            </div>
                            <div className="sv-order-detail-subline">
                              <span className="sv-order-detail-chip">
                                <ClockIcon size={12} style={{ color: '#64748b' }} />
                                <span>{p.scheduledTime || p.timeSlot || 'Scheduled Today'}</span>
                              </span>
                              <span className="sv-order-detail-chip">
                                <ScaleIcon size={12} style={{ color: '#64748b' }} />
                                <span>
                                  {p.actualWeight ? (
                                    <strong style={{ color: '#16a34a' }}>{p.actualWeight}</strong>
                                  ) : (
                                    `Est: ${p.estimatedWeight || p.weight || '25 kg'}`
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Section 3: Materials & instructions */}
                          <div className="sv-order-col-materials">
                            <div className="sv-material-tags-row">
                              {getScrapItemsList(p).map((mat, i) => (
                                <span key={i} className="sv-material-tag">{mat}</span>
                              ))}
                            </div>
                            {p.notes && (
                              <div className="sv-order-notes-chip" title={p.notes}>
                                <FileTextIcon size={12} style={{ flexShrink: 0 }} />
                                <span>{p.notes}</span>
                              </div>
                            )}
                            {isIssue && p.issue && (
                              <div className="sv-order-issue-chip">
                                <AlertTriangleIcon size={12} style={{ flexShrink: 0 }} />
                                <span>{p.issue.category}: {p.issue.note || 'Flagged for Admin'}</span>
                              </div>
                            )}
                          </div>

                          {/* Section 4: Status badge */}
                          <div className="sv-order-col-status">
                            <span
                              className={`sv-badge ${
                                isCompleted
                                  ? 'green'
                                  : isInProgress
                                  ? 'orange'
                                  : isIssue
                                  ? 'red'
                                  : 'blue'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>

                          {/* Section 5: Action buttons */}
                          <div className="sv-order-col-actions">
                            <a
                              href={`tel:${p.phone || p.customerPhone || '01700-000000'}`}
                              className="sv-btn-action-sm sv-btn-call"
                              title="Call Customer"
                            >
                              <PhoneIcon size={13} />
                              <span>Call</span>
                            </a>

                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address || 'Dhaka')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sv-btn-action-sm sv-btn-map"
                              title="Open Address in Maps"
                            >
                              <MapPinIcon size={13} />
                              <span>Maps</span>
                            </a>

                            {isAssigned && (
                              <button
                                type="button"
                                className="sv-btn-primary sv-btn-action-sm"
                                onClick={() => updateCollectorTask(p.id, 'In Progress')}
                              >
                                <TruckIcon size={13} />
                                <span>Start Pickup</span>
                              </button>
                            )}

                            {isInProgress && (
                              <button
                                type="button"
                                className="sv-btn-primary sv-btn-action-sm"
                                onClick={() => handleOpenWeighingModal(p)}
                              >
                                <ScaleIcon size={13} />
                                <span>Scale &amp; Complete</span>
                              </button>
                            )}

                            {isCompleted && (
                              <button
                                type="button"
                                className="sv-btn-secondary sv-btn-action-sm"
                                onClick={() => setReceiptModal({ isOpen: true, pickup: p })}
                              >
                                <FileTextIcon size={13} />
                                <span>Receipt</span>
                              </button>
                            )}

                            {!isCompleted && !isIssue && (
                              <button
                                type="button"
                                className="sv-btn-action-sm sv-btn-report-issue"
                                onClick={() => handleOpenIssueModal(p)}
                                title="Report issue to admin"
                              >
                                <AlertTriangleIcon size={13} />
                                <span>Report</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
             SECTION: COLLECTOR SETTINGS (TAB 3)
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="sv-settings-grid">
              {/* Profile Details Form */}
              <div className="sv-card">
                <div className="sv-card-header">
                  <div>
                    <h2 className="sv-card-title" style={{ fontSize: '16px' }}>Collector Partner Profile</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                      Official operational contact and verification parameters
                    </p>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  {profileSuccessMsg && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircleIcon size={16} />
                      <span>Profile details updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile}>
                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Collector Name
                      </label>
                      <input
                        type="text"
                        className="sv-input"
                        value={currentUser.name || ''}
                        disabled
                        style={{ background: '#f8fafc', cursor: 'not-allowed' }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Verified identity registered by ScrapVenture.</span>
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Collector Badge ID
                      </label>
                      <div className="sv-collector-readonly-field">
                        {currentUser.badgeId || currentUser.id || 'COL-104'}
                      </div>
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Assigned Operational Zone
                      </label>
                      <div className="sv-collector-readonly-field">
                        {currentUser.zone || 'Dhaka North (Banani, Gulshan, Uttara)'}
                      </div>
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Vehicle &amp; Transport Unit
                      </label>
                      <div className="sv-collector-readonly-field">
                        {currentUser.vehicle || 'Motorized Van (ঢাকা মেট্রো-হ ১১-২২৩৩)'}
                      </div>
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Mobile Phone Number <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="sv-input"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="sv-input"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="sv-btn-primary"
                      style={{ padding: '9px 20px', fontSize: '13px', marginTop: '6px' }}
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              </div>

              {/* Password & Security Form */}
              <div className="sv-card">
                <div className="sv-card-header">
                  <div>
                    <h2 className="sv-card-title" style={{ fontSize: '16px' }}>Account Security</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                      Update your account access credentials
                    </p>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  {passwordFeedback.text && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        marginBottom: '16px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: passwordFeedback.type === 'success' ? '#ecfdf5' : '#fff1f2',
                        border: `1px solid ${passwordFeedback.type === 'success' ? '#6ee7b7' : '#fecdd3'}`,
                        color: passwordFeedback.type === 'success' ? '#065f46' : '#e11d48',
                      }}
                    >
                      {passwordFeedback.type === 'success' && <CheckCircleIcon size={16} />}
                      {passwordFeedback.type === 'error' && <AlertTriangleIcon size={16} />}
                      <span>{passwordFeedback.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSavePassword}>
                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Current Password <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="password"
                        className="sv-input"
                        placeholder="••••••••"
                        value={passwordForm.currentPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPass: e.target.value })}
                        required
                      />
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        New Password <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="password"
                        className="sv-input"
                        placeholder="••••••••"
                        value={passwordForm.newPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                        required
                      />
                    </div>

                    <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                      <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="password"
                        className="sv-input"
                        placeholder="••••••••"
                        value={passwordForm.confirmPass}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="sv-btn-primary"
                      style={{ padding: '9px 20px', fontSize: '13px', marginTop: '6px' }}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= RECORD SCALE WEIGHT & COMPLETE MODAL ================= */}
      {weighingModal.isOpen && (
        <div className="sv-collector-modal-backdrop" onClick={handleCloseWeighingModal}>
          <div className="sv-collector-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-collector-modal-header">
              <h3>Record Scale Weight &amp; Complete (ওজন রেকর্ড)</h3>
              <button
                type="button"
                onClick={handleCloseWeighingModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <div className="sv-collector-modal-body">
              {weighingModal.pickup && (
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                  <div><strong>Pickup ID:</strong> {weighingModal.pickup.id}</div>
                  <div><strong>Customer:</strong> {weighingModal.pickup.customerName || weighingModal.pickup.customer}</div>
                  <div><strong>Address:</strong> {weighingModal.pickup.address}</div>
                  <div><strong>Materials:</strong> {getScrapItemsList(weighingModal.pickup).join(', ')}</div>
                </div>
              )}

              {weighingModal.error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangleIcon size={16} />
                  <span>{weighingModal.error}</span>
                </div>
              )}

              {weighingModal.success && (
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={16} />
                  <span>Weight verified and collection completed successfully!</span>
                </div>
              )}

              <form onSubmit={handleSubmitWeighing}>
                <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                  <label className="sv-form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    Actual Scale Weight (kg) / স্কেলে মাপা ওজন (কেজি) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="sv-input"
                    placeholder="e.g. 28.5"
                    value={weighingModal.actualWeight}
                    onChange={(e) => setWeighingModal({ ...weighingModal, actualWeight: e.target.value })}
                    required
                  />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Must be numeric and recorded directly from the scale.</span>
                </div>

                <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                  <label className="sv-form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    Client Cash / Digital Payout (৳) / কাস্টমারকে পরিশোধকৃত টাকা <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="sv-input"
                    placeholder="e.g. 620"
                    value={weighingModal.clientPayout}
                    onChange={(e) => setWeighingModal({ ...weighingModal, clientPayout: e.target.value })}
                    required
                  />
                </div>

                <div className="sv-form-group" style={{ marginBottom: '18px' }}>
                  <label className="sv-form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    Collection Notes (ঐচ্ছিক মন্তব্য)
                  </label>
                  <input
                    type="text"
                    className="sv-input"
                    placeholder="e.g. Weighed on calibrated digital scale, cash handed over directly"
                    value={weighingModal.notes}
                    onChange={(e) => setWeighingModal({ ...weighingModal, notes: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="sv-btn-secondary"
                    style={{ flex: 1, padding: '10px' }}
                    onClick={handleCloseWeighingModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sv-btn-primary"
                    style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                  >
                    Confirm &amp; Complete (সম্পন্ন)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= REPORT ISSUE MODAL ================= */}
      {issueModal.isOpen && (
        <div className="sv-collector-modal-backdrop" onClick={handleCloseIssueModal}>
          <div className="sv-collector-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-collector-modal-header">
              <h3>Report Pickup Issue to Admin (সমস্যা রিপোর্ট)</h3>
              <button
                type="button"
                onClick={handleCloseIssueModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <div className="sv-collector-modal-body">
              {issueModal.pickup && (
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px' }}>
                  <div><strong>Pickup:</strong> {issueModal.pickup.id} — {issueModal.pickup.customerName || issueModal.pickup.customer}</div>
                  <div><strong>Address:</strong> {issueModal.pickup.address}</div>
                </div>
              )}

              {issueModal.submitted ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleIcon size={16} />
                  <span>Issue reported to ScrapVenture Admin Panel successfully.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitIssue}>
                  <div className="sv-form-group" style={{ marginBottom: '14px' }}>
                    <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      Issue Category / সমস্যার কারণ <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      className="sv-input"
                      value={issueModal.category}
                      onChange={(e) => setIssueModal({ ...issueModal, category: e.target.value })}
                    >
                      <option value="Customer Not Available / Door Locked">Customer Not Available / Door Locked</option>
                      <option value="Customer Rescheduled Collection">Customer Rescheduled Collection</option>
                      <option value="Incorrect / Unreachable Address">Incorrect / Unreachable Address</option>
                      <option value="Material Quality Dispute">Material Quality / Weight Dispute</option>
                      <option value="Vehicle Breakdown / Severe Weather">Vehicle Breakdown / Weather Delay</option>
                      <option value="Other Issue">Other Issue</option>
                    </select>
                  </div>

                  <div className="sv-form-group" style={{ marginBottom: '18px' }}>
                    <label className="sv-form-label" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      Additional Details for Administrator
                    </label>
                    <textarea
                      rows={3}
                      className="sv-input"
                      placeholder="Describe what occurred on site..."
                      value={issueModal.note}
                      onChange={(e) => setIssueModal({ ...issueModal, note: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      style={{ flex: 1, padding: '9px' }}
                      onClick={handleCloseIssueModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="sv-btn-primary"
                      style={{ flex: 1, padding: '9px', background: '#e11d48' }}
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= RECEIPT INSPECTION MODAL ================= */}
      {receiptModal.isOpen && receiptModal.pickup && (
        <div className="sv-collector-modal-backdrop" onClick={() => setReceiptModal({ isOpen: false, pickup: null })}>
          <div className="sv-collector-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-collector-modal-header">
              <h3>Digital Collection Scale Receipt</h3>
              <button
                type="button"
                onClick={() => setReceiptModal({ isOpen: false, pickup: null })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <div className="sv-collector-modal-body">
              <div style={{ border: '1px dashed #cbd5e1', padding: '16px', borderRadius: '10px', background: '#fafafa' }}>
                <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  <img src="/assets/images/logo.png" alt="ScrapVenture" style={{ height: '32px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#269C26', marginTop: '4px' }}>
                    Verified Digital Weighing Slip
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Receipt #{receiptModal.pickup.id}</div>
                </div>

                <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#334155' }}>
                  <div><strong>Customer:</strong> {receiptModal.pickup.customerName || receiptModal.pickup.customer}</div>
                  <div><strong>Address:</strong> {receiptModal.pickup.address}</div>
                  <div><strong>Materials:</strong> {getScrapItemsList(receiptModal.pickup).join(', ')}</div>
                  <div><strong>Verified Scale Weight:</strong> <strong style={{ color: '#0f172a' }}>{receiptModal.pickup.actualWeight || receiptModal.pickup.collectedWeight || receiptModal.pickup.finalWeight}</strong></div>
                  <div><strong>Client Payout:</strong> <strong style={{ color: '#16a34a' }}>{receiptModal.pickup.cashPaid || receiptModal.pickup.payout || '৳ 550'}</strong></div>
                  <div><strong>Collector:</strong> {currentUser.name} ({currentUser.badgeId || 'Collector'})</div>
                  <div><strong>Status:</strong> <span className="sv-badge green" style={{ padding: '2px 6px', fontSize: '11px' }}>Verified &amp; Paid</span></div>
                </div>
              </div>
            </div>

            <div className="sv-collector-modal-footer">
              <button
                type="button"
                className="sv-btn-primary"
                style={{ padding: '7px 18px', fontSize: '12.5px' }}
                onClick={() => setReceiptModal({ isOpen: false, pickup: null })}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
