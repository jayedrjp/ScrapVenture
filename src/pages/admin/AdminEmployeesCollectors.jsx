import { useState, useEffect } from 'react';
import { EmployeesCollectorsIcon, StarIcon, FlameIcon, CheckCircleIcon, UsersIcon } from '../../components/admin/AdminIcons.jsx';

const INITIAL_APPLICATIONS = [
  {
    id: 'APP-501',
    name: 'Md. Al-Amin Sheikh',
    phone: '+880 1722-112233',
    nid: '19922615280004921',
    division: 'Dhaka',
    district: 'Dhaka',
    thana: 'Mirpur',
    vehicle: 'Cargo E-Trike',
    experience: '3+ Years',
    date: '14 Oct 2026',
    status: 'Pending Review',
  },
  {
    id: 'APP-502',
    name: 'Shafiqur Rahman',
    phone: '+880 1815-445566',
    nid: '19882615290001844',
    division: 'Dhaka',
    district: 'Gazipur',
    thana: 'Tongi',
    vehicle: 'Rickshaw Van',
    experience: '1-2 Years',
    date: '13 Oct 2026',
    status: 'Pending Review',
  },
  {
    id: 'APP-503',
    name: 'Kabirul Islam Babu',
    phone: '+880 1914-778899',
    nid: '19952615300003312',
    division: 'Chittagong',
    district: 'Chittagong',
    thana: 'Pahartali',
    vehicle: 'Pickup Truck',
    experience: '5+ Years',
    date: '12 Oct 2026',
    status: 'Pending Review',
  },
];

const INITIAL_REGISTERED = [
  {
    id: 'COL-104',
    name: 'Rafiqul Islam',
    phone: '01819-876543',
    zone: 'Dhaka North (Banani, Gulshan, Uttara)',
    vehicle: 'Motorized Van (ঢাকা মেট্রো-হ ১১-২২৩৩)',
    scaleId: 'DIGI-SC-088',
    completedPickups: 94,
    payout: '৳42,500',
    rating: '4.95',
    status: 'On Duty',
  },
  {
    id: 'COL-001',
    name: 'Md. Faruk Hossain',
    phone: '+880 1718-445566',
    zone: 'Uttara (Sector 1 to 14)',
    vehicle: 'Van-04 (Electric)',
    scaleId: 'DIGI-SC-081',
    completedPickups: 148,
    payout: '৳32,400',
    rating: '4.9',
    status: 'On Duty',
  },
  {
    id: 'COL-002',
    name: 'Shahidul Islam',
    phone: '+880 1812-334455',
    zone: 'Mirpur & Pallabi',
    vehicle: 'Van-12 (Electric)',
    scaleId: 'DIGI-SC-094',
    completedPickups: 112,
    payout: '৳24,500',
    rating: '4.8',
    status: 'On Duty',
  },
  {
    id: 'COL-003',
    name: 'Jasim Uddin',
    phone: '+880 1911-667788',
    zone: 'Gulshan & Banani',
    vehicle: 'E-Trike 02',
    scaleId: 'DIGI-SC-102',
    completedPickups: 94,
    payout: '৳21,100',
    rating: '4.9',
    status: 'Available',
  },
  {
    id: 'COL-004',
    name: 'Anwar Ali',
    phone: '+880 1612-889900',
    zone: 'Dhanmondi & Mohammadpur',
    vehicle: 'Van-07 (Electric)',
    scaleId: 'DIGI-SC-073',
    completedPickups: 82,
    payout: '৳17,800',
    rating: '4.7',
    status: 'Available',
  },
];

