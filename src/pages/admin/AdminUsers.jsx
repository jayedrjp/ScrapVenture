import { useState } from 'react';
import { UsersIcon } from '../../components/admin/AdminIcons.jsx';

const INITIAL_USERS = [
  { id: 'USR-101', name: 'Tanvir Hossain', email: 'tanvir.eco@gmail.com', phone: '+880 1711-234567', area: 'Uttara, Dhaka', role: 'Residential Recycler', recycledKg: 184, rewards: '৳3,240', status: 'Active' },
  { id: 'USR-102', name: 'Nusrat Jahan', email: 'nusrat.jahan@gmail.com', phone: '+880 1819-876543', area: 'Dhanmondi, Dhaka', role: 'Residential Recycler', recycledKg: 92, rewards: '৳1,650', status: 'Active' },
  { id: 'USR-103', name: 'Apex Green Ventures Ltd.', email: 'admin@apexgreen.com', phone: '+880 1912-345678', area: 'Tejgaon I/A, Dhaka', role: 'Commercial Enterprise', recycledKg: 2450, rewards: '৳48,500', status: 'Verified' },
  { id: 'USR-104', name: 'Milestone Eco Club', email: 'eco@milestoneschool.edu.bd', phone: '+880 1611-987654', area: 'Uttara, Dhaka', role: 'Educational Institute', recycledKg: 3890, rewards: '৳68,200', status: 'Verified' },
  { id: 'USR-105', name: 'Dr. Rafiqul Islam', email: 'rafiqul.uits@gmail.com', phone: '+880 1715-456789', area: 'Baridhara, Dhaka', role: 'Residential Recycler', recycledKg: 64, rewards: '৳1,120', status: 'Active' },
  { id: 'USR-106', name: 'Sabbir Ahmed', email: 'sabbir.ahmed99@yahoo.com', phone: '+880 1511-223344', area: 'Mirpur 10, Dhaka', role: 'Residential Recycler', recycledKg: 38, rewards: '৳640', status: 'Pending Verification' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Users Management</h1>
          <p>Manage registered recyclers, enterprise partners, and citizen accounts.</p>
        </div>
        <div className="sv-page-actions">
          <button
            type="button"
            className="sv-btn-primary"
            onClick={() => alert('New User Invitation Modal')}
          >
            <UsersIcon size={16} />
            <span>+ Invite New User</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Registered</span>
            <div className="sv-stat-icon-wrap blue"><UsersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{users.length * 240 + 12}</div>
          <div className="sv-stat-change">+18 this week</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Verified Enterprises</span>
            <div className="sv-stat-icon-wrap green"><UsersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">48 Partners</div>
          <div className="sv-stat-change">100% compliant</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Diverted Volume</span>
            <div className="sv-stat-icon-wrap orange"><UsersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">6,718 kg</div>
          <div className="sv-stat-change">Recorded via app</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-search-box">
            <input
              type="text"
              placeholder="Search by name, email, phone, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Residential Recycler', 'Commercial Enterprise', 'Educational Institute'].map((role) => (
              <button
                key={role}
                type="button"
                className={`sv-btn-secondary ${selectedRole === role ? 'active-filter' : ''}`}
                style={{
                  fontSize: '12.5px',
                  padding: '6px 12px',
                  background: selectedRole === role ? '#111827' : '#ffffff',
                  color: selectedRole === role ? '#ffffff' : '#334155',
                }}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role & Account Type</th>
                <th>Location</th>
                <th>Scrap Recycled</th>
                <th>Rewards Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email} • {user.phone}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>{user.role}</span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#475569' }}>{user.area}</td>
                  <td style={{ fontWeight: 700 }}>{user.recycledKg} kg</td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>{user.rewards}</td>
                  <td>
                    <span
                      className={`sv-badge ${
                        user.status === 'Active' || user.status === 'Verified' ? 'green' : 'orange'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="sv-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => toggleStatus(user.id)}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
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

