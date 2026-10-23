<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
import { ScrapPickupIcon } from '../../components/admin/AdminIcons.jsx';

const COLLECTORS_LIST = [
  'Unassigned',
  'Md. Faruk Hossain (Van-04)',
  'Shahidul Islam (Van-12)',
  'Jasim Uddin (E-Trike 02)',
  'Anwar Ali (Van-07)',
  'Rashedul Karim (E-Trike 05)',
<<<<<<< HEAD
  'Rafiqul Islam (Van-08 / Collector #C-104)',
=======
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
];

const INITIAL_REQUESTS = [
  {
    id: 'PK-4091',
    customer: 'Tanvir Ahmed',
    phone: '+880 1711-234567',
    address: 'House 14, Road 18, Sector 11, Uttara',
    thana: 'Uttara',
    materials: 'Paper & Cardboard',
    weight: '45 kg',
    estPayout: '৳810',
    timeSlot: '14 Oct, 2:30 PM - 4:00 PM',
    collector: 'Md. Faruk Hossain (Van-04)',
    status: 'Assigned',
  },
  {
    id: 'PK-4092',
    customer: 'Green Leaf Cafe',
    phone: '+880 1819-998877',
    address: 'Road 11, Block C, Banani',
    thana: 'Banani',
    materials: 'Plastic Bottles (PET) & Cans',
    weight: '22 kg',
    estPayout: '৳550',
    timeSlot: '14 Oct, 3:15 PM - 5:00 PM',
    collector: 'Unassigned',
    status: 'Pending',
  },
  {
    id: 'PK-4093',
    customer: 'Farzana Huq',
    phone: '+880 1912-334455',
    address: 'Avenue 3, Mirpur DOHS',
    thana: 'Mirpur',
    materials: 'E-Waste (CPU, Batteries, Cables)',
    weight: '16 kg',
    estPayout: '৳1,200',
    timeSlot: '14 Oct, 11:00 AM - 1:00 PM',
    collector: 'Shahidul Islam (Van-12)',
    status: 'In Transit',
  },
  {
    id: 'PK-4094',
    customer: 'Milestone School & College',
    phone: '+880 1611-778899',
    address: 'Sector 3 Campus, Uttara',
    thana: 'Uttara',
    materials: 'Academic Waste Paper & Cartons',
    weight: '140 kg',
    estPayout: '৳2,520',
    timeSlot: '13 Oct, 10:00 AM',
    collector: 'Jasim Uddin (E-Trike 02)',
    status: 'Completed',
  },
  {
    id: 'PK-4095',
    customer: 'Ahsan Kabir',
    phone: '+880 1511-667788',
    address: 'Dhanmondi 27, Old R/A',
    thana: 'Dhanmondi',
    materials: 'Scrap Metal & Iron Rods',
    weight: '38 kg',
    estPayout: '৳1,710',
    timeSlot: '14 Oct, 5:00 PM - 6:30 PM',
    collector: 'Unassigned',
    status: 'Pending',
  },
];

