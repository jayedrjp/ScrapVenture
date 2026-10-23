import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import './admin.css';

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer whenever location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="sv-admin-layout">
      {/* Persistent Left Sidebar Navigation */}
      <AdminSidebar
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

