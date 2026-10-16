import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default mock data for testing customer dashboard
const INITIAL_USER_ORDERS = [
  {
    id: 'ORD-7821',
    date: '14 Oct 2026',
    items: ['Upcycled Kraft Paper Box (Pack of 50)', 'Eco-Friendly Planter Pot (Recycled Plastic, 2x)'],
    totalAmount: 970,
    total: 970,
    status: 'Shipped',
    paymentMethod: 'bKash Online',
    deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka'
  },
  {
    id: 'ORD-7640',
    date: '28 Sep 2026',
    items: ['Reprocessed Cotton Canvas Tote Bag (3x)'],
    totalAmount: 450,
    total: 450,
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    deliveryAddress: 'House 42, Road 11, Block D, Banani, Dhaka'
  }
];

const INITIAL_USER_PICKUPS = [
  {
    id: 'PKP-9024',
    date: '17 Oct 2026 (10:00 AM)',
    scheduledDate: '17 Oct 2026 (10:00 AM)',
    requestDate: '15 Oct 2026',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Old Newspaper & Books (15 kg)', 'Carton Boxes (10 kg)', 'Plastic Bottles (5 kg)'],
    materials: ['Old Newspaper & Books (15 kg)', 'Carton Boxes (10 kg)', 'Plastic Bottles (5 kg)'],
    estimatedWeight: '30 kg',
    status: 'Scheduled',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    collectorPhone: '01819-876543',
    earnedAmount: '৳ 680 (Estimated)'
  },
  {
    id: 'PKP-8812',
    date: '03 Oct 2026 (02:30 PM)',
    scheduledDate: '03 Oct 2026',
    requestDate: '02 Oct 2026',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Discarded Garments / RMG Fabric (20 kg)', 'Broken Glass Bottles (8 kg)'],
    materials: ['Discarded Garments / RMG Fabric (20 kg)', 'Broken Glass Bottles (8 kg)'],
    estimatedWeight: '28 kg',
    status: 'Completed',
    collectorName: 'Faruk Hossain (Collector #C-108)',
    collectorPhone: '01911-234567',
    earnedAmount: '৳ 740 (Paid via bKash)'
  }
];

// Default mock data for collector tasks
const INITIAL_COLLECTOR_PICKUPS = [
  {
    id: 'TASK-501',
    customerName: 'Sazzad M Rahman',
    phone: '01712-345678',
    customerPhone: '01712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    scrapItems: ['Newspaper & Cartons', 'Plastic Containers'],
    items: ['Newspaper & Cartons', 'Plastic Containers'],
    materials: ['Newspaper & Cartons', 'Plastic Containers'],
    estimatedWeight: '30 kg',
    scheduledTime: 'Today, 10:30 AM',
    timeSlot: 'Today, 10:30 AM',
    status: 'Assigned',
    notes: 'Please ring the calling bell on the 3rd floor.'
  },
  {
    id: 'TASK-502',
    customerName: 'Tanvir Ahmed',
    phone: '01822-998877',
    customerPhone: '01822-998877',
    address: 'House 18, Road 4, Sector 7, Uttara, Dhaka',
    scrapItems: ['Scrap Metal & Iron Rods', 'Aluminium Cans'],
    items: ['Scrap Metal & Iron Rods', 'Aluminium Cans'],
    materials: ['Scrap Metal & Iron Rods', 'Aluminium Cans'],
    estimatedWeight: '45 kg',
    scheduledTime: 'Today, 02:00 PM',
    timeSlot: 'Today, 02:00 PM',
    status: 'En Route',
    notes: 'Garage pickup, gate will be open.'
  },
  {
    id: 'TASK-498',
    customerName: 'Farhana Yasmin',
    phone: '01933-445566',
    customerPhone: '01933-445566',
    address: 'Plot 12, Gulshan-2, Road 68, Dhaka',
    scrapItems: ['RMG Fabric Scraps', 'Paper Shreds'],
    items: ['RMG Fabric Scraps', 'Paper Shreds'],
    materials: ['RMG Fabric Scraps', 'Paper Shreds'],
    estimatedWeight: '22 kg',
    finalWeight: '24 kg',
    collectedWeight: '24 kg',
    payout: '620',
    cashPaid: '৳ 620',
    scheduledTime: 'Yesterday',
    timeSlot: 'Yesterday',
    status: 'Completed',
    notes: 'Completed successfully.'
  }
];

// Clean up any stale sessions from previous test schemas so user starts properly logged out
if (typeof window !== 'undefined') {
  try {
    const schemaVersion = localStorage.getItem('sv_auth_schema_ver');
    if (schemaVersion !== '3') {
      localStorage.removeItem('sv_auth_user');
      localStorage.removeItem('sv_user_orders');
      localStorage.removeItem('sv_user_pickups');
      localStorage.removeItem('sv_collector_pickups');
      localStorage.setItem('sv_auth_schema_ver', '3');
    }
  } catch (e) {
    console.error(e);
  }
}