export default function AdminScrapPickup() {
<<<<<<< HEAD
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_admin_pickups');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('sv_admin_pickups', JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Sync with cross-dashboard updates
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('sv_admin_pickups');
        if (saved) {
          setRequests(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('sv_pickups_sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('sv_pickups_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

=======
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
  const filtered = requests.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.thana.toLowerCase().includes(search.toLowerCase()) ||
      r.materials.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAssignCollector = (id, collectorName) => {
<<<<<<< HEAD
    const newStatus = collectorName === 'Unassigned' ? 'Pending' : 'Assigned';
    const updated = requests.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          collector: collectorName,
          status: newStatus,
        };
      }
      return r;
    });

    setRequests(updated);
    try {
      localStorage.setItem('sv_admin_pickups', JSON.stringify(updated));

      // Synchronize with collector pickups database
      const targetReq = updated.find((r) => r.id === id);
      if (targetReq) {
        const colPickups = JSON.parse(localStorage.getItem('sv_collector_pickups') || '[]');
        const existingIdx = colPickups.findIndex((p) => p.id === id);

        const collectorTaskObj = {
          id: targetReq.id,
          customerName: targetReq.customer,
          customerPhone: targetReq.phone,
          phone: targetReq.phone,
          address: targetReq.address,
          thana: targetReq.thana,
          scrapItems: [targetReq.materials],
          items: [targetReq.materials],
          materials: [targetReq.materials],
          estimatedWeight: targetReq.weight,
          scheduledTime: targetReq.timeSlot,
          timeSlot: targetReq.timeSlot,
          status: newStatus,
          collector: collectorName,
          collectorName: collectorName,
          payout: targetReq.estPayout,
          notes: targetReq.notes || 'Doorstep recyclable collection.',
          assignedAt: new Date().toISOString()
        };

        if (existingIdx !== -1) {
          colPickups[existingIdx] = { ...colPickups[existingIdx], ...collectorTaskObj };
        } else {
          colPickups.unshift(collectorTaskObj);
        }
        localStorage.setItem('sv_collector_pickups', JSON.stringify(colPickups));

        // Create in-app notification for the newly assigned collector
        if (collectorName !== 'Unassigned') {
          const notifications = JSON.parse(localStorage.getItem('sv_collector_notifications') || '[]');
          const newNotif = {
            id: `NOTIF-${Date.now()}`,
            pickupId: id,
            collectorName: collectorName,
            title: 'New Scrap Pickup Assigned',
            message: `You have been assigned to ${targetReq.customer} (${targetReq.weight}) at ${targetReq.address}.`,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            read: false
          };
          notifications.unshift(newNotif);
          localStorage.setItem('sv_collector_notifications', JSON.stringify(notifications.slice(0, 20)));
        }

        // Also synchronize with User Dashboard pickups if applicable
        const usrPickups = JSON.parse(localStorage.getItem('sv_user_pickups') || '[]');
        const usrIdx = usrPickups.findIndex((u) => u.id === id || (u.address === targetReq.address && u.customerName === targetReq.customer));
        if (usrIdx !== -1) {
          usrPickups[usrIdx] = {
            ...usrPickups[usrIdx],
            status: newStatus,
            collectorName: collectorName
          };
          localStorage.setItem('sv_user_pickups', JSON.stringify(usrPickups));
        }

        window.dispatchEvent(new Event('sv_pickups_sync'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setRequests(updated);
    try {
      localStorage.setItem('sv_admin_pickups', JSON.stringify(updated));

      // Sync to collector pickups
      const colPickups = JSON.parse(localStorage.getItem('sv_collector_pickups') || '[]');
      const cIdx = colPickups.findIndex((p) => p.id === id);
      if (cIdx !== -1) {
        colPickups[cIdx].status = newStatus === 'In Transit' ? 'In Progress' : newStatus;
        localStorage.setItem('sv_collector_pickups', JSON.stringify(colPickups));
      }

      // Sync to user pickups
      const usrPickups = JSON.parse(localStorage.getItem('sv_user_pickups') || '[]');
      const uIdx = usrPickups.findIndex((p) => p.id === id);
      if (uIdx !== -1) {
        usrPickups[uIdx].status = newStatus === 'In Transit' ? 'In Progress' : newStatus;
        localStorage.setItem('sv_user_pickups', JSON.stringify(usrPickups));
      }

      window.dispatchEvent(new Event('sv_pickups_sync'));
    } catch (e) {
      console.error(e);
    }
=======
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            collector: collectorName,
            status: collectorName === 'Unassigned' ? 'Pending' : 'Assigned',
          };
        }
        return r;
      })
    );
  };

  const handleUpdateStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
  };

  return (
    <div>
      <div className="sv-page-header">
        <div className="sv-page-title-group">
          <h1>Scrap Pickup Requests</h1>
          <p>Assign field collectors, monitor doorstep collections, and track weight payouts.</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="sv-stats-grid">
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Pending Assignment</span>
            <div className="sv-stat-icon-wrap orange"><ScrapPickupIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">2 Pickups</div>
          <div className="sv-stat-change">Requires collector assignment</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Out For Collection</span>
            <div className="sv-stat-icon-wrap blue"><ScrapPickupIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">2 Active</div>
          <div className="sv-stat-change">En route to citizen doorstep</div>
        </div>
        <div className="sv-stat-card">
          <div className="sv-stat-header">
            <span className="sv-stat-label">Completed This Month</span>
            <div className="sv-stat-icon-wrap green"><ScrapPickupIcon size={16} /></div>
          </div>
          <div className="sv-stat-value">136 Requests</div>
          <div className="sv-stat-change">4,820 kg weighed on calibrated digital scales</div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="sv-card">
        <div className="sv-card-header">
          <div className="sv-search-box">
            <input
              type="text"
              placeholder="Search pickup ID, customer, thana, scrap type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Assigned', 'In Transit', 'Completed'].map((st) => (
              <button
                key={st}
                type="button"
                className="sv-btn-secondary"
                style={{
                  fontSize: '12.5px',
                  padding: '6px 12px',
                  background: statusFilter === st ? '#111827' : '#ffffff',
                  color: statusFilter === st ? '#ffffff' : '#334155',
                }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="sv-table-container" style={{ border: 'none' }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Request ID & Slot</th>
                <th>Citizen Details & Address</th>
                <th>Materials & Weight</th>
                <th>Est. Reward</th>
                <th>Assigned Collector</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.id}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{req.timeSlot}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{req.customer}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{req.phone}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{req.address}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{req.materials}</div>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
                      ~{req.weight}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>
                    {req.estPayout}
                  </td>
                  <td>
                    <select
                      value={req.collector}
                      onChange={(e) => handleAssignCollector(req.id, e.target.value)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        fontFamily: 'inherit',
                        background: '#ffffff',
                        maxWidth: '180px',
                      }}
                    >
                      {COLLECTORS_LIST.map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      className={`sv-badge ${
                        req.status === 'Completed'
                          ? 'green'
                          : req.status === 'Assigned'
                          ? 'blue'
                          : req.status === 'In Transit'
                          ? 'orange'
                          : 'gray'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={req.status}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                      style={{
                        padding: '5px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        background: '#ffffff',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Completed">Completed</option>
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

