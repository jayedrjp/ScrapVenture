import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  DashboardIcon,
  UsersIcon,
  OrdersIcon,
  MarketplaceIcon,
  ScrapPickupIcon,
  EmployeesCollectorsIcon,
  TeamMembersIcon,
  BlogsIcon,
  AwardsIcon,
  CampaignsIcon,
  SettingsIcon,
  LogoutIcon,
  CloseIcon,
} from './AdminIcons.jsx';

/**
 * EXACT SEQUENCE of menu items as specified:
 * 1. Dashboard
 * 2. Users
 * 3. Orders
 * 4. Marketplace
 * 5. Scrap Pickup
 * 6. Employees / Collectors
 * 7. Team Members
 * 8. Blogs
 * 9. Awards
 * 10. Campaigns
 * [Divider]
 * Settings
 * Logout
 */
export const ADMIN_NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    description: 'Overview of business statistics and recent activities',
    icon: DashboardIcon,
  },
  {
    name: 'Users',
    path: '/admin/users',
    description: 'Manage registered users and view their information',
    icon: UsersIcon,
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    description: 'Manage customer orders and order statuses',
    icon: OrdersIcon,
  },
  {
    name: 'Marketplace',
    path: '/admin/marketplace',
    description: 'Manage marketplace listings and scrap products',
    icon: MarketplaceIcon,
  },
  {
    name: 'Scrap Pickup',
    path: '/admin/scrap-pickup',
    description: 'View pickup requests, assign collectors, and manage pickup statuses',
    icon: ScrapPickupIcon,
  },
  {
    name: 'Employees / Collectors',
    path: '/admin/employees-collectors',
    description: 'Review collector applications, approve or reject applicants, and manage registered collectors',
    icon: EmployeesCollectorsIcon,
  },
  {
    name: 'Team Members',
    path: '/admin/team-members',
    description: 'Manage company owners, employees, names, designations, and profile images',
    icon: TeamMembersIcon,
  },
  {
    name: 'Blogs',
    path: '/admin/blogs',
    description: 'Dynamically create, edit, publish, and delete company blog posts',
    icon: BlogsIcon,
  },
  {
    name: 'Awards',
    path: '/admin/awards',
    description: 'Dynamically manage company awards, certificates, and recognition',
    icon: AwardsIcon,
  },
  {
    name: 'Campaigns',
    path: '/admin/campaigns',
    description: 'Manage campaign information, images, and clickable destination URLs',
    icon: CampaignsIcon,
  },
];

export default function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
    if (onCloseMobile) onCloseMobile();
  };

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sv-sidebar-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* Main Sidebar */}
      <aside
        className={`sv-admin-sidebar ${
          mobileOpen ? 'mobile-open' : ''
        }`}
        aria-label="Admin Navigation"
      >
        {/* Brand Header */}
        <div className="sv-sidebar-brand-header">
          <Link
            to="/admin/dashboard"
            className="sv-sidebar-brand-link"
            onClick={handleNavClick}
            title="Scrap Venture Admin"
          >
            <img
              src="/assets/images/logo.png"
              alt="Scrap Venture"
              className="sv-sidebar-brand-logo-img"
            />
            <div className="sv-sidebar-brand-meta">
              <span className="sv-sidebar-brand-title">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              type="button"
              className="sv-sidebar-mobile-close-btn"
              onClick={onCloseMobile}
              aria-label="Close mobile sidebar"
            >
              <CloseIcon size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items (Exact Sequence: 1 to 10) */}
        <nav className="sv-sidebar-nav-container">
          <ul className="sv-sidebar-nav-list" role="menu">
            {ADMIN_NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              // Check active route or child route
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/admin/dashboard' &&
                  location.pathname.startsWith(item.path));

              return (
                <li
                  key={item.name}
                  className="sv-sidebar-tooltip"
                  data-tooltip={item.name}
                  role="none"
                >
                  <Link
                    to={item.path}
                    className={`sv-sidebar-item-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    title={item.name}
                  >
                    <span className="sv-sidebar-item-icon">
                      <IconComponent size={19} />
                    </span>
                    <span className="sv-sidebar-item-label">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Subtle Divider between main items and bottom items */}
        <div className="sv-sidebar-divider" role="separator" />

        {/* Bottom Section: Settings & Logout */}
        <div className="sv-sidebar-footer">
          {/* Settings */}
          <div
            className="sv-sidebar-tooltip"
            data-tooltip="Settings"
            role="none"
          >
            <Link
              to="/admin/settings"
              className={`sv-sidebar-item-link ${
                location.pathname === '/admin/settings' ? 'active' : ''
              }`}
              onClick={handleNavClick}
              role="menuitem"
              aria-current={location.pathname === '/admin/settings' ? 'page' : undefined}
              title="Settings"
            >
              <span className="sv-sidebar-item-icon">
                <SettingsIcon size={19} />
              </span>
              <span className="sv-sidebar-item-label">Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <div
            className="sv-sidebar-tooltip"
            data-tooltip="Logout"
            role="none"
          >
            <button
              type="button"
              className="sv-sidebar-item-btn logout-btn"
              onClick={handleLogout}
              role="menuitem"
              title="Logout"
            >
              <span className="sv-sidebar-item-icon">
                <LogoutIcon size={19} />
              </span>
              <span className="sv-sidebar-item-label">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

