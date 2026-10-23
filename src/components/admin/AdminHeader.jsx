import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { ADMIN_NAV_ITEMS } from './AdminSidebar.jsx';
import { MenuIcon, ExternalLinkIcon, BellIcon } from './AdminIcons.jsx';

export default function AdminHeader({ onOpenMobile }) {
  const location = useLocation();
  const { adminUser } = useAdminAuth();

  // Find matching menu item for breadcrumbs
  const currentItem =
    location.pathname === '/admin/settings'
      ? { name: 'Settings' }
      : ADMIN_NAV_ITEMS.find(
          (item) =>
            location.pathname === item.path ||
            (item.path !== '/admin/dashboard' &&
              location.pathname.startsWith(item.path))
        ) || { name: 'Overview' };

  return (
    <header className="sv-admin-header">
      {/* Left: Mobile hamburger trigger + Breadcrumb */}
      <div className="sv-header-left">
        <button
          type="button"
          className="sv-mobile-menu-trigger"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
        >
          <MenuIcon size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="sv-header-breadcrumbs">
          <span className="sv-breadcrumb-root">Admin Portal</span>
          <span className="sv-breadcrumb-separator">/</span>
          <span className="sv-breadcrumb-current">{currentItem.name}</span>
        </nav>
      </div>

      {/* Right: View public site + Notifications + User chip */}
      <div className="sv-header-right">
        {/* Link back to public site */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="sv-header-site-btn"
          title="Open live public website in new tab"
        >
          <span>View Site</span>
          <ExternalLinkIcon size={14} />
        </Link>

        {/* User profile chip */}
        <div className="sv-header-user-badge">
          <img
            src={adminUser?.avatar || '/assets/team/founder-ceo-motaleb-emon.jpg'}
            alt={adminUser?.name || 'Admin'}
            className="sv-header-user-avatar"
          />
          <div className="sv-header-user-info">
            <span className="sv-header-user-name">
              {adminUser?.name || 'Administrator'}
            </span>
            <span className="sv-header-user-role">
              {adminUser?.role || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