export function AuthProvider({ children }) {
  // Current user state (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userOrders, setUserOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_user_orders');
      return saved ? JSON.parse(saved) : INITIAL_USER_ORDERS;
    } catch {
      return INITIAL_USER_ORDERS;
    }
  });

  const [userPickups, setUserPickups] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_user_pickups');
      return saved ? JSON.parse(saved) : INITIAL_USER_PICKUPS;
    } catch {
      return INITIAL_USER_PICKUPS;
    }
  });

  const [collectorPickups, setCollectorPickups] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_collector_pickups');
      return saved ? JSON.parse(saved) : INITIAL_COLLECTOR_PICKUPS;
    } catch {
      return INITIAL_COLLECTOR_PICKUPS;
    }
  });

  // Collector Applications submitted (both from Become a Collector modal and Collector Login page)
  const [collectorApplications, setCollectorApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_collector_applications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'SV-COL-8841',
          name: 'Rafiqul Islam',
          phone: '01819-876543',
          email: 'rafiq.collector@scrapventure.xyz',
          nid: '1992261456789',
          division: 'Dhaka',
          district: 'Dhaka',
          thana: 'Banani',
          vehicle: 'Motorized Van',
          experience: '3+ Years',
          password: 'demo',
          status: 'approved',
          appliedAt: '12 Jan 2026'
        }
      ];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sv_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sv_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sv_user_orders', JSON.stringify(userOrders));
  }, [userOrders]);

  useEffect(() => {
    localStorage.setItem('sv_user_pickups', JSON.stringify(userPickups));
  }, [userPickups]);

  useEffect(() => {
    localStorage.setItem('sv_collector_pickups', JSON.stringify(collectorPickups));
  }, [collectorPickups]);

  useEffect(() => {
    localStorage.setItem('sv_collector_applications', JSON.stringify(collectorApplications));
  }, [collectorApplications]);

  // Customer / User Login
  const loginUser = (emailOrPhone, password) => {
    const user = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0].replace(/[._]/g, ' ') : 'Customer',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@scrapventure.xyz',
      phone: emailOrPhone.includes('@') ? '01712-345678' : emailOrPhone,
      role: 'user',
      address: 'House 42, Road 11, Block D, Banani, Dhaka',
      joinedDate: 'October 2026',
      totalRecycledKg: 58,
      rewardPoints: 240
    };
    setCurrentUser(user);
    return { success: true, user };
  };

  // Google Sign-in (Architecture ready for real Google OAuth2 / Firebase / Backend DB)
  const loginWithGoogle = (googleProfile = {}) => {
    const email = googleProfile.email?.trim() || 'user.scrap@gmail.com';
    const name = googleProfile.name?.trim() || (email.split('@')[0].replace(/[._]/g, ' ') || 'Google User');
    const user = {
      id: 'USR-G' + Math.floor(1000 + Math.random() * 9000),
      googleId: googleProfile.googleId || ('g_' + Math.random().toString(36).substring(2, 11)),
      name: name,
      email: email,
      phone: googleProfile.phone || '01712-345678',
      role: 'user',
      address: googleProfile.address || 'Dhaka, Bangladesh',
      joinedDate: 'October 2026',
      totalRecycledKg: 0,
      rewardPoints: 50,
      authProvider: 'google',
      isGoogleAuth: true,
      avatar: googleProfile.avatar || null
    };
    setCurrentUser(user);
    return { success: true, user };
  };

  // Apple Sign-in simulation
  const loginWithApple = () => {
    const user = {
      id: 'USR-A' + Math.floor(1000 + Math.random() * 9000),
      name: 'Apple User',
      email: 'user@privaterelay.appleid.com',
      phone: '01811-223344',
      role: 'user',
      address: 'Gulshan 1, Dhaka',
      joinedDate: 'October 2026',
      totalRecycledKg: 30,
      rewardPoints: 120,
      isAppleAuth: true
    };
    setCurrentUser(user);
    return { success: true, user };
  };

  // Customer Registration
  const registerUser = (data) => {
    const user = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: data.name || 'New Customer',
      email: data.email || 'customer@scrapventure.xyz',
      phone: data.phone || '01700-000000',
      address: data.address || 'Dhaka, Bangladesh',
      role: 'user',
      joinedDate: 'Today',
      totalRecycledKg: 0,
      rewardPoints: 50
    };
    setCurrentUser(user);
    return { success: true, user };
  };

  // Submit Collector Application (Used by both Become a Collector form & Collector Login page)
  const submitCollectorApplication = (data) => {
    const appRef = 'SV-COL-' + Math.floor(10000 + Math.random() * 90000);
    const newApp = {
      id: appRef,
      name: data.name?.trim() || 'Collector Partner Applicant',
      phone: data.phone?.trim() || '',
      email: data.email?.trim() || `${data.phone?.replace(/[^0-9]/g, '') || 'collector'}@scrapventure.xyz`,
      nid: data.nid?.trim() || '',
      division: data.division || 'Dhaka',
      district: data.district || 'Dhaka',
      thana: data.thana || data.finalThana || 'Banani',
      vehicle: data.vehicle || 'Van',
      experience: data.experience || '1-2 Years',
      password: data.password || '123456',
      status: 'pending', // pending admin review
      appliedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setCollectorApplications((prev) => [newApp, ...prev.filter((a) => a.phone !== newApp.phone)]);
    return { success: true, application: newApp };
  };

  // Admin Approval for Collector Application
  const approveCollectorApplication = (appIdOrPhone) => {
    let target = null;
    setCollectorApplications((prev) =>
      prev.map((app) => {
        if (app.id === appIdOrPhone || app.phone === appIdOrPhone) {
          target = { ...app, status: 'approved' };
          return target;
        }
        return app;
      })
    );
    return { success: true, application: target };
  };

  // Collector Login with Admin Approval Verification
  const loginCollector = (emailOrPhone, password) => {
    const cleanInput = (emailOrPhone || '').trim();
    const cleanPhone = cleanInput.replace(/[\s-]/g, '');

    // 1. Instant Demo Collector (Pre-approved)
    if (
      cleanPhone === '01819876543' ||
      cleanInput === '01819-876543' ||
      cleanInput.toLowerCase() === 'rafiq.collector@scrapventure.xyz'
    ) {
      const collector = {
        id: 'COL-104',
        name: 'Rafiqul Islam',
        email: 'rafiq.collector@scrapventure.xyz',
        phone: '01819-876543',
        role: 'collector',
        badgeId: 'SV-COL-8841',
        zone: 'Dhaka North (Banani, Gulshan, Uttara)',
        vehicle: 'Motorized Van (ঢাকা মেট্রো-হ ১১-২২৩৩)',
        joinedDate: 'January 2026',
        totalPickupsDone: 94,
        totalWeightCollected: 1420,
        totalEarnings: 42500
      };
      setCurrentUser(collector);
      return { success: true, user: collector };
    }

    // 2. Look up application
    const matchedApp = collectorApplications.find((app) => {
      const appCleanPhone = (app.phone || '').replace(/[\s-]/g, '');
      return (
        appCleanPhone === cleanPhone ||
        app.phone === cleanInput ||
        (app.email && app.email.toLowerCase() === cleanInput.toLowerCase())
      );
    });

    if (matchedApp) {
      // Check password if set on application
      if (matchedApp.password && password && matchedApp.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      // Check Admin Approval status
      if (matchedApp.status !== 'approved') {
        return {
          success: false,
          pending: true,
          application: matchedApp,
          error: `Your application (${matchedApp.id}) is currently under Admin Review. Once approved by the ScrapVenture Admin Panel, you will be able to log in.`
        };
      }

      // Approved collector login!
      const collector = {
        id: matchedApp.id,
        name: matchedApp.name,
        email: matchedApp.email,
        phone: matchedApp.phone,
        role: 'collector',
        badgeId: matchedApp.id,
        zone: `${matchedApp.district || 'Dhaka'}, ${matchedApp.thana || 'Central'}`,
        vehicle: matchedApp.vehicle || 'Motorized Van',
        joinedDate: matchedApp.appliedAt || 'Recent',
        totalPickupsDone: 0,
        totalWeightCollected: 0,
        totalEarnings: 0
      };
      setCurrentUser(collector);
      return { success: true, user: collector };
    }

    // 3. Fallback if not found in applications
    return {
      success: false,
      error: 'No collector application found for this phone or email. Please register your application first.'
    };
  };

  // Collector Registration (Aliases to submitCollectorApplication)
  const registerCollector = (data) => {
    return submitCollectorApplication(data);
  };

  // Update User Profile Settings
  const updateUserSettings = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    return { success: true };
  };

  // Change Password
  const changePassword = (currentPass, newPass) => {
    // Simulated password update
    return { success: true };
  };

  // Collector Updates a Task's status / weighed amount
  const updateCollectorTask = (taskId, newStatus, weight, amount) => {
    setCollectorPickups((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            collectedWeight: weight ? `${weight} kg` : t.collectedWeight,
            cashPaid: amount ? `৳ ${amount}` : t.cashPaid
          };
        }
        return t;
      })
    );
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isUser: currentUser?.role === 'user',
        isCollector: currentUser?.role === 'collector',
        userOrders,
        userPickups,
        collectorPickups,
        collectorApplications,
        loginUser,
        loginWithGoogle,
        loginWithApple,
        registerUser,
        loginCollector,
        registerCollector,
        submitCollectorApplication,
        approveCollectorApplication,
        updateUserSettings,
        changePassword,
        updateCollectorTask,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export default AuthContext;

