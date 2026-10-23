import { useState } from 'react';
<<<<<<< HEAD
import { EmployeesCollectorsIcon, StarIcon } from '../../components/admin/AdminIcons.jsx';
=======
import { EmployeesCollectorsIcon } from '../../components/admin/AdminIcons.jsx';
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957

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
    id: 'COL-001',
    name: 'Md. Faruk Hossain',
    phone: '+880 1718-445566',
    zone: 'Uttara (Sector 1 to 14)',
    vehicle: 'Van-04 (Electric)',
    scaleId: 'DIGI-SC-081',
    completedPickups: 148,
    payout: '৳32,400',
<<<<<<< HEAD
    rating: '4.9',
=======
    rating: '4.9 ★',
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
    rating: '4.8',
=======
    rating: '4.8 ★',
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
    rating: '4.9',
=======
    rating: '4.9 ★',
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
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
<<<<<<< HEAD
    rating: '4.7',
=======
    rating: '4.7 ★',
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
    status: 'Available',
  },
];

export default function AdminEmployeesCollectors() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'registered'
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [registered, setRegistered] = useState(INITIAL_REGISTERED);

  const handleApprove = (app) => {
    // Add to registered
    const newCollector = {
      id: `COL-00${registered.length + 1}`,
      name: app.name,
      phone: app.phone,
      zone: `${app.thana}, ${app.district}`,
      vehicle: app.vehicle,
      scaleId: `DIGI-SC-${110 + registered.length}`,
      completedPickups: 0,
      payout: '৳0',
<<<<<<< HEAD
      rating: '5.0 (New)',
=======
      rating: '5.0 ★ (New)',
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
      status: 'Available',
    };

    setRegistered([newCollector, ...registered]);
    setApplications(applications.filter((a) => a.id !== app.id));
    alert(`Application for ${app.name} has been approved! Assigned ID: ${newCollector.id}`);
  };

  const handleReject = (id, name) => {
    if (window.confirm(`Are you sure you want to reject the application for ${name}?`)) {
      setApplications(applications.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Employees & Collectors</h1>
          <p>Review collector applications, onboard scrap champions, and monitor registered field fleet.</p>
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
          <div className="sv-stat-change">Awaiting KYC & interview</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Active Field Collectors</span>
            <div className="sv-stat-icon-wrap green"><EmployeesCollectorsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">{registered.length} Registered</div>
          <div className="sv-stat-change">Equipped with calibrated scales</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Fleet Coverage</span>
            <div className="sv-stat-icon-wrap blue"><EmployeesCollectorsIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">6 Dhaka Zones</div>
          <div className="sv-stat-change">+35% income uplift for feriwalas</div>
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
              <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
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
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '12.5px' }}>{app.nid}</span>
                        <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>NID Document Attached</div>
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

        {/* Tab 2: Registered Collectors */}
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
                </tr>
              </thead>
              <tbody>
                {registered.map((col) => (
                  <tr key={col.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{col.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{col.id} • {col.phone}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#334155' }}>{col.zone}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{col.vehicle}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Scale: {col.scaleId}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{col.completedPickups} Doorsteps</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{col.payout}</td>
<<<<<<< HEAD
                    <td style={{ fontWeight: 700, color: '#f59e0b' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <StarIcon size={13} fill="#f59e0b" />
                        <span>{col.rating}</span>
                      </span>
                    </td>
=======
                    <td style={{ fontWeight: 700, color: '#f59e0b' }}>{col.rating}</td>
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
                    <td>
                      <span className={`sv-badge ${col.status === 'On Duty' ? 'orange' : 'green'}`}>
                        {col.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