export default function AdminEmployeesCollectors() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'registered'

  // Load applications from localStorage + initial
  const [applications, setApplications] = useState(() => {
    try {
      const liveApps = JSON.parse(localStorage.getItem('sv_collector_applications') || '[]');
      const pendingLive = liveApps
        .filter((a) => a.status === 'pending')
        .map((a) => ({
          id: a.id,
          name: a.name,
          phone: a.phone,
          nid: a.nid || 'Verified by Citizen Phone',
          division: a.division || 'Dhaka',
          district: a.district || 'Dhaka',
          thana: a.thana || 'Central',
          vehicle: a.vehicle || 'Motorized Van',
          experience: a.experience || 'Experienced',
          date: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent',
          status: 'Pending Review',
        }));
      const merged = [...pendingLive, ...INITIAL_APPLICATIONS];
      return Array.from(new Map(merged.map((m) => [m.id, m])).values());
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Load registered collectors
  const [registered, setRegistered] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_registered_collectors_admin');
      if (saved) return JSON.parse(saved);
      return INITIAL_REGISTERED;
    } catch {
      return INITIAL_REGISTERED;
    }
  });

  // Fire modal target
  const [collectorToFire, setCollectorToFire] = useState(null);
  const [fireReason, setFireReason] = useState('Repeated route non-compliance');

  // Save registered collectors to localStorage
  const saveRegistered = (newList) => {
    setRegistered(newList);
    try {
      localStorage.setItem('sv_registered_collectors_admin', JSON.stringify(newList));
      // Sync fired collectors list for Auth blocking
      const fired = newList
        .filter((c) => c.status === 'Terminated')
        .map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          firedAt: new Date().toISOString(),
          reason: c.fireReason || 'Terminated by admin',
        }));
      localStorage.setItem('sv_fired_collectors', JSON.stringify(fired));
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = (app) => {
    const newCollector = {
      id: `COL-00${registered.length + 1}`,
      name: app.name,
      phone: app.phone,
      zone: `${app.thana}, ${app.district}`,
      vehicle: app.vehicle,
      scaleId: `DIGI-SC-${110 + registered.length}`,
      completedPickups: 0,
      payout: '৳0',
      rating: '5.0 (New)',
      status: 'Available',
    };

    const updatedReg = [newCollector, ...registered];
    saveRegistered(updatedReg);
    setApplications(applications.filter((a) => a.id !== app.id));

    // Also update sv_collector_applications in localStorage if it was a user submission
    try {
      const liveApps = JSON.parse(localStorage.getItem('sv_collector_applications') || '[]');
      const updatedApps = liveApps.map((a) => (a.id === app.id ? { ...a, status: 'approved' } : a));
      localStorage.setItem('sv_collector_applications', JSON.stringify(updatedApps));
    } catch (e) {
      console.error(e);
    }

    alert(`Application for ${app.name} has been approved! Assigned ID: ${newCollector.id}`);
  };

  const handleReject = (id, name) => {
    if (window.confirm(`Are you sure you want to reject the application for ${name}?`)) {
      setApplications(applications.filter((a) => a.id !== id));
      try {
        const liveApps = JSON.parse(localStorage.getItem('sv_collector_applications') || '[]');
        const updatedApps = liveApps.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a));
        localStorage.setItem('sv_collector_applications', JSON.stringify(updatedApps));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Open Fire Modal
  const handleOpenFireModal = (col) => {
    setCollectorToFire(col);
    setFireReason('Performance / Conduct policy violation');
  };

  // Confirm Fire / Terminate
  const handleConfirmFire = () => {
    if (!collectorToFire) return;

    const updated = registered.map((col) => {
      if (col.id === collectorToFire.id) {
        return {
          ...col,
          status: 'Terminated',
          fireReason: fireReason,
          terminatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
      }
      return col;
    });

    saveRegistered(updated);
    setCollectorToFire(null);
  };

  // Rehire / Reactivate Fired Collector
  const handleRehireCollector = (id) => {
    const updated = registered.map((col) => {
      if (col.id === id) {
        return {
          ...col,
          status: 'Available',
          fireReason: null,
          terminatedDate: null,
        };
      }
      return col;
    });
    saveRegistered(updated);
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Employees & Collectors</h1>
          <p>Review collector applications, onboard scrap champions, manage field personnel, and execute termination actions.</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Pending Applications</span>
            <div className="sv-stat-icon-wrap orange"><EmployeesCollectorsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{applications.length} Applicants</div>
          <div className="sv-stat-change">Awaiting KYC & verification</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Active Field Fleet</span>
            <div className="sv-stat-icon-wrap green"><CheckCircleIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">
            {registered.filter((c) => c.status !== 'Terminated').length} Active
          </div>
          <div className="sv-stat-change">Equipped with calibrated scales</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Terminated / Fired</span>
            <div className="sv-stat-icon-wrap blue" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <FlameIcon size={16} />
            </div>
          </div>
          <div className="sv-stat-value" style={{ color: '#dc2626' }}>
            {registered.filter((c) => c.status === 'Terminated').length} Dismissed
          </div>
          <div className="sv-stat-change">Barred from collector portal</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sv-card">
        <div className="sv-card-header" style={{ paddingBottom: '0', borderBottom: 'none' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="sv-btn-secondary"
              style={{
                borderRadius: '8px 8px 0 0',
                borderBottom: activeTab === 'applications' ? '2px solid #f97316' : '1px solid #e2e8f0',
                background: activeTab === 'applications' ? '#ffffff' : '#f8fafc',
                color: activeTab === 'applications' ? '#f97316' : '#64748b',
                fontWeight: 700,
              }}
              onClick={() => setActiveTab('applications')}
            >
              Collector Applications ({applications.length})
            </button>
            <button
              type="button"
              className="sv-btn-secondary"
              style={{
                borderRadius: '8px 8px 0 0',
                borderBottom: activeTab === 'registered' ? '2px solid #f97316' : '1px solid #e2e8f0',
                background: activeTab === 'registered' ? '#ffffff' : '#f8fafc',
                color: activeTab === 'registered' ? '#f97316' : '#64748b',
                fontWeight: 700,
              }}
              onClick={() => setActiveTab('registered')}
            >
              Registered Field Collectors ({registered.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Applications */}
        {activeTab === 'applications' && (
          <div className="sv-table-container" style={{ border: 'none', borderTop: '1px solid #e2e8f0' }}>
            {applications.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                All pending collector applications have been reviewed.
              </div>
            ) : (
              <table className="sv-table">
                <thead>
                  <tr>
                    <th>Applicant Details</th>
                    <th>NID & Verification</th>
                    <th>Zone & District</th>
                    <th>Vehicle & Experience</th>
                    <th>Applied Date</th>
                    <th>Action Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{app.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{app.phone}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {app.id}</div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '12.5px' }}>{app.nid}</span>
                        <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>NID Document Verified</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.thana}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>{app.district}, {app.division}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{app.vehicle}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>Exp: {app.experience}</div>
                      </td>
                      <td style={{ fontSize: '12.5px', color: '#64748b' }}>{app.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="sv-btn-primary"
                            style={{ padding: '5px 12px', fontSize: '12px', background: '#16a34a' }}
                            onClick={() => handleApprove(app)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="sv-btn-secondary"
                            style={{ padding: '5px 12px', fontSize: '12px', color: '#dc2626' }}
                            onClick={() => handleReject(app.id, app.name)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Registered Collectors with Fire Option */}
        {activeTab === 'registered' && (
          <div className="sv-table-container" style={{ border: 'none', borderTop: '1px solid #e2e8f0' }}>
            <table className="sv-table">
              <thead>
                <tr>
                  <th>Collector ID & Name</th>
                  <th>Operating Zone</th>
                  <th>Vehicle & Scale ID</th>
                  <th>Completed Pickups</th>
                  <th>Total Payout</th>
                  <th>Customer Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {registered.map((col) => {
                  const isTerminated = col.status === 'Terminated';
                  return (
                    <tr key={col.id} style={{ background: isTerminated ? '#fff5f5' : 'transparent' }}>
                      <td>
                        <div style={{ fontWeight: 700, color: isTerminated ? '#991b1b' : '#0f172a' }}>
                          {col.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>{col.id} • {col.phone}</div>
                        {isTerminated && col.terminatedDate && (
                          <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                            Dismissed: {col.terminatedDate}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: '#334155' }}>{col.zone}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{col.vehicle}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Scale: {col.scaleId}</div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{col.completedPickups} Doorsteps</td>
                      <td style={{ fontWeight: 700, color: '#16a34a' }}>{col.payout}</td>
                      <td style={{ fontWeight: 700, color: '#f59e0b' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <StarIcon size={13} fill="#f59e0b" />
                          <span>{col.rating}</span>
                        </span>
                      </td>
                      <td>
                        {isTerminated ? (
                          <span className="sv-badge red">
                            <FlameIcon size={12} />
                            <span>Terminated / Fired</span>
                          </span>
                        ) : (
                          <span className={`sv-badge ${col.status === 'On Duty' ? 'orange' : 'green'}`}>
                            {col.status}
                          </span>
                        )}
                      </td>
                      <td>
                        {isTerminated ? (
                          <button
                            type="button"
                            className="sv-btn-secondary"
                            style={{ padding: '5px 12px', fontSize: '12px', color: '#16a34a', borderColor: '#86efac' }}
                            onClick={() => handleRehireCollector(col.id)}
                            title="Rehire collector and restore portal access"
                          >
                            Rehire / Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sv-btn-danger"
                            onClick={() => handleOpenFireModal(col)}
                            title="Fire collector from ScrapVenture employment"
                          >
                            <FlameIcon size={13} />
                            <span>Fire Collector</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fire Collector Confirmation Modal */}
      {collectorToFire && (
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
          onClick={() => setCollectorToFire(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '480px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
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
                <FlameIcon size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#111827' }}>
                  Terminate / Fire Collector
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Employment Dismissal Action
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
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{collectorToFire.name}</div>
              <div style={{ color: '#475569' }}>
                ID: <strong>{collectorToFire.id}</strong> • Phone: {collectorToFire.phone}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                Assigned Zone: {collectorToFire.zone}
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.55', marginBottom: '14px' }}>
              Are you sure you want to fire <strong>{collectorToFire.name}</strong> from their job?
              <br />
              <span style={{ fontSize: '12.5px', color: '#dc2626', display: 'block', marginTop: '6px' }}>
                ⚠️ They will be immediately blocked from logging into the Collector Portal and will not receive any scrap pickup assignments.
              </span>
            </p>

            <div className="sv-form-group" style={{ marginBottom: '18px' }}>
              <label className="sv-form-label">Termination Reason / Note</label>
              <select
                className="sv-form-input"
                value={fireReason}
                onChange={(e) => setFireReason(e.target.value)}
              >
                <option value="Performance / Conduct policy violation">Performance / Conduct policy violation</option>
                <option value="Digital scale tampering / weight mismatch">Digital scale tampering / weight mismatch</option>
                <option value="Customer complaint / unpunctuality">Customer complaint / unpunctuality</option>
                <option value="Voluntary resignation / Inactivity">Voluntary resignation / Inactivity</option>
                <option value="Administrative restructuring">Administrative restructuring</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="sv-btn-secondary"
                onClick={() => setCollectorToFire(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sv-btn-danger"
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={handleConfirmFire}
              >
                <FlameIcon size={14} />
                <span>Confirm Firing / Terminate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
