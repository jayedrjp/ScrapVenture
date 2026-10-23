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
<<<<<<< HEAD
=======
  CollapseLeftIcon,
  CollapseRightIcon,
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
=======
  collapsed = false,
  onToggleCollapse,
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
        className={`sv-admin-sidebar ${
=======
        className={`sv-admin-sidebar ${collapsed ? 'collapsed' : ''} ${
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
                Admin Panel
              </span>
            </div>
          </Link>

=======
                Scrap Venture
              </span>
              <span className="sv-sidebar-brand-badge">Admin Panel</span>
            </div>
          </Link>

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              className="sv-sidebar-desktop-collapse-btn"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <CollapseRightIcon size={16} />
              ) : (
                <CollapseLeftIcon size={16} />
              )}
            </button>
          )}

>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
                    title={item.name}
=======
                    title={collapsed ? item.name : undefined}
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
              title="Settings"
=======
              title={collapsed ? 'Settings' : undefined}
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
              title="Logout"
=======
              title={collapsed ? 'Logout' : undefined}
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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

