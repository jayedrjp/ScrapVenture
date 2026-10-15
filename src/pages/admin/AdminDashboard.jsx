import { Link } from 'react-router-dom';
import {
  ScrapPickupIcon,
  OrdersIcon,
  UsersIcon,
  EmployeesCollectorsIcon,
  MarketplaceIcon,
} from '../../components/admin/AdminIcons.jsx';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Scrap Diverted',
      value: '21.7+ Tons',
      change: '+14.2% this month',
      iconClass: 'green',
      icon: ScrapPickupIcon,
    },
    {
      label: 'Cash Distributed',
      value: '৳3,80,000+',
      change: '+৳45,000 direct payout',
      iconClass: 'orange',
      icon: OrdersIcon,
    },
    {
      label: 'Registered Recyclers',
      value: '1,420 Users',
      change: '+68 new signups',
      iconClass: 'blue',
      icon: UsersIcon,
    },
    {
      label: 'Active Collectors',
      value: '28 Field Agents',
      change: '5 pending review',
      iconClass: 'purple',
      icon: EmployeesCollectorsIcon,
    },
  ];

  const recentPickups = [
    { id: 'PK-8921', client: 'Tanvir Ahmed', area: 'Uttara Sector 11', type: 'Paper & Cardboard (45kg)', status: 'Assigned', time: 'Today, 2:30 PM' },
    { id: 'PK-8920', client: 'Green Leaf Cafe', area: 'Banani Block C', type: 'Plastic Bottles (18kg)', status: 'Pending', time: 'Today, 3:15 PM' },
    { id: 'PK-8919', client: 'Farzana Huq', area: 'Mirpur DOHS', type: 'E-Waste & Appliances', status: 'In Transit', time: 'Today, 11:00 AM' },
    { id: 'PK-8918', client: 'Milestone School', area: 'Uttara', type: 'Bulk Cardboard (120kg)', status: 'Completed', time: 'Yesterday' },
  ];

  const recentOrders = [
    { id: 'ORD-5401', customer: 'Rifat Chowdhury', item: 'EcoWeave Denim Tote Bag (x2)', total: '৳1,700', status: 'Shipped' },
    { id: 'ORD-5400', customer: 'Nusrat Jahan', item: 'HDPE Architectural Board (x1)', total: '৳2,400', status: 'Processing' },
    { id: 'ORD-5399', customer: 'Apex Eco Corp', item: 'Recycled Park Bench', total: '৳6,500', status: 'Delivered' },
    { id: 'ORD-5398', customer: 'Sabbir Hossain', item: 'Upcycled Planter Tub (x3)', total: '৳1,350', status: 'Delivered' },
  ];

  return (
    <div>
      {/* Page Title & Actions */}
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Dashboard Overview</h1>
          <p>Real-time operational metrics, field activities, and marketplace commerce.</p>
        </div>
        <div className="sv-page-actions">
          <Link to="/admin/scrap-pickup" className="sv-btn-primary">
            <ScrapPickupIcon size={16} />
            <span>Manage Pickups</span>
          </Link>
          <Link to="/admin/marketplace" className="sv-btn-secondary">
            <MarketplaceIcon size={16} />
            <span>Manage Catalog</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="sv-stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="sv-stat-card">
              <div className="sv-stat-header">
                <span className="sv-stat-label">{stat.label}</span>
                <div className={`sv-stat-icon-wrap ${stat.iconClass}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="sv-stat-value">{stat.value}</div>
              <div className="sv-stat-change">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* 2 Column Operations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Left: Recent Pickup Requests */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div className="sv-card-title">Recent Scrap Pickup Requests</div>
            <Link to="/admin/scrap-pickup" style={{ fontSize: '13px', color: '#f97316', fontWeight: 600 }}>
              View All Pickups →
            </Link>
          </div>
          <div className="sv-table-container" style={{ border: 'none' }}>
            <table className="sv-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Customer & Area</th>
                  <th>Materials</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPickups.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.id}</span>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.time}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.client}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.area}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px' }}>{item.type}</span>
                    </td>
                    <td>
                      <span
                        className={`sv-badge ${
                          item.status === 'Completed'
                            ? 'green'
                            : item.status === 'Assigned'
                            ? 'blue'
                            : item.status === 'In Transit'
                            ? 'orange'
                            : 'gray'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Marketplace Orders */}
        <div className="sv-card">
          <div className="sv-card-header">
            <div className="sv-card-title">Recent Customer Orders</div>
            <Link to="/admin/orders" style={{ fontSize: '13px', color: '#f97316', fontWeight: 600 }}>
              View All Orders →
            </Link>
          </div>
          <div className="sv-table-container" style={{ border: 'none' }}>
            <table className="sv-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700 }}>{order.id}</td>
                    <td style={{ fontWeight: 600 }}>{order.customer}</td>
                    <td style={{ fontSize: '12.5px' }}>{order.item}</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{order.total}</td>
                    <td>
                      <span
                        className={`sv-badge ${
                          order.status === 'Delivered'
                            ? 'green'
                            : order.status === 'Shipped'
                            ? 'blue'
                            : 'orange'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

