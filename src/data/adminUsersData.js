export const INITIAL_ADMIN_USERS = [
  { id: 'USR-7821', name: 'Sazzad M Rahman', email: 'sazzad.customer@gmail.com', phone: '01712-345678', area: 'Banani, Dhaka', role: 'Residential Recycler', recycledKg: 112, rewards: '৳2,480', status: 'Verified' },
  { id: 'USR-101', name: 'Tanvir Hossain', email: 'tanvir.eco@gmail.com', phone: '+880 1711-234567', area: 'Uttara, Dhaka', role: 'Residential Recycler', recycledKg: 184, rewards: '৳3,240', status: 'Verified' },
  { id: 'USR-102', name: 'Nusrat Jahan', email: 'nusrat.jahan@gmail.com', phone: '+880 1819-876543', area: 'Dhanmondi, Dhaka', role: 'Residential Recycler', recycledKg: 92, rewards: '৳1,650', status: 'Verified' },
  { id: 'USR-103', name: 'Apex Green Ventures Ltd.', email: 'admin@apexgreen.com', phone: '+880 1912-345678', area: 'Tejgaon I/A, Dhaka', role: 'Commercial Enterprise', recycledKg: 2450, rewards: '৳48,500', status: 'Verified' },
  { id: 'USR-104', name: 'Milestone Eco Club', email: 'eco@milestoneschool.edu.bd', phone: '+880 1611-987654', area: 'Uttara, Dhaka', role: 'Educational Institute', recycledKg: 3890, rewards: '৳68,200', status: 'Verified' },
  { id: 'USR-105', name: 'Dr. Rafiqul Islam', email: 'rafiqul.uits@gmail.com', phone: '+880 1715-456789', area: 'Baridhara, Dhaka', role: 'Residential Recycler', recycledKg: 64, rewards: '৳1,120', status: 'Verified' },
  { id: 'USR-106', name: 'Sabbir Ahmed', email: 'sabbir.ahmed99@yahoo.com', phone: '+880 1511-223344', area: 'Mirpur 10, Dhaka', role: 'Residential Recycler', recycledKg: 38, rewards: '৳640', status: 'Verified' },
];

export function getStoredAdminUsers() {
  try {
    const saved = localStorage.getItem('sv_admin_users_list');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u) => ({
          ...u,
          status: u.status === 'Suspended' ? 'Suspended' : 'Verified'
        }));
      }
    }
    // Also include any registered users
    const registered = JSON.parse(localStorage.getItem('sv_registered_users') || '[]');
    const registeredMapped = registered.map((r) => ({
      id: r.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: r.name || 'New Recycler',
      email: r.email || '',
      phone: r.phone || '',
      area: r.address || 'Dhaka',
      role: 'Residential Recycler',
      recycledKg: Number(r.totalRecycledKg || 0),
      rewards: '৳0',
      status: 'Verified',
    }));
    const merged = [...registeredMapped, ...INITIAL_ADMIN_USERS];
    const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values());
    localStorage.setItem('sv_admin_users_list', JSON.stringify(unique));
    return unique;
  } catch {
    return INITIAL_ADMIN_USERS;
  }
}

export function saveStoredAdminUsers(users) {
  try {
    localStorage.setItem('sv_admin_users_list', JSON.stringify(users));
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
    window.dispatchEvent(new Event('sv_users_sync'));
  } catch (e) {
    console.error(e);
  }
}

