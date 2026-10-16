import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import './admin.css';

const COLLAPSED_STORAGE_KEY = 'scrapventure_admin_sidebar_collapsed';

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle collapse and save preference
  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Close mobile drawer whenever location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="sv-admin-layout">
      {/* Persistent Left Sidebar Navigation */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="sv-admin-main-wrapper">
        <AdminHeader onOpenMobile={() => setMobileOpen(true)} />
        <main className="sv-admin-page-content" id="adminMainContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

