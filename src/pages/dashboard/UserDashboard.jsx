import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../components/admin/admin.css';
import './customer-dashboard.css';
import {
  DashboardIcon,
  ScrapPickupIcon,
  OrdersIcon,
  MarketplaceIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
  ExternalLinkIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '../../components/admin/AdminIcons.jsx';

function SellingHistoryIcon({ size = 19, strokeWidth = 2, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ScaleIcon({ size = 18, strokeWidth = 2, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

export default function UserDashboard() {
  const {
    currentUser,
    userOrders = [],
    userPickups = [],
    userSales = [],
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
      navigate('/login', { replace: true });
      return;
    }
    if (currentUser.role === 'collector') {
      navigate('/collector/dashboard', { replace: true });
      return;
    }
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
  }, [currentUser, navigate]);

  // Determine active category based on URL or searchParams
  const getInitialCategory = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'pickups', 'selling-history', 'orders', 'settings'].includes(tabParam)) {
      return tabParam;
    }
    if (location.pathname.includes('/selling-history')) return 'selling-history';
    if (location.pathname.includes('/pickups')) return 'pickups';
    if (location.pathname.includes('/orders')) return 'orders';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'overview';
  };

  const [activeCategory, setActiveCategory] = useState(getInitialCategory);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync state when URL changes
  useEffect(() => {
    const newCat = getInitialCategory();
    setActiveCategory(newCat);
  }, [location.pathname, searchParams]);

  const handleTabChange = (cat) => {
    setActiveCategory(cat);
    setMobileSidebarOpen(false);
    setSearchParams({ tab: cat });
  };

  /* -------------------------------------------------------------------------
     USER DATA ISOLATION: Belonging exclusively to the authenticated customer
  ------------------------------------------------------------------------- */
  const customerPickups = useMemo(() => {
    if (!currentUser?.id) return [];
    return userPickups.filter((p) => {
      if (p.userId && p.userId === currentUser.id) return true;
      if (currentUser.id === 'USR-7821' && (!p.userId || p.userId === 'USR-7821')) return true;
      if (p.customerEmail && currentUser.email && p.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
      if (p.customerPhone && currentUser.phone && p.customerPhone.replace(/[\s-]/g, '') === currentUser.phone.replace(/[\s-]/g, '')) return true;
      return false;
    });
  }, [userPickups, currentUser]);

  const customerSales = useMemo(() => {
    if (!currentUser?.id) return [];
    return userSales.filter((s) => {
      if (s.userId && s.userId === currentUser.id) return true;
      if (currentUser.id === 'USR-7821' && (!s.userId || s.userId === 'USR-7821')) return true;
      return false;
    });
  }, [userSales, currentUser]);

  const customerOrders = useMemo(() => {
    if (!currentUser?.id) return [];
    return userOrders.filter((o) => {
      if (o.userId && o.userId === currentUser.id) return true;
      if (currentUser.id === 'USR-7821' && (!o.userId || o.userId === 'USR-7821')) return true;
      if (o.customerEmail && currentUser.email && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
      return false;
    });
  }, [userOrders, currentUser]);

  /* -------------------------------------------------------------------------
     4 TOP STAT CARDS: Calculated strictly from real database records
  ------------------------------------------------------------------------- */
  const totalPickupsCount = customerPickups.length;
  const totalOrdersCount = customerOrders.length;
  const totalRecycledWeightKg = useMemo(() => {
    return customerSales.reduce((acc, s) => acc + (Number(s.collectedWeight) || 0), 0);
  }, [customerSales]);
  const totalEarnedBDT = useMemo(() => {
    return customerSales.reduce((acc, s) => acc + (Number(s.totalAmount) || 0), 0);
  }, [customerSales]);

  /* -------------------------------------------------------------------------
     SALES ANALYTICS & DATE FILTERS (OVERVIEW SECTION 5)
  ------------------------------------------------------------------------- */
  const [salesDateFilter, setSalesDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filteredSalesForAnalytics = useMemo(() => {
    if (!customerSales || customerSales.length === 0) return [];
    if (salesDateFilter === 'all') return customerSales;

    const now = new Date();
    let startBoundary = null;
    let endBoundary = new Date();

    if (salesDateFilter === 'today') {
      startBoundary = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      endBoundary = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (salesDateFilter === 'week') {
      const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startBoundary = new Date(pastWeek.getFullYear(), pastWeek.getMonth(), pastWeek.getDate(), 0, 0, 0);
    } else if (salesDateFilter === 'month') {
      startBoundary = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    } else if (salesDateFilter === 'year') {
      startBoundary = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
    } else if (salesDateFilter === 'custom') {
      if (customStartDate) {
        const [sy, sm, sd] = customStartDate.split('-').map(Number);
        startBoundary = new Date(sy, sm - 1, sd, 0, 0, 0);
      }
      if (customEndDate) {
        const [ey, em, ed] = customEndDate.split('-').map(Number);
        endBoundary = new Date(ey, em - 1, ed, 23, 59, 59);
      }
    }

    return customerSales.filter((s) => {
      const dateVal = s.completedDate || s.date;
      if (!dateVal) return false;
      const sDate = new Date(dateVal);
      if (isNaN(sDate.getTime())) return true;
      if (startBoundary && sDate < startBoundary) return false;
      if (endBoundary && sDate > endBoundary) return false;
      return true;
    });
  }, [customerSales, salesDateFilter, customStartDate, customEndDate]);

  const periodEarnings = useMemo(() => {
    return filteredSalesForAnalytics.reduce((acc, s) => acc + (Number(s.totalAmount) || 0), 0);
  }, [filteredSalesForAnalytics]);

  const periodWeight = useMemo(() => {
    return filteredSalesForAnalytics.reduce((acc, s) => acc + (Number(s.collectedWeight) || 0), 0);
  }, [filteredSalesForAnalytics]);

  const periodTransactionsCount = filteredSalesForAnalytics.length;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredSalesForAnalytics.forEach((s) => {
      const cat = s.category || 'Other';
      if (!map[cat]) {
        map[cat] = { category: cat, weight: 0, amount: 0, count: 0 };
      }
      map[cat].weight += Number(s.collectedWeight) || 0;
      map[cat].amount += Number(s.totalAmount) || 0;
      map[cat].count += 1;
    });

    const list = Object.values(map);
    list.sort((a, b) => b.amount - a.amount);
    return list;
  }, [filteredSalesForAnalytics]);

  const chartPoints = useMemo(() => {
    const list = [...filteredSalesForAnalytics];
    list.sort((a, b) => new Date(a.completedDate || a.date) - new Date(b.completedDate || b.date));

    const grouped = {};
    list.forEach((s) => {
      const d = (s.date || '').split('T')[0] || 'Recent';
      if (!grouped[d]) {
        grouped[d] = { date: d, amount: 0, weight: 0, count: 0, label: d };
      }
      grouped[d].amount += Number(s.totalAmount) || 0;
      grouped[d].weight += Number(s.collectedWeight) || 0;
      grouped[d].count += 1;
    });

    return Object.values(grouped);
  }, [filteredSalesForAnalytics]);

  /* -------------------------------------------------------------------------
     SELLING HISTORY (SECTION 6)
  ------------------------------------------------------------------------- */
  const [historySearch, setHistorySearch] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
  const [historyDateFilter, setHistoryDateFilter] = useState('all');
  const [historySortBy, setHistorySortBy] = useState('date-desc');
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 6;

  // Modal inspection states
  const [selectedTransactionModal, setSelectedTransactionModal] = useState(null);
  const [selectedPickupModal, setSelectedPickupModal] = useState(null);
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  const processedSellingHistory = useMemo(() => {
    let result = [...customerSales];

    if (historySearch.trim()) {
      const q = historySearch.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.id && s.id.toLowerCase().includes(q)) ||
          (s.pickupId && s.pickupId.toLowerCase().includes(q)) ||
          (s.materialName && s.materialName.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q)) ||
          (s.collectorName && s.collectorName.toLowerCase().includes(q))
      );
    }

    if (historyCategoryFilter !== 'all') {
      result = result.filter(
        (s) => (s.category || '').toLowerCase() === historyCategoryFilter.toLowerCase()
      );
    }

    if (historyStatusFilter !== 'all') {
      result = result.filter(
        (s) => (s.status || '').toLowerCase() === historyStatusFilter.toLowerCase()
      );
    }

    if (historyDateFilter !== 'all') {
      const now = new Date();
      let start = null;
      if (historyDateFilter === 'today') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (historyDateFilter === 'week') {
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (historyDateFilter === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (historyDateFilter === 'year') {
        start = new Date(now.getFullYear(), 0, 1);
      }
      if (start) {
        result = result.filter((s) => {
          const sDate = new Date(s.completedDate || s.date);
          return sDate >= start;
        });
      }
    }

    result.sort((a, b) => {
      const dateA = new Date(a.completedDate || a.date).getTime() || 0;
      const dateB = new Date(b.completedDate || b.date).getTime() || 0;
      const amountA = Number(a.totalAmount) || 0;
      const amountB = Number(b.totalAmount) || 0;
      const weightA = Number(a.collectedWeight) || 0;
      const weightB = Number(b.collectedWeight) || 0;

      if (historySortBy === 'date-desc') return dateB - dateA;
      if (historySortBy === 'date-asc') return dateA - dateB;
      if (historySortBy === 'amount-desc') return amountB - amountA;
      if (historySortBy === 'amount-asc') return amountA - amountB;
      if (historySortBy === 'weight-desc') return weightB - weightA;
      return 0;
    });

    return result;
  }, [customerSales, historySearch, historyCategoryFilter, historyStatusFilter, historyDateFilter, historySortBy]);

  const totalHistoryPages = Math.ceil(processedSellingHistory.length / itemsPerPage) || 1;
  const paginatedSellingHistory = useMemo(() => {
    const start = (historyPage - 1) * itemsPerPage;
    return processedSellingHistory.slice(start, start + itemsPerPage);
  }, [processedSellingHistory, historyPage]);

  const handleExportCSV = () => {
    if (customerSales.length === 0) {
      alert('No selling transactions available to export.');
      return;
    }

    const headers = [
      'Transaction ID',
      'Pickup ID',
      'Date',
      'Category',
      'Material Name',
      'Weight (kg)',
      'Price Per Kg (BDT)',
      'Total Selling Amount (BDT)',
      'Collector Name',
      'Transaction Status',
      'Payment Status',
    ];

    const rows = processedSellingHistory.map((s) => [
      `"${s.id}"`,
      `"${s.pickupId || 'N/A'}"`,
      `"${s.date || s.completedDate || 'N/A'}"`,
      `"${s.category || 'Recyclable'}"`,
      `"${s.materialName || 'Scrap Material'}"`,
      s.collectedWeight || 0,
      s.pricePerKg || 0,
      s.totalAmount || 0,
      `"${s.collectorName || 'Assigned Collector'}"`,
      `"${s.status || 'Verified'}"`,
      `"${s.paymentStatus || 'Paid'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ScrapVenture_Selling_History_${currentUser.name?.replace(/\s+/g, '_') || 'Customer'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* -------------------------------------------------------------------------
     MY SCRAP PICKUPS (SECTION 7)
  ------------------------------------------------------------------------- */
  const [pickupFilter, setPickupFilter] = useState('all');

  const filteredPickups = useMemo(() => {
    if (pickupFilter === 'all') return customerPickups;
    return customerPickups.filter(
      (p) => (p.status || '').toLowerCase() === pickupFilter.toLowerCase()
    );
  }, [customerPickups, pickupFilter]);

  const getPickupItems = (p) => {
    if (!p) return [];
    if (Array.isArray(p.materials)) return p.materials;
    if (Array.isArray(p.items)) return p.items.map((i) => (typeof i === 'object' ? `${i.name || 'Waste'} (${i.weightKg || ''} kg)` : i));
    return ['Scrap Materials'];
  };

  /* -------------------------------------------------------------------------
     MARKETPLACE ORDERS (SECTION 8)
  ------------------------------------------------------------------------- */
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return customerOrders.filter((o) => {
      if (orderStatusFilter !== 'all') {
        if ((o.status || '').toLowerCase() !== orderStatusFilter.toLowerCase()) return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchId = (o.id || '').toLowerCase().includes(q);
        const matchItems = Array.isArray(o.items) && o.items.some((it) => {
          const name = typeof it === 'object' ? it.name || it.product?.name : String(it);
          return name && name.toLowerCase().includes(q);
        });
        if (!matchId && !matchItems) return false;
      }
      return true;
    });
  }, [customerOrders, orderSearch, orderStatusFilter]);

  const getOrderItems = (o) => {
    if (!o) return [];
    if (Array.isArray(o.items)) {
      return o.items.map((i) => {
        if (typeof i === 'object') {
          return i.product ? `${i.product.name} (x${i.quantity || 1})` : i.name || 'Product';
        }
        return String(i);
      });
    }
    return ['Eco Product'];
  };

  /* -------------------------------------------------------------------------
     ACCOUNT SETTINGS (SECTION 9)
  ------------------------------------------------------------------------- */
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    avatar: currentUser?.avatar || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [passData, setPassData] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserSettings(profileData);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3500);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
    setPassMessage({ type: 'success', text: 'Password successfully updated!' });
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setPassMessage({ type: '', text: '' }), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'pickups':
        return 'My Scrap Pickups';
      case 'selling-history':
        return 'Selling History';
      case 'orders':
        return 'Marketplace Orders';
      case 'settings':
        return 'Account Settings';
      default:
        return 'Dashboard Overview';
    }
  };

  const getCategorySubtitle = () => {
    switch (activeCategory) {
      case 'pickups':
        return 'Track your doorstep recyclable collection requests, assigned collectors, and pickup schedules.';
      case 'selling-history':
        return 'Detailed records of every verified scrap transaction, scale weight, and payout receipt.';
      case 'orders':
        return 'Eco-friendly and upcycled sustainable products purchased from the ScrapVenture Marketplace.';
      case 'settings':
        return 'Manage your customer profile, verified pickup address, and account security.';
      default:
        return 'Real-time operational summary of your recyclable collections, sales earnings, and circular impact.';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="sv-admin-layout sv-customer-dashboard">
      {/* Mobile Backdrop */}
      <div
        className={`sv-sidebar-backdrop ${mobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ================= LEFT SIDEBAR (ADMIN PANEL GREEN DESIGN) ================= */}
      <aside
        className={`sv-admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        aria-label="Customer Navigation"
      >
        {/* Brand Header */}
        <div className="sv-sidebar-brand-header">
          <Link
            to="/dashboard"
            className="sv-sidebar-brand-link"
            title="Scrap Venture Customer Panel"
            onClick={() => handleTabChange('overview')}
          >
            <img
              src="/assets/images/logo.png"
              alt="Scrap Venture"
              className="sv-sidebar-brand-logo-img"
            />
            <div className="sv-sidebar-brand-meta">
              <span className="sv-sidebar-brand-title">Customer Panel</span>
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

        {/* Customer Profile Card inside Green Sidebar */}
        <div className="sv-customer-sidebar-card">
          <div className="sv-customer-sidebar-avatar">
            {profileData.avatar || currentUser.avatar ? (
              <img src={profileData.avatar || currentUser.avatar} alt={currentUser.name} />
            ) : (
              currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'
            )}
          </div>
          <div className="sv-customer-sidebar-meta">
            <span className="sv-customer-sidebar-name" title={currentUser.name}>
              {currentUser.name || 'Customer'}
            </span>
            <span className="sv-customer-sidebar-badge">Verified Account</span>
          </div>
        </div>

        {/* Navigation Items (Exact 5 Customer Items) */}
        <nav className="sv-sidebar-nav-container" aria-label="Customer Nav">
          <ul className="sv-sidebar-nav-list" role="menu">
            {/* 1. Overview & Stats */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeCategory === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabChange('overview')}
                role="menuitem"
                title="Overview & Stats"
              >
                <span className="sv-sidebar-item-icon">
                  <DashboardIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Overview &amp; Stats</span>
              </button>
            </li>

            {/* 2. My Scrap Pickups */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeCategory === 'pickups' ? 'active' : ''}`}
                onClick={() => handleTabChange('pickups')}
                role="menuitem"
                title="My Scrap Pickups"
              >
                <span className="sv-sidebar-item-icon">
                  <ScrapPickupIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">My Scrap Pickups</span>
                <span className="sv-sidebar-nav-pill">{customerPickups.length}</span>
              </button>
            </li>

            {/* 3. Selling History */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeCategory === 'selling-history' ? 'active' : ''}`}
                onClick={() => handleTabChange('selling-history')}
                role="menuitem"
                title="Selling History"
              >
                <span className="sv-sidebar-item-icon">
                  <SellingHistoryIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Selling History</span>
                <span className="sv-sidebar-nav-pill">{customerSales.length}</span>
              </button>
            </li>

            {/* 4. Marketplace Orders */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeCategory === 'orders' ? 'active' : ''}`}
                onClick={() => handleTabChange('orders')}
                role="menuitem"
                title="Marketplace Orders"
              >
                <span className="sv-sidebar-item-icon">
                  <OrdersIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Marketplace Orders</span>
                <span className="sv-sidebar-nav-pill">{customerOrders.length}</span>
              </button>
            </li>

            {/* 5. Account Settings */}
            <li role="none">
              <button
                type="button"
                className={`sv-sidebar-item-link ${activeCategory === 'settings' ? 'active' : ''}`}
                onClick={() => handleTabChange('settings')}
                role="menuitem"
                title="Account Settings"
              >
                <span className="sv-sidebar-item-icon">
                  <SettingsIcon size={19} />
                </span>
                <span className="sv-sidebar-item-label">Account Settings</span>
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

          <button
            type="button"
            className="sv-sidebar-item-btn logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="sv-sidebar-item-icon">
              <LogoutIcon size={19} />
            </span>
            <span className="sv-sidebar-item-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA (ADMIN PANEL STYLE) ================= */}
      <div className="sv-admin-main-wrapper">
        {/* Top Header matching Admin Panel */}
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
              <span className="sv-breadcrumb-root">Customer Portal</span>
              <span className="sv-breadcrumb-separator">/</span>
              <span className="sv-breadcrumb-current">{getCategoryTitle()}</span>
            </nav>
          </div>

          {/* Right: View Site + User Badge */}
          <div className="sv-header-right">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="sv-header-site-btn"
              title="Open public website in new tab"
            >
              <span>View Site</span>
              <ExternalLinkIcon size={14} />
            </Link>

            <div className="sv-header-user-badge">
              <div
                className="sv-customer-sidebar-avatar"
                style={{ width: '32px', height: '32px', fontSize: '13px', background: '#269C26', color: '#ffffff' }}
              >
                {profileData.avatar || currentUser.avatar ? (
                  <img src={profileData.avatar || currentUser.avatar} alt={currentUser.name} />
                ) : (
                  currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'
                )}
              </div>
              <div className="sv-header-user-info">
                <span className="sv-header-user-name">
                  {currentUser.name || 'Customer'}
                </span>
                <span className="sv-header-user-role" style={{ color: '#269C26' }}>
                  Verified Customer
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="sv-admin-page-content" id="customerMainContent">
          {/* Page Title & Action Buttons */}
          <div className="sv-page-header">
            <div className="sv-page-title-group">
              <h1>{getCategoryTitle()}</h1>
              <p>{getCategorySubtitle()}</p>
            </div>
            <div className="sv-page-actions">
              <Link to="/book-pickup" className="sv-btn-primary">
                <ScrapPickupIcon size={16} />
                <span>+ Book a Pickup</span>
              </Link>
              <Link to="/marketplace" className="sv-btn-secondary">
                <MarketplaceIcon size={16} />
                <span>Eco Marketplace</span>
              </Link>
            </div>
          </div>

          {/* ================= TAB 1: OVERVIEW & STATS ================= */}
          {activeCategory === 'overview' && (
            <>
              {/* Four Stat Cards (Admin Panel Standardized Grid) */}
              <div className="sv-stats-grid">
                {/* Card 1: Total Pickups */}
                <div className="sv-stat-card">
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Total Pickups</span>
                    <div className="sv-stat-icon-wrap green">
                      <ScrapPickupIcon size={18} />
                    </div>
                  </div>
                  <div className="sv-stat-value">{totalPickupsCount}</div>
                  <div className="sv-stat-change">Doorstep pickup requests</div>
                </div>

                {/* Card 2: Marketplace Orders */}
                <div className="sv-stat-card">
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Marketplace Orders</span>
                    <div className="sv-stat-icon-wrap blue">
                      <OrdersIcon size={18} />
                    </div>
                  </div>
                  <div className="sv-stat-value">{totalOrdersCount}</div>
                  <div className="sv-stat-change">Sustainable product orders</div>
                </div>

                {/* Card 3: Recycled Scrap */}
                <div className="sv-stat-card">
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Recycled Scrap</span>
                    <div className="sv-stat-icon-wrap orange">
                      <ScaleIcon size={18} />
                    </div>
                  </div>
                  <div className="sv-stat-value">
                    {totalRecycledWeightKg > 1000
                      ? `${(totalRecycledWeightKg / 1000).toFixed(2)} tons`
                      : `${totalRecycledWeightKg.toFixed(1).replace(/\.0$/, '')} kg`}
                  </div>
                  <div className="sv-stat-change">Verified collection weight</div>
                </div>

                {/* Card 4: Total Earned / Saved */}
                <div className="sv-stat-card">
                  <div className="sv-stat-header">
                    <span className="sv-stat-label">Total Earned / Saved</span>
                    <div className="sv-stat-icon-wrap green">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                        <path d="M12 18V6" />
                      </svg>
                    </div>
                  </div>
                  <div className="sv-stat-value">৳ {totalEarnedBDT.toLocaleString('en-IN')}</div>
                  <div className="sv-stat-change">Verified cash &amp; bKash payouts</div>
                </div>
              </div>

              {/* Welcome Banner Card (Admin Panel Card Language) */}
              <div
                className="sv-card"
                style={{
                  padding: '22px 26px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    Welcome back, {currentUser?.name || 'Customer'}!
                  </h2>
                  <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                    Turn household and business recyclable scrap into verified cash payouts while keeping Bangladesh clean.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/book-pickup" className="sv-btn-primary">
                    <ScrapPickupIcon size={16} />
                    <span>+ Book New Pickup</span>
                  </Link>
                </div>
              </div>

              {/* SALES ANALYTICS CARD (SECTION 5) */}
              <div className="sv-card">
                <div className="sv-card-header">
                  <div>
                    <div className="sv-card-title">Sales &amp; Recycling Analytics</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      Verified scrap sales over time, date filtering, and material category distribution
                    </div>
                  </div>

                  {/* Date Filter Pills */}
                  <div className="sv-date-filter-row" role="group" aria-label="Date Filters">
                    {[
                      { key: 'today', label: 'Today' },
                      { key: 'week', label: 'This Week' },
                      { key: 'month', label: 'This Month' },
                      { key: 'year', label: 'This Year' },
                      { key: 'all', label: 'All Time' },
                      { key: 'custom', label: 'Custom Range' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        className={`sv-date-btn ${salesDateFilter === f.key ? 'active' : ''}`}
                        onClick={() => setSalesDateFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Pickers */}
                {salesDateFilter === 'custom' && (
                  <div style={{ padding: '12px 22px', borderBottom: '1px solid var(--sv-admin-border)', background: '#f8fafc' }}>
                    <div className="sv-custom-date-inputs">
                      <span>Start Date:</span>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        aria-label="Start Date"
                      />
                      <span>End Date:</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        aria-label="End Date"
                      />
                    </div>
                  </div>
                )}

                <div className="sv-card-body">
                  {/* Period Stats Row */}
                  <div className="sv-analytics-stats-grid">
                    <div className="sv-analytics-stat-item">
                      <span className="sv-analytics-stat-label">Total Earnings in Period</span>
                      <span className="sv-analytics-stat-val" style={{ color: '#269C26' }}>
                        ৳ {periodEarnings.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="sv-analytics-stat-item">
                      <span className="sv-analytics-stat-label">Total Weight Sold</span>
                      <span className="sv-analytics-stat-val">
                        {periodWeight.toFixed(1).replace(/\.0$/, '')} kg
                      </span>
                    </div>
                    <div className="sv-analytics-stat-item">
                      <span className="sv-analytics-stat-label">Completed Sales Transactions</span>
                      <span className="sv-analytics-stat-val">{periodTransactionsCount}</span>
                    </div>
                  </div>

                  {filteredSalesForAnalytics.length === 0 ? (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                        No Sales Records in Selected Period
                      </p>
                      <p style={{ fontSize: '13px', margin: '0 0 16px' }}>
                        No verified scrap sales occurred within this date window. Try selecting "All Time" or schedule a pickup.
                      </p>
                      <button
                        type="button"
                        className="sv-btn-secondary"
                        onClick={() => setSalesDateFilter('all')}
                      >
                        Reset to All Time
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                      {/* SVG Sales Chart */}
                      <div style={{ background: '#ffffff', border: '1px solid var(--sv-admin-border)', borderRadius: '10px', padding: '18px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Sales Over Time (৳ BDT)</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>{chartPoints.length} Data Points</span>
                        </div>

                        <div style={{ width: '100%', height: '200px' }}>
                          <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="35" x2="500" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="125" x2="500" y2="125" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="155" x2="500" y2="155" stroke="#e2e8f0" strokeWidth="1" />

                            {chartPoints.map((pt, idx) => {
                              const maxVal = Math.max(...chartPoints.map((p) => p.amount), 100);
                              const totalPts = chartPoints.length;
                              const x = totalPts === 1 ? 250 : 40 + (idx * (420 / (totalPts - 1)));
                              const barHeight = (pt.amount / maxVal) * 110;
                              const y = 155 - barHeight;

                              return (
                                <g key={idx}>
                                  <rect
                                    x={x - 14}
                                    y={y}
                                    width={28}
                                    height={barHeight}
                                    rx={4}
                                    fill="#269C26"
                                    opacity="0.88"
                                    style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                                  >
                                    <title>{`${pt.date}: ৳ ${pt.amount} (${pt.weight} kg, ${pt.count} txn)`}</title>
                                  </rect>
                                  <circle cx={x} cy={y} r="3.5" fill="#ffffff" stroke="#269C26" strokeWidth="2" />
                                  <text
                                    x={x}
                                    y="170"
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#64748b"
                                    fontWeight="600"
                                  >
                                    {pt.date.slice(5) || pt.date}
                                  </text>
                                  <text
                                    x={x}
                                    y={y - 6}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#0f172a"
                                    fontWeight="700"
                                  >
                                    ৳{pt.amount}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      </div>

                      {/* Category Breakdown */}
                      <div style={{ background: '#ffffff', border: '1px solid var(--sv-admin-border)', borderRadius: '10px', padding: '18px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                          Scrap Category Breakdown
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {categoryBreakdown.map((cat) => {
                            const percent = periodEarnings > 0 ? ((cat.amount / periodEarnings) * 100).toFixed(0) : 0;
                            return (
                              <div key={cat.category}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                                  <span style={{ color: '#0f172a' }}>{cat.category}</span>
                                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                                    {cat.weight} kg &bull; ৳ {cat.amount.toLocaleString('en-IN')} ({percent}%)
                                  </span>
                                </div>
                                <div className="sv-cat-bar-track">
                                  <div className="sv-cat-bar-fill" style={{ width: `${percent}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2-Column Grid on Overview (Matching AdminDashboard 2-col layout) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Left: Recent Scrap Pickup Requests */}
                <div className="sv-card">
                  <div className="sv-card-header">
                    <div className="sv-card-title">Recent Scrap Pickup Requests</div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('pickups')}
                      style={{ fontSize: '13px', color: '#269C26', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      View All Pickups &rarr;
                    </button>
                  </div>
                  <div className="sv-table-container" style={{ border: 'none' }}>
                    <table className="sv-table">
                      <thead>
                        <tr>
                          <th>Pickup ID</th>
                          <th>Date &amp; Time</th>
                          <th>Materials</th>
                          <th>Collector</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerPickups.slice(0, 4).map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.id}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12.5px' }}>{item.date || item.scheduledDate || item.requestDate || 'N/A'}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12.5px' }}>{getPickupItems(item).join(', ')}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12.5px', fontWeight: 600 }}>{item.collectorName || 'Unassigned'}</span>
                            </td>
                            <td>
                              <span
                                className={`sv-badge ${
                                  item.status === 'Completed'
                                    ? 'green'
                                    : item.status === 'En Route'
                                    ? 'orange'
                                    : item.status === 'Scheduled'
                                    ? 'blue'
                                    : 'gray'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="sv-btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '12px' }}
                                onClick={() => setSelectedPickupModal(item)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Recent Customer Orders */}
                <div className="sv-card">
                  <div className="sv-card-header">
                    <div className="sv-card-title">Recent Customer Orders</div>
                    <button
                      type="button"
                      onClick={() => handleTabChange('orders')}
                      style={{ fontSize: '13px', color: '#269C26', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      View All Orders &rarr;
                    </button>
                  </div>
                  <div className="sv-table-container" style={{ border: 'none' }}>
                    <table className="sv-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Items</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.slice(0, 4).map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.id}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12.5px' }}>{getOrderItems(item).join(', ')}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>{item.date || 'Recent'}</span>
                            </td>
                            <td>
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>৳ {item.totalAmount || item.total || 0}</span>
                            </td>
                            <td>
                              <span
                                className={`sv-badge ${
                                  item.status === 'Delivered'
                                    ? 'green'
                                    : item.status === 'Shipped'
                                    ? 'blue'
                                    : 'orange'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="sv-btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '12px' }}
                                onClick={() => setSelectedOrderModal(item)}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= TAB 2: MY SCRAP PICKUPS (SECTION 7) ================= */}
          {activeCategory === 'pickups' && (
            <div className="sv-card">
              <div className="sv-card-header">
                <div>
                  <div className="sv-card-title">My Scrap Collection Requests</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    Live tracking, verified weights, assigned collectors, and collection schedules
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {['all', 'scheduled', 'en route', 'completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`sv-date-btn ${pickupFilter === st ? 'active' : ''}`}
                      onClick={() => setPickupFilter(st)}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  ))}
                  <Link to="/book-pickup" className="sv-btn-primary" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
                    + Book Pickup
                  </Link>
                </div>
              </div>

              {filteredPickups.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                    No Pickups Found
                  </p>
                  <p style={{ fontSize: '13px', margin: '0 0 16px' }}>
                    You have no collection requests in this status.
                  </p>
                  <Link to="/book-pickup" className="sv-btn-primary">
                    Book a Pickup Now
                  </Link>
                </div>
              ) : (
                <div className="sv-table-container">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Pickup ID</th>
                        <th>Request Date &amp; Time</th>
                        <th>Scrap Materials</th>
                        <th>Assigned Collector</th>
                        <th>Est. Weight</th>
                        <th>Actual Weight</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPickups.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong style={{ color: '#0f172a' }}>{p.id}</strong>
                          </td>
                          <td>
                            <span>{p.date || p.scheduledDate || p.requestDate || 'N/A'}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {getPickupItems(p).map((it, idx) => (
                                <span key={idx} className="sv-scrap-tag">{it}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p.collectorName || 'Assigning soon...'}</div>
                            {p.collectorPhone && (
                              <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <PhoneIcon size={12} />
                                <span>{p.collectorPhone}</span>
                              </div>
                            )}
                          </td>
                          <td>{p.estimatedWeight || 'N/A'}</td>
                          <td>
                            {p.actualWeight ? (
                              <strong style={{ color: '#269C26' }}>{p.actualWeight}</strong>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>Pending</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`sv-badge ${
                                p.status === 'Completed'
                                  ? 'green'
                                  : p.status === 'En Route'
                                  ? 'orange'
                                  : p.status === 'Scheduled'
                                  ? 'blue'
                                  : 'gray'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="sv-btn-secondary"
                              style={{ padding: '5px 12px', fontSize: '12.5px' }}
                              onClick={() => setSelectedPickupModal(p)}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: SELLING HISTORY (SECTION 6) ================= */}
          {activeCategory === 'selling-history' && (
            <div className="sv-card">
              <div className="sv-card-header">
                <div>
                  <div className="sv-card-title">Scrap Selling History</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    Verified records of weighed scrap items, finalized rates, collector details, and payment receipts
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="button" className="sv-btn-secondary" onClick={handleExportCSV}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Export CSV</span>
                  </button>
                  <Link to="/book-pickup" className="sv-btn-primary" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
                    + New Pickup
                  </Link>
                </div>
              </div>

              {/* Toolbar matching Admin Panel */}
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--sv-admin-border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="sv-search-box" style={{ minWidth: '280px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#94a3b8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Transaction ID, material, collector..."
                    value={historySearch}
                    onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Category Filter */}
                  <select
                    style={{ height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--sv-admin-border)', fontSize: '13px', background: '#ffffff', color: '#334155', fontWeight: 600 }}
                    value={historyCategoryFilter}
                    onChange={(e) => { setHistoryCategoryFilter(e.target.value); setHistoryPage(1); }}
                    aria-label="Filter by Scrap Category"
                  >
                    <option value="all">All Categories</option>
                    <option value="plastic">Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="cardboard">Cardboard</option>
                    <option value="metal">Metal</option>
                    <option value="textile">Textile / RMG</option>
                    <option value="glass">Glass</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    style={{ height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--sv-admin-border)', fontSize: '13px', background: '#ffffff', color: '#334155', fontWeight: 600 }}
                    value={historyStatusFilter}
                    onChange={(e) => { setHistoryStatusFilter(e.target.value); setHistoryPage(1); }}
                    aria-label="Filter by Status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="verified">Verified</option>
                  </select>

                  {/* Date Filter */}
                  <select
                    style={{ height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--sv-admin-border)', fontSize: '13px', background: '#ffffff', color: '#334155', fontWeight: 600 }}
                    value={historyDateFilter}
                    onChange={(e) => { setHistoryDateFilter(e.target.value); setHistoryPage(1); }}
                    aria-label="Filter by Date"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">Past 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>

                  {/* Sort By */}
                  <select
                    style={{ height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--sv-admin-border)', fontSize: '13px', background: '#ffffff', color: '#334155', fontWeight: 600 }}
                    value={historySortBy}
                    onChange={(e) => setHistorySortBy(e.target.value)}
                    aria-label="Sort Transactions"
                  >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="amount-desc">Amount (Highest First)</option>
                    <option value="amount-asc">Amount (Lowest First)</option>
                    <option value="weight-desc">Weight (Heaviest First)</option>
                  </select>
                </div>
              </div>

              {processedSellingHistory.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                    No Selling Transactions Found
                  </p>
                  <p style={{ fontSize: '13px', margin: '0 0 16px' }}>
                    {customerSales.length === 0
                      ? 'You have not completed any scrap sales yet. When a collector weighs and finishes your collection, the verified transaction will appear here.'
                      : 'No transactions match your current search and filter criteria.'}
                  </p>
                  {customerSales.length > 0 ? (
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      onClick={() => {
                        setHistorySearch('');
                        setHistoryCategoryFilter('all');
                        setHistoryStatusFilter('all');
                        setHistoryDateFilter('all');
                      }}
                    >
                      Reset Filters
                    </button>
                  ) : (
                    <Link to="/book-pickup" className="sv-btn-primary">
                      Book a Pickup to Sell Scrap
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="sv-table-container">
                    <table className="sv-table">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Pickup ID</th>
                          <th>Date</th>
                          <th>Category &amp; Material</th>
                          <th>Weighed Amount</th>
                          <th>Unit Rate</th>
                          <th>Total Paid</th>
                          <th>Collector</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSellingHistory.map((txn) => (
                          <tr key={txn.id}>
                            <td>
                              <strong style={{ color: '#0f172a' }}>{txn.id}</strong>
                            </td>
                            <td>
                              <span style={{ color: '#64748b', fontSize: '12px' }}>{txn.pickupId || 'N/A'}</span>
                            </td>
                            <td>{txn.date || txn.completedDate?.split('T')[0] || 'Recent'}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{txn.materialName}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{txn.category}</div>
                            </td>
                            <td>
                              <strong>{txn.collectedWeight} {txn.weightUnit || 'kg'}</strong>
                            </td>
                            <td>৳ {txn.pricePerKg} / kg</td>
                            <td>
                              <strong style={{ color: '#269C26', fontSize: '14px' }}>
                                ৳ {Number(txn.totalAmount || 0).toLocaleString('en-IN')}
                              </strong>
                            </td>
                            <td>{txn.collectorName || 'Collector'}</td>
                            <td>
                              <span className="sv-badge green">{txn.status || 'Verified'}</span>
                            </td>
                            <td>
                              <span className="sv-badge blue">{txn.paymentStatus || 'Paid'}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="sv-btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '12px' }}
                                onClick={() => setSelectedTransactionModal(txn)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Bar */}
                  <div className="sv-customer-pagination">
                    <span>
                      Showing {(historyPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(historyPage * itemsPerPage, processedSellingHistory.length)} of{' '}
                      {processedSellingHistory.length} transactions
                    </span>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="sv-cust-page-btn"
                        disabled={historyPage === 1}
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      >
                        &laquo; Prev
                      </button>

                      {Array.from({ length: totalHistoryPages }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`sv-cust-page-btn ${historyPage === idx + 1 ? 'active' : ''}`}
                          onClick={() => setHistoryPage(idx + 1)}
                        >
                          {idx + 1}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="sv-cust-page-btn"
                        disabled={historyPage === totalHistoryPages}
                        onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                      >
                        Next &raquo;
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= TAB 4: MARKETPLACE ORDERS (SECTION 8) ================= */}
          {activeCategory === 'orders' && (
            <div className="sv-card">
              <div className="sv-card-header">
                <div>
                  <div className="sv-card-title">My Eco Marketplace Orders</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                    Purchases of upcycled, recycled, and sustainable lifestyle goods
                  </div>
                </div>
                <Link to="/marketplace" className="sv-btn-primary" style={{ padding: '6px 14px', fontSize: '12.5px' }}>
                  Browse Marketplace &rarr;
                </Link>
              </div>

              {/* Toolbar */}
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--sv-admin-border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="sv-search-box" style={{ minWidth: '280px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#94a3b8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Order ID or product name..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                <select
                  style={{ height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--sv-admin-border)', fontSize: '13px', background: '#ffffff', color: '#334155', fontWeight: 600 }}
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  aria-label="Filter Orders by Status"
                >
                  <option value="all">All Delivery Statuses</option>
                  <option value="order placed">Order Placed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                    No Marketplace Orders Found
                  </p>
                  <p style={{ fontSize: '13px', margin: '0 0 16px' }}>
                    You have not placed any orders matching this search.
                  </p>
                  <Link to="/marketplace" className="sv-btn-primary">
                    Shop Recycled Goods
                  </Link>
                </div>
              ) : (
                <div className="sv-table-container">
                  <table className="sv-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Ordered Products</th>
                        <th>Date Placed</th>
                        <th>Total Amount</th>
                        <th>Payment Mode</th>
                        <th>Delivery Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td>
                            <strong style={{ color: '#0f172a' }}>{ord.id}</strong>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{getOrderItems(ord).join(', ')}</div>
                          </td>
                          <td>{ord.date || ord.createdAt?.split('T')[0] || 'Recent'}</td>
                          <td>
                            <strong style={{ color: '#0f172a' }}>৳ {ord.totalAmount || ord.total || 0}</strong>
                          </td>
                          <td>{ord.paymentMethod || 'Online'}</td>
                          <td>
                            <span
                              className={`sv-badge ${
                                ord.status === 'Delivered'
                                  ? 'green'
                                  : ord.status === 'Shipped'
                                  ? 'blue'
                                  : 'orange'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="sv-btn-secondary"
                              style={{ padding: '5px 12px', fontSize: '12.5px' }}
                              onClick={() => setSelectedOrderModal(ord)}
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: ACCOUNT SETTINGS (SECTION 9) ================= */}
          {activeCategory === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {/* Profile Information Card */}
              <div className="sv-card">
                <div className="sv-card-header">
                  <div className="sv-card-title">Profile Information</div>
                </div>

                <div className="sv-card-body">
                  {profileSaved && (
                    <div style={{ padding: '10px 14px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircleIcon size={16} />
                      <span>Profile successfully updated!</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileSave}>
                    {/* Avatar Upload */}
                    <div className="sv-form-group">
                      <label className="sv-form-label">Profile Photo</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                        <div
                          className="sv-customer-sidebar-avatar"
                          style={{ width: '48px', height: '48px', fontSize: '18px', background: '#269C26', color: '#ffffff' }}
                        >
                          {profileData.avatar ? (
                            <img src={profileData.avatar} alt="Avatar" />
                          ) : (
                            profileData.name ? profileData.name.charAt(0).toUpperCase() : 'C'
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div className="sv-form-group">
                      <label className="sv-form-label">Full Name / পুরো নাম</label>
                      <input
                        type="text"
                        className="sv-form-input"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="sv-form-group">
                      <label className="sv-form-label">Phone Number / ফোন নম্বর</label>
                      <input
                        type="tel"
                        className="sv-form-input"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="sv-form-group">
                      <label className="sv-form-label">Email Address / ইমেইল</label>
                      <input
                        type="email"
                        className="sv-form-input"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>

                    <div className="sv-form-group">
                      <label className="sv-form-label">Default Pickup Address / ঠিকানা</label>
                      <textarea
                        className="sv-form-input"
                        style={{ height: 'auto', padding: '10px 14px' }}
                        rows="3"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="sv-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Save Changes (পরিবর্তন সেভ করুন)
                    </button>
                  </form>
                </div>
              </div>

              {/* Password & Security Card */}
              <div className="sv-card">
                <div className="sv-card-header">
                  <div className="sv-card-title">Change Password</div>
                </div>

                <div className="sv-card-body">
                  {passMessage.text && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        marginBottom: '16px',
                        background: passMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: passMessage.type === 'success' ? '#15803d' : '#b91c1c',
                        border: passMessage.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      }}
                    >
                      {passMessage.text}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSave}>
                    <div className="sv-form-group">
                      <label className="sv-form-label">Current Password / বর্তমান পাসওয়ার্ড</label>
                      <input
                        type="password"
                        className="sv-form-input"
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
                        className="sv-form-input"
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
                        className="sv-form-input"
                        placeholder="••••••••"
                        value={passData.confirmPass}
                        onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="sv-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', background: '#0f172a' }}
                    >
                      Update Password (পাসওয়ার্ড আপডেট করুন)
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL 1: SELLING TRANSACTION DETAILS ================= */}
      {selectedTransactionModal && (
        <div
          className="sv-customer-modal-backdrop"
          onClick={() => setSelectedTransactionModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="sv-customer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-customer-modal-header">
              <div>
                <h3 className="sv-customer-modal-title">Verified Scrap Transaction</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Ref #{selectedTransactionModal.id}
                </span>
              </div>
              <button
                type="button"
                className="sv-customer-modal-close"
                onClick={() => setSelectedTransactionModal(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="sv-customer-modal-body">
              <div className="sv-modal-grid">
                <div>
                  <span className="sv-modal-label">Pickup Reference</span>
                  <span className="sv-modal-val">{selectedTransactionModal.pickupId || 'N/A'}</span>
                </div>
                <div>
                  <span className="sv-modal-label">Completion Date</span>
                  <span className="sv-modal-val">
                    {selectedTransactionModal.date || selectedTransactionModal.completedDate?.split('T')[0]}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Scrap Category</span>
                  <span className="sv-modal-val">{selectedTransactionModal.category}</span>
                </div>
                <div>
                  <span className="sv-modal-label">Material Name</span>
                  <span className="sv-modal-val">{selectedTransactionModal.materialName}</span>
                </div>
                <div>
                  <span className="sv-modal-label">Scale Weighed Weight</span>
                  <span className="sv-modal-val">
                    {selectedTransactionModal.collectedWeight} {selectedTransactionModal.weightUnit || 'kg'}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Unit Rate</span>
                  <span className="sv-modal-val">৳ {selectedTransactionModal.pricePerKg} / kg</span>
                </div>
                <div
                  className="sv-modal-grid-full"
                  style={{
                    background: '#f0fdf4',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <span className="sv-modal-label">Total Amount Paid to Customer</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#269C26' }}>
                    ৳ {Number(selectedTransactionModal.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Assigned Collector</span>
                  <span className="sv-modal-val">{selectedTransactionModal.collectorName}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                    {selectedTransactionModal.collectorBadge || selectedTransactionModal.collectorPhone}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Payment Status</span>
                  <span className="sv-badge green" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                    {selectedTransactionModal.paymentStatus || 'Paid via bKash'}
                  </span>
                </div>
                <div className="sv-modal-grid-full">
                  <span className="sv-modal-label">Pickup Address</span>
                  <span style={{ fontSize: '13px', color: '#334155' }}>
                    {selectedTransactionModal.address || currentUser.address || 'Dhaka, Bangladesh'}
                  </span>
                </div>
                {selectedTransactionModal.notes && (
                  <div className="sv-modal-grid-full">
                    <span className="sv-modal-label">Scale Verification Notes</span>
                    <span style={{ fontSize: '12.5px', color: '#475569' }}>
                      {selectedTransactionModal.notes}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="sv-btn-primary"
                  onClick={() => setSelectedTransactionModal(null)}
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PICKUP DETAILS & TRACKER ================= */}
      {selectedPickupModal && (
        <div
          className="sv-customer-modal-backdrop"
          onClick={() => setSelectedPickupModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="sv-customer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-customer-modal-header">
              <div>
                <h3 className="sv-customer-modal-title">Pickup Request Inspection</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Booking ID #{selectedPickupModal.id}
                </span>
              </div>
              <button
                type="button"
                className="sv-customer-modal-close"
                onClick={() => setSelectedPickupModal(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="sv-customer-modal-body">
              {/* Status Timeline */}
              <div className="sv-customer-timeline">
                <div className="sv-cust-tl-step completed">
                  <div className="sv-cust-tl-circle">
                    <CheckCircleIcon size={14} />
                  </div>
                  <span className="sv-cust-tl-label">Requested</span>
                </div>
                <div className={`sv-cust-tl-step ${selectedPickupModal.collectorName ? 'completed' : 'active'}`}>
                  <div className="sv-cust-tl-circle">
                    {selectedPickupModal.collectorName ? <CheckCircleIcon size={14} /> : '2'}
                  </div>
                  <span className="sv-cust-tl-label">Assigned</span>
                </div>
                <div className={`sv-cust-tl-step ${['En Route', 'Completed'].includes(selectedPickupModal.status) ? 'completed' : ''}`}>
                  <div className="sv-cust-tl-circle">
                    {['En Route', 'Completed'].includes(selectedPickupModal.status) ? <CheckCircleIcon size={14} /> : '3'}
                  </div>
                  <span className="sv-cust-tl-label">En Route</span>
                </div>
                <div className={`sv-cust-tl-step ${selectedPickupModal.status === 'Completed' ? 'completed' : ''}`}>
                  <div className="sv-cust-tl-circle">
                    {selectedPickupModal.status === 'Completed' ? <CheckCircleIcon size={14} /> : '4'}
                  </div>
                  <span className="sv-cust-tl-label">Completed</span>
                </div>
              </div>

              <div className="sv-modal-grid">
                <div>
                  <span className="sv-modal-label">Scheduled Date &amp; Slot</span>
                  <span className="sv-modal-val">{selectedPickupModal.scheduledDate || selectedPickupModal.date}</span>
                </div>
                <div>
                  <span className="sv-modal-label">Current Status</span>
                  <span className={`sv-badge ${selectedPickupModal.status === 'Completed' ? 'green' : 'orange'}`}>
                    {selectedPickupModal.status}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Estimated Weight</span>
                  <span className="sv-modal-val">{selectedPickupModal.estimatedWeight || 'N/A'}</span>
                </div>
                <div>
                  <span className="sv-modal-label">Actual Measured Weight</span>
                  <span className="sv-modal-val">{selectedPickupModal.actualWeight || 'Pending weigh-in'}</span>
                </div>
                <div className="sv-modal-grid-full">
                  <span className="sv-modal-label">Selected Scrap Materials</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {getPickupItems(selectedPickupModal).map((it, idx) => (
                      <span key={idx} className="sv-scrap-tag">{it}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="sv-modal-label">Assigned Collector</span>
                  <span className="sv-modal-val">{selectedPickupModal.collectorName || 'Assigning soon'}</span>
                  {selectedPickupModal.collectorPhone && (
                    <span style={{ fontSize: '12px', color: '#269C26', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneIcon size={12} />
                      <span>{selectedPickupModal.collectorPhone}</span>
                    </span>
                  )}
                </div>
                <div>
                  <span className="sv-modal-label">Estimated Payout</span>
                  <span className="sv-modal-val" style={{ color: '#269C26' }}>
                    {selectedPickupModal.earnedAmount || 'Pending'}
                  </span>
                </div>
                <div className="sv-modal-grid-full">
                  <span className="sv-modal-label">Pickup Address</span>
                  <span style={{ fontSize: '13px', color: '#334155' }}>
                    {selectedPickupModal.address}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="sv-btn-primary"
                  onClick={() => setSelectedPickupModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: MARKETPLACE ORDER DETAILS ================= */}
      {selectedOrderModal && (
        <div
          className="sv-customer-modal-backdrop"
          onClick={() => setSelectedOrderModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="sv-customer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="sv-customer-modal-header">
              <div>
                <h3 className="sv-customer-modal-title">Marketplace Order Details</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Order #{selectedOrderModal.id}
                </span>
              </div>
              <button
                type="button"
                className="sv-customer-modal-close"
                onClick={() => setSelectedOrderModal(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="sv-customer-modal-body">
              <div className="sv-modal-grid">
                <div>
                  <span className="sv-modal-label">Order Date</span>
                  <span className="sv-modal-val">
                    {selectedOrderModal.date || selectedOrderModal.createdAt?.split('T')[0]}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Delivery Status</span>
                  <span className={`sv-badge ${selectedOrderModal.status === 'Delivered' ? 'green' : 'blue'}`}>
                    {selectedOrderModal.status}
                  </span>
                </div>
                <div className="sv-modal-grid-full">
                  <span className="sv-modal-label">Items Purchased</span>
                  <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {getOrderItems(selectedOrderModal).map((it, idx) => (
                      <span key={idx} style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                        &bull; {it}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="sv-modal-label">Total Amount Paid</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#269C26' }}>
                    ৳ {selectedOrderModal.totalAmount || selectedOrderModal.total || 0}
                  </span>
                </div>
                <div>
                  <span className="sv-modal-label">Payment Method</span>
                  <span className="sv-modal-val">{selectedOrderModal.paymentMethod || 'Online'}</span>
                </div>
                <div className="sv-modal-grid-full">
                  <span className="sv-modal-label">Delivery Destination</span>
                  <span style={{ fontSize: '13px', color: '#334155' }}>
                    {selectedOrderModal.deliveryAddress || currentUser.address || 'Dhaka, Bangladesh'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="sv-btn-primary"
                  onClick={() => setSelectedOrderModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
