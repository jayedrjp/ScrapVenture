import { useState } from 'react';
import { OrdersIcon } from '../../components/admin/AdminIcons.jsx';

const INITIAL_ORDERS = [
  {
    id: 'ORD-701',
    date: '14 Oct 2026, 04:15 PM',
    customer: 'Rifat Chowdhury',
    phone: '+880 1711-908123',
    address: 'House 42, Road 11, Sector 4, Uttara',
    items: 'EcoWeave Upcycled Denim Tote Bag (x2)',
    total: '৳1,700',
    payment: 'bKash (Paid)',
    status: 'Shipped',
  },
  {
    id: 'ORD-702',
    date: '14 Oct 2026, 01:40 PM',
    customer: 'Nusrat Jahan',
    phone: '+880 1819-543210',
    address: 'Apartment 5B, Green Road, Dhanmondi',
    items: 'Circular HDPE Architectural Board (x1)',
    total: '৳2,400',
    payment: 'Nagad (Paid)',
    status: 'Processing',
  },
  {
    id: 'ORD-703',
    date: '13 Oct 2026, 06:20 PM',
    customer: 'Apex Eco Corp',
    phone: '+880 1912-887766',
    address: 'Plot 18, Tejgaon Industrial Area',
    items: '100% Recycled Heavy-Duty Park Bench (x2)',
    total: '৳13,000',
    payment: 'Bank Transfer (Paid)',
    status: 'Delivered',
  },
  {
    id: 'ORD-704',
    date: '13 Oct 2026, 11:10 AM',
    customer: 'Sabbir Hossain',
    phone: '+880 1511-334455',
    address: 'Block D, Mirpur 12',
    items: 'Upcycled Planter Flower Tub (x3)',
    total: '৳1,350',
    payment: 'Cash on Delivery',
    status: 'Delivered',
  },
  {
    id: 'ORD-705',
    date: '12 Oct 2026, 09:30 AM',
    customer: 'Tasneem Akter',
    phone: '+880 1611-667788',
    address: 'Road 5, Banani',
    items: 'Eco-Artisan Recycled Plastic Dining Table (x1)',
    total: '৳4,800',
    payment: 'bKash (Paid)',
    status: 'Processing',
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.toLowerCase().includes(search.toLowerCase()) ||
      ord.items.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || ord.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Customer Orders</h1>
          <p>Monitor sustainable product purchases, fulfillment progress, and payouts.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Orders</span>
            <div className="sv-stat-icon-wrap blue"><OrdersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">184 Placed</div>
          <div className="sv-stat-change">৳2,18,500 Gross Value</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Pending Fulfillment</span>
            <div className="sv-stat-icon-wrap orange"><OrdersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">6 Orders</div>
          <div className="sv-stat-change">Requires warehouse packing</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Completed Deliveries</span>
            <div className="sv-stat-icon-wrap green"><OrdersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">178 Delivered</div>
          <div className="sv-stat-change">99.1% on-time delivery</div>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-search-box">
            <input
              type="text"
              placeholder="Search by Order ID, customer, item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Processing', 'Shipped', 'Delivered'].map((status) => (
              <button
                key={status}
                type="button"
                className="sv-btn-secondary"
                style={{
                  fontSize: '12.5px',
                  padding: '6px 12px',
                  background: filterStatus === status ? '#111827' : '#ffffff',
                  color: filterStatus === status ? '#ffffff' : '#334155',
                }}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer & Address</th>
                <th>Products Purchased</th>
                <th>Total & Payment</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{ord.id}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{ord.date}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ord.customer}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{ord.phone}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{ord.address}</div>
                  </td>
                  <td style={{ fontSize: '13px', maxWidth: '280px' }}>{ord.items}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#16a34a' }}>{ord.total}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{ord.payment}</div>
                  </td>
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
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        fontFamily: 'inherit',
                        background: '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

