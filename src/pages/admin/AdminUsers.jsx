import { useState, useEffect, useRef } from 'react';
import { UsersIcon, BanIcon, CheckCircleIcon } from '../../components/admin/AdminIcons.jsx';
import { getStoredAdminUsers, saveStoredAdminUsers, INITIAL_ADMIN_USERS } from '../../data/adminUsersData.js';

export default function AdminUsers() {
  const [users, setUsers] = useState(() => getStoredAdminUsers());
  const isExternalSyncRef = useRef(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Verified' | 'Suspended'
  const [userToSuspend, setUserToSuspend] = useState(null); // User targeted for 1-month ban

  // Real-time synchronization with background pickups and collector scale completions
  useEffect(() => {
    const handleSync = () => {
      try {
        const latest = getStoredAdminUsers();
        isExternalSyncRef.current = true;
        setUsers(latest);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('sv_users_sync', handleSync);
    window.addEventListener('sv_pickups_sync', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('sv_users_sync', handleSync);
      window.removeEventListener('sv_pickups_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Sync state changes (e.g. bans, unbans) to localStorage
  useEffect(() => {
    if (isExternalSyncRef.current) {
      isExternalSyncRef.current = false;
      return;
    }
    try {
      localStorage.setItem('sv_admin_users_list', JSON.stringify(users));
      // update sv_suspended_users
      const suspended = users
        .filter((u) => u.status === 'Suspended')
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          bannedUntil: u.bannedUntil || Date.now() + 30 * 24 * 60 * 60 * 1000,
        }));
      localStorage.setItem('sv_suspended_users', JSON.stringify(suspended));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Open ban modal
  const handleOpenSuspendModal = (user) => {
    setUserToSuspend(user);
  };

  // Confirm 1-month ban
  const handleConfirmBan = () => {
    if (!userToSuspend) return;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const bannedUntilDate = Date.now() + thirtyDaysMs;
    const expiryStr = new Date(bannedUntilDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userToSuspend.id
          ? {
              ...u,
              status: 'Suspended',
              bannedUntil: bannedUntilDate,
              bannedUntilStr: expiryStr,
              banReason: 'Account suspended for 1 month by administrator.'
            }
          : u
      )
    );

    setUserToSuspend(null);
  };

  // Reactivate / Unban
  const handleReactivate = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'Verified',
              bannedUntil: null,
              bannedUntilStr: null,
              banReason: null
            }
          : u
      )
    );
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Users Management</h1>
          <p>All registered citizen accounts and enterprise recyclers are verified by default. Suspend accounts with 1-month login bans.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Total Users</span>
            <div className="sv-stat-icon-wrap blue"><UsersIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{users.length} Recyclers</div>
          <div className="sv-stat-change">All verified upon registration</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Verified Active</span>
            <div className="sv-stat-icon-wrap green"><CheckCircleIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{users.filter((u) => u.status === 'Verified').length} Accounts</div>
          <div className="sv-stat-change">Full platform access</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Suspended / Banned</span>
            <div className="sv-stat-icon-wrap orange"><BanIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{users.filter((u) => u.status === 'Suspended').length} Suspended</div>
          <div className="sv-stat-change">Login restricted (1-month ban)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sv-card">
        <div className="sv-card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="sv-search-box">
            <input
              type="text"
              placeholder="Search by name, email, phone, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {['All', 'Verified', 'Suspended'].map((st) => (
                <button
                  key={st}
                  type="button"
                  style={{
                    fontSize: '12px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: selectedStatus === st ? '#111827' : 'transparent',
                    color: selectedStatus === st ? '#ffffff' : '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedStatus(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Role Filter */}
            {['All', 'Residential Recycler', 'Commercial Enterprise'].map((role) => (
              <button
                key={role}
                type="button"
                className={`sv-btn-secondary ${selectedRole === role ? 'active-filter' : ''}`}
                style={{
                  fontSize: '12px',
                  padding: '5px 10px',
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
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuspended = user.status === 'Suspended';
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email} • {user.phone}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {user.id}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>{user.role}</span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#475569' }}>{user.area}</td>
                      <td style={{ fontWeight: 700 }}>{user.recycledKg} kg</td>
                      <td style={{ fontWeight: 700, color: '#16a34a' }}>{user.rewards}</td>
                      <td>
                        {isSuspended ? (
                          <span className="sv-badge red">
                            <BanIcon size={12} />
                            <span>Suspended (Banned 1 Mo.)</span>
                          </span>
                        ) : (
                          <span className="sv-badge green">
                            <CheckCircleIcon size={12} />
                            <span>Verified</span>
                          </span>
                        )}
                        {isSuspended && user.bannedUntilStr && (
                          <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '3px' }}>
                            Until: {user.bannedUntilStr}
                          </div>
                        )}
                      </td>
                      <td>
                        {isSuspended ? (
                          <button
                            type="button"
                            className="sv-btn-secondary"
                            style={{ padding: '5px 12px', fontSize: '12px', color: '#16a34a', borderColor: '#86efac' }}
                            onClick={() => handleReactivate(user.id)}
                            title="Restore access to account"
                          >
                            Reactivate / Unban
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sv-btn-danger"
                            onClick={() => handleOpenSuspendModal(user)}
                            title="Ban user from logging in for 1 month"
                          >
                            <BanIcon size={13} />
                            <span>Suspend / Ban</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1-Month Ban Confirmation Modal */}
      {userToSuspend && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
          onClick={() => setUserToSuspend(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '480px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BanIcon size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#111827' }}>
                  Suspend / Ban User Account
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Temporary 1-Month (30 Days) Access Suspension
                </div>
              </div>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{userToSuspend.name}</div>
              <div style={{ color: '#475569' }}>{userToSuspend.email} • {userToSuspend.phone}</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                Account ID: <strong>{userToSuspend.id}</strong>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.55', marginBottom: '18px' }}>
              Are you sure you want to ban this user for <strong>1 month (30 days)</strong>?
              <br />
              <span style={{ fontSize: '12.5px', color: '#64748b', display: 'block', marginTop: '6px' }}>
                ℹ️ The user will still be able to browse the public website, but <strong>cannot log in</strong>,
                book scrap pickups, or place marketplace orders during this suspension period.
              </span>
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="sv-btn-secondary"
                onClick={() => setUserToSuspend(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sv-btn-danger"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={handleConfirmBan}
              >
                <BanIcon size={14} />
                <span>Confirm 1-Month Ban</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
