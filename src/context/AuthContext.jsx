import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default mock data for testing customer dashboard
const INITIAL_USER_ORDERS = [
  {
    id: 'ORD-7821',
    userId: 'USR-7821',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
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
    userId: 'USR-7821',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
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
    userId: 'USR-7821',
    customerName: 'Sazzad M Rahman',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
    date: '17 Oct 2026 (10:00 AM)',
    scheduledDate: '17 Oct 2026 (10:00 AM)',
    requestDate: '15 Oct 2026',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Old Newspaper & Books (15 kg)', 'Carton Boxes (10 kg)', 'Plastic Bottles (5 kg)'],
    materials: ['Old Newspaper & Books (15 kg)', 'Carton Boxes (10 kg)', 'Plastic Bottles (5 kg)'],
    estimatedWeight: '30 kg',
    actualWeight: null,
    status: 'Scheduled',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    collectorPhone: '01819-876543',
    earnedAmount: '৳ 680 (Estimated)',
    notes: 'Please ring the calling bell on the 3rd floor.'
  },
  {
    id: 'PKP-9011',
    userId: 'USR-7821',
    customerName: 'Sazzad M Rahman',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
    date: '19 Oct 2026 (10:15 AM)',
    scheduledDate: '19 Oct 2026',
    requestDate: '18 Oct 2026',
    completedDate: '2026-10-19T10:15:00Z',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Mixed Rigid Plastic Containers (14 kg)'],
    materials: ['Mixed Rigid Plastic Containers (14 kg)'],
    estimatedWeight: '12 kg',
    actualWeight: '14 kg',
    status: 'Completed',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    collectorPhone: '01819-876543',
    earnedAmount: '৳ 490 (Paid via bKash)',
    paidAmount: 490,
    paymentStatus: 'Paid via bKash',
    notes: 'Plastic containers verified and weighed with calibrated digital scale.'
  },
  {
    id: 'PKP-8812',
    userId: 'USR-7821',
    customerName: 'Sazzad M Rahman',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
    date: '03 Oct 2026 (02:30 PM)',
    scheduledDate: '03 Oct 2026',
    requestDate: '02 Oct 2026',
    completedDate: '2026-10-03T14:30:00Z',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Discarded Garments / RMG Fabric (20 kg)', 'Broken Glass Bottles (8 kg)'],
    materials: ['Discarded Garments / RMG Fabric (20 kg)', 'Broken Glass Bottles (8 kg)'],
    estimatedWeight: '28 kg',
    actualWeight: '28 kg',
    status: 'Completed',
    collectorName: 'Faruk Hossain (Collector #C-108)',
    collectorPhone: '01911-234567',
    earnedAmount: '৳ 596 (Paid via bKash)',
    paidAmount: 596,
    paymentStatus: 'Paid via bKash',
    notes: 'RMG Fabric 20kg @ ৳25, Glass Bottles 8kg @ ৳12. Paid to customer.'
  },
  {
    id: 'PKP-8540',
    userId: 'USR-7821',
    customerName: 'Sazzad M Rahman',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
    date: '21 Sep 2026 (11:00 AM)',
    scheduledDate: '21 Sep 2026',
    requestDate: '20 Sep 2026',
    completedDate: '2026-09-21T11:45:00Z',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Old Newspapers & Books (25 kg)', 'Carton Packaging Boxes (15 kg)'],
    materials: ['Old Newspapers & Books (25 kg)', 'Carton Packaging Boxes (15 kg)'],
    estimatedWeight: '40 kg',
    actualWeight: '40 kg',
    status: 'Completed',
    collectorName: 'Shahidul Islam (Collector #C-102)',
    collectorPhone: '01711-889900',
    earnedAmount: '৳ 675 (Paid Cash)',
    paidAmount: 675,
    paymentStatus: 'Cash on Collection',
    notes: 'Paper & Cardboard collected. Cash handed over directly.'
  },
  {
    id: 'PKP-8319',
    userId: 'USR-7821',
    customerName: 'Sazzad M Rahman',
    customerEmail: 'sazzad.customer@gmail.com',
    customerPhone: '01712-345678',
    date: '08 Sep 2026 (03:15 PM)',
    scheduledDate: '08 Sep 2026',
    requestDate: '07 Sep 2026',
    completedDate: '2026-09-08T15:30:00Z',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '01712-345678',
    items: ['Plastic Bottles (PET) & Containers (18 kg)', 'Scrap Metal & Iron Rods (12 kg)'],
    materials: ['Plastic Bottles (PET) & Containers (18 kg)', 'Scrap Metal & Iron Rods (12 kg)'],
    estimatedWeight: '30 kg',
    actualWeight: '30 kg',
    status: 'Completed',
    collectorName: 'Jasim Uddin (Collector #C-106)',
    collectorPhone: '01815-667788',
    earnedAmount: '৳ 1,590 (Paid via bKash)',
    paidAmount: 1590,
    paymentStatus: 'Paid via bKash',
    notes: 'PET Bottles 18kg @ ৳35 = ৳630, Iron Rods 12kg @ ৳80 = ৳960.'
  }
];

// Verified individual scrap selling transactions for customer
const INITIAL_USER_SALES = [
  {
    id: 'TXN-9011',
    userId: 'USR-7821',
    pickupId: 'PKP-9011',
    date: '2026-10-19',
    completedDate: '2026-10-19T10:15:00Z',
    category: 'Plastic',
    materialName: 'Mixed Rigid Plastic Containers',
    collectedWeight: 14,
    weightUnit: 'kg',
    pricePerKg: 35,
    totalAmount: 490,
    collectorName: 'Rafiqul Islam',
    collectorBadge: 'Collector #C-104',
    collectorPhone: '01819-876543',
    status: 'Verified',
    paymentStatus: 'Paid via bKash',
    paymentMethod: 'bKash Online',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Measured on digital scale, confirmed on customer dashboard.'
  },
  {
    id: 'TXN-8812-1',
    userId: 'USR-7821',
    pickupId: 'PKP-8812',
    date: '2026-10-03',
    completedDate: '2026-10-03T14:30:00Z',
    category: 'Textile',
    materialName: 'Discarded Garments / RMG Fabric',
    collectedWeight: 20,
    weightUnit: 'kg',
    pricePerKg: 25,
    totalAmount: 500,
    collectorName: 'Faruk Hossain',
    collectorBadge: 'Collector #C-108',
    collectorPhone: '01911-234567',
    status: 'Completed',
    paymentStatus: 'Paid via bKash',
    paymentMethod: 'bKash Online',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Clean RMG fabric scraps weighed on certified scale.'
  },
  {
    id: 'TXN-8812-2',
    userId: 'USR-7821',
    pickupId: 'PKP-8812',
    date: '2026-10-03',
    completedDate: '2026-10-03T14:30:00Z',
    category: 'Glass',
    materialName: 'Broken Glass Bottles',
    collectedWeight: 8,
    weightUnit: 'kg',
    pricePerKg: 12,
    totalAmount: 96,
    collectorName: 'Faruk Hossain',
    collectorBadge: 'Collector #C-108',
    collectorPhone: '01911-234567',
    status: 'Completed',
    paymentStatus: 'Paid via bKash',
    paymentMethod: 'bKash Online',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Glass sorted and weighed safely.'
  },
  {
    id: 'TXN-8540-1',
    userId: 'USR-7821',
    pickupId: 'PKP-8540',
    date: '2026-09-21',
    completedDate: '2026-09-21T11:45:00Z',
    category: 'Paper',
    materialName: 'Old Newspapers & Books',
    collectedWeight: 25,
    weightUnit: 'kg',
    pricePerKg: 18,
    totalAmount: 450,
    collectorName: 'Shahidul Islam',
    collectorBadge: 'Collector #C-102',
    collectorPhone: '01711-889900',
    status: 'Verified',
    paymentStatus: 'Cash on Collection',
    paymentMethod: 'Cash',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Bundles of old newspapers and textbooks.'
  },
  {
    id: 'TXN-8540-2',
    userId: 'USR-7821',
    pickupId: 'PKP-8540',
    date: '2026-09-21',
    completedDate: '2026-09-21T11:45:00Z',
    category: 'Cardboard',
    materialName: 'Carton Packaging Boxes',
    collectedWeight: 15,
    weightUnit: 'kg',
    pricePerKg: 15,
    totalAmount: 225,
    collectorName: 'Shahidul Islam',
    collectorBadge: 'Collector #C-102',
    collectorPhone: '01711-889900',
    status: 'Verified',
    paymentStatus: 'Cash on Collection',
    paymentMethod: 'Cash',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Flattened clean corrugated carton boxes.'
  },
  {
    id: 'TXN-8319-1',
    userId: 'USR-7821',
    pickupId: 'PKP-8319',
    date: '2026-09-08',
    completedDate: '2026-09-08T15:30:00Z',
    category: 'Plastic',
    materialName: 'Plastic Bottles (PET) & Containers',
    collectedWeight: 18,
    weightUnit: 'kg',
    pricePerKg: 35,
    totalAmount: 630,
    collectorName: 'Jasim Uddin',
    collectorBadge: 'Collector #C-106',
    collectorPhone: '01815-667788',
    status: 'Completed',
    paymentStatus: 'Paid via bKash',
    paymentMethod: 'bKash Online',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Beverage bottles & cleaned plastics.'
  },
  {
    id: 'TXN-8319-2',
    userId: 'USR-7821',
    pickupId: 'PKP-8319',
    date: '2026-09-08',
    completedDate: '2026-09-08T15:30:00Z',
    category: 'Metal',
    materialName: 'Scrap Metal & Iron Rods',
    collectedWeight: 12,
    weightUnit: 'kg',
    pricePerKg: 80,
    totalAmount: 960,
    collectorName: 'Jasim Uddin',
    collectorBadge: 'Collector #C-106',
    collectorPhone: '01815-667788',
    status: 'Completed',
    paymentStatus: 'Paid via bKash',
    paymentMethod: 'bKash Online',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    notes: 'Disused iron rods and copper/brass scrap.'
  }
];

// Default mock data for collector tasks
const INITIAL_COLLECTOR_PICKUPS = [
  {
    id: 'TASK-501',
    customerName: 'Sazzad M Rahman',
    userId: 'USR-7821',
    phone: '01712-345678',
    customerPhone: '01712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    thana: 'Banani',
    scrapItems: ['Old Newspapers & Cartons (15 kg)', 'Plastic Bottles PET (15 kg)'],
    items: ['Old Newspapers & Cartons (15 kg)', 'Plastic Bottles PET (15 kg)'],
    materials: ['Old Newspapers & Cartons (15 kg)', 'Plastic Bottles PET (15 kg)'],
    estimatedWeight: '30 kg',
    scheduledTime: 'Today, 10:30 AM',
    scheduledDate: 'Today',
    timeSlot: 'Today, 10:30 AM - 12:00 PM',
    status: 'Assigned',
    collectorId: 'COL-104',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    collectorPhone: '01819-876543',
    estPayout: '৳ 680',
    notes: 'Please ring the calling bell on the 3rd floor. Materials are boxed.'
  },
  {
    id: 'TASK-502',
    customerName: 'Tanvir Ahmed',
    phone: '01822-998877',
    customerPhone: '01822-998877',
    address: 'House 18, Road 4, Sector 7, Uttara, Dhaka',
    thana: 'Uttara',
    scrapItems: ['Scrap Metal & Iron Rods (30 kg)', 'Aluminium Beverage Cans (15 kg)'],
    items: ['Scrap Metal & Iron Rods (30 kg)', 'Aluminium Beverage Cans (15 kg)'],
    materials: ['Scrap Metal & Iron Rods (30 kg)', 'Aluminium Beverage Cans (15 kg)'],
    estimatedWeight: '45 kg',
    scheduledTime: 'Today, 02:00 PM',
    scheduledDate: 'Today',
    timeSlot: 'Today, 02:00 PM - 03:30 PM',
    status: 'In Progress',
    collectorId: 'COL-104',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    collectorPhone: '01819-876543',
    estPayout: '৳ 1,350',
    notes: 'Garage pickup on ground floor. Gate security is informed.'
  },
  {
    id: 'PKP-9011',
    customerName: 'Sazzad M Rahman',
    userId: 'USR-7821',
    phone: '01712-345678',
    customerPhone: '01712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    thana: 'Banani',
    scrapItems: ['Plastic Bottles (PET) & Containers (18 kg)', 'Clean Corrugated Cardboard (12 kg)'],
    items: ['Plastic Bottles (PET) & Containers (18 kg)', 'Clean Corrugated Cardboard (12 kg)'],
    materials: ['Plastic Bottles (PET) & Containers (18 kg)', 'Clean Corrugated Cardboard (12 kg)'],
    estimatedWeight: '30 kg',
    scheduledTime: 'Today, 04:30 PM',
    scheduledDate: 'Today',
    timeSlot: 'Today, 04:30 PM - 05:45 PM',
    status: 'Assigned',
    collectorId: 'COL-104',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    collectorPhone: '01819-876543',
    estPayout: '৳ 680',
    notes: 'Please bring digital hanging scale. Blue bags ready near lobby.'
  },
  {
    id: 'TASK-498',
    customerName: 'Farhana Yasmin',
    phone: '01933-445566',
    customerPhone: '01933-445566',
    address: 'Plot 12, Gulshan-2, Road 68, Dhaka',
    thana: 'Gulshan',
    scrapItems: ['RMG Fabric Scraps (14 kg)', 'Office Shredded Paper (10 kg)'],
    items: ['RMG Fabric Scraps (14 kg)', 'Office Shredded Paper (10 kg)'],
    materials: ['RMG Fabric Scraps (14 kg)', 'Office Shredded Paper (10 kg)'],
    estimatedWeight: '22 kg',
    finalWeight: '24 kg',
    actualWeight: '24 kg',
    collectedWeight: '24 kg',
    payout: '620',
    cashPaid: '৳ 620',
    collectorEarnings: 120,
    scheduledTime: 'Yesterday, 11:00 AM',
    scheduledDate: 'Yesterday',
    completedAt: '2026-10-22T11:45:00Z',
    status: 'Completed',
    collectorId: 'COL-104',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    notes: 'Weighed on digital scale and cash handed over directly.'
  },
  {
    id: 'PKP-8842',
    customerName: 'Sazzad M Rahman',
    userId: 'USR-7821',
    phone: '01712-345678',
    customerPhone: '01712-345678',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    thana: 'Banani',
    scrapItems: ['Clean PET Beverage Bottles (14 kg)'],
    items: ['Clean PET Beverage Bottles (14 kg)'],
    materials: ['Clean PET Beverage Bottles (14 kg)'],
    estimatedWeight: '14 kg',
    finalWeight: '14 kg',
    actualWeight: '14 kg',
    collectedWeight: '14 kg',
    payout: '490',
    cashPaid: '৳ 490',
    collectorEarnings: 70,
    scheduledTime: '28 Sep 2026, 04:00 PM',
    scheduledDate: '28 Sep 2026',
    completedAt: '2026-09-28T16:45:00Z',
    status: 'Completed',
    collectorId: 'COL-104',
    collectorName: 'Rafiqul Islam (Collector #C-104)',
    notes: 'Verified scale weight and paid via bKash.'
  },
  // Other Collector Assignments
  {
    id: 'PK-4091',
    customerName: 'Tanvir Ahmed',
    phone: '+880 1711-234567',
    customerPhone: '+880 1711-234567',
    address: 'House 14, Road 18, Sector 11, Uttara',
    thana: 'Uttara',
    scrapItems: ['Paper & Cardboard (45 kg)'],
    items: ['Paper & Cardboard (45 kg)'],
    materials: ['Paper & Cardboard (45 kg)'],
    estimatedWeight: '45 kg',
    timeSlot: 'Today, 2:30 PM - 4:00 PM',
    scheduledTime: 'Today, 2:30 PM',
    scheduledDate: 'Today',
    status: 'Assigned',
    collector: 'Md. Faruk Hossain (Van-04)',
    collectorName: 'Md. Faruk Hossain (Van-04)',
    collectorId: 'COL-001',
    estPayout: '৳ 810'
  },
  {
    id: 'PK-4093',
    customerName: 'Farzana Huq',
    phone: '+880 1912-334455',
    customerPhone: '+880 1912-334455',
    address: 'Avenue 3, Mirpur DOHS',
    thana: 'Mirpur',
    scrapItems: ['E-Waste (CPU, Batteries, Cables) (16 kg)'],
    items: ['E-Waste (CPU, Batteries, Cables) (16 kg)'],
    materials: ['E-Waste (CPU, Batteries, Cables) (16 kg)'],
    estimatedWeight: '16 kg',
    timeSlot: 'Today, 11:00 AM - 1:00 PM',
    scheduledTime: 'Today, 11:00 AM',
    scheduledDate: 'Today',
    status: 'In Progress',
    collector: 'Shahidul Islam (Van-12)',
    collectorName: 'Shahidul Islam (Van-12)',
    collectorId: 'COL-002',
    estPayout: '৳ 1,200'
  },
  {
    id: 'PK-4094',
    customerName: 'Milestone School & College',
    phone: '+880 1611-778899',
    customerPhone: '+880 1611-778899',
    address: 'Sector 3 Campus, Uttara',
    thana: 'Uttara',
    scrapItems: ['Academic Waste Paper & Cartons (140 kg)'],
    items: ['Academic Waste Paper & Cartons (140 kg)'],
    materials: ['Academic Waste Paper & Cartons (140 kg)'],
    estimatedWeight: '140 kg',
    actualWeight: '140 kg',
    collectedWeight: '140 kg',
    timeSlot: 'Yesterday, 10:00 AM',
    scheduledTime: 'Yesterday, 10:00 AM',
    scheduledDate: 'Yesterday',
    status: 'Completed',
    collector: 'Jasim Uddin (E-Trike 02)',
    collectorName: 'Jasim Uddin (E-Trike 02)',
    collectorId: 'COL-003',
    payout: '2520',
    cashPaid: '৳ 2,520',
    collectorEarnings: 700
  }
];

// Clean up any stale sessions from previous test schemas so user starts properly logged out
if (typeof window !== 'undefined') {
  try {
    const schemaVersion = localStorage.getItem('sv_auth_schema_ver');
    if (schemaVersion !== '5') {
      localStorage.setItem('sv_user_orders', JSON.stringify(INITIAL_USER_ORDERS));
      localStorage.setItem('sv_user_pickups', JSON.stringify(INITIAL_USER_PICKUPS));
      localStorage.setItem('sv_user_sales', JSON.stringify(INITIAL_USER_SALES));
      localStorage.setItem('sv_collector_pickups', JSON.stringify(INITIAL_COLLECTOR_PICKUPS));
      localStorage.setItem('sv_auth_schema_ver', '5');
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

  const [userSales, setUserSales] = useState(() => {
    try {
      const saved = localStorage.getItem('sv_user_sales');
      return saved ? JSON.parse(saved) : INITIAL_USER_SALES;
    } catch {
      return INITIAL_USER_SALES;
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
    localStorage.setItem('sv_user_sales', JSON.stringify(userSales));
  }, [userSales]);

  useEffect(() => {
    localStorage.setItem('sv_collector_pickups', JSON.stringify(collectorPickups));
  }, [collectorPickups]);

  useEffect(() => {
    localStorage.setItem('sv_collector_applications', JSON.stringify(collectorApplications));
  }, [collectorApplications]);

  // Customer / User Login
  const loginUser = (emailOrPhone, password) => {
    const cleanInput = (emailOrPhone || '').trim();
    const cleanLower = cleanInput.toLowerCase();

    // 1. Pre-configured Sazzad Demo Customer
    if (
      cleanLower === 'sazzad.customer@gmail.com' ||
      cleanInput === '01712-345678' ||
      cleanInput === '01712345678'
    ) {
      const user = {
        id: 'USR-7821',
        name: 'Sazzad M Rahman',
        email: 'sazzad.customer@gmail.com',
        phone: '01712-345678',
        role: 'user',
        address: 'House 42, Road 11, Block D, Banani, Dhaka',
        joinedDate: 'October 2026',
        verified: true,
        avatar: null,
        totalRecycledKg: 112,
        rewardPoints: 240
      };
      setCurrentUser(user);
      return { success: true, user };
    }

    // 2. Lookup existing registered customer
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('sv_registered_users') || '[]');
    } catch {
      registeredUsers = [];
    }

    const matched = registeredUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanLower) ||
        (u.phone && u.phone.replace(/[\s-]/g, '') === cleanInput.replace(/[\s-]/g, ''))
    );

    if (matched) {
      setCurrentUser(matched);
      return { success: true, user: matched };
    }

    // 3. Create persistent record for new login
    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: cleanInput.includes('@') ? cleanInput.split('@')[0].replace(/[._]/g, ' ') : 'Customer',
      email: cleanInput.includes('@') ? cleanInput : `${cleanInput.replace(/[^0-9]/g, '') || 'customer'}@scrapventure.xyz`,
      phone: cleanInput.includes('@') ? '01712-345678' : cleanInput,
      role: 'user',
      address: 'Dhaka, Bangladesh',
      joinedDate: 'October 2026',
      verified: true,
      avatar: null,
      totalRecycledKg: 0,
      rewardPoints: 50
    };

    registeredUsers.push(newUser);
    try {
      localStorage.setItem('sv_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }

    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Google Sign-in (Architecture ready for real Google OAuth2 / Firebase / Backend DB)
  const loginWithGoogle = (googleProfile = {}) => {
    const email = googleProfile.email?.trim() || 'sazzad.customer@gmail.com';
    if (email.toLowerCase() === 'sazzad.customer@gmail.com') {
      const user = {
        id: 'USR-7821',
        name: 'Sazzad M Rahman',
        email: 'sazzad.customer@gmail.com',
        phone: '01712-345678',
        role: 'user',
        address: 'House 42, Road 11, Block D, Banani, Dhaka',
        joinedDate: 'October 2026',
        verified: true,
        avatar: googleProfile.avatar || null,
        totalRecycledKg: 112,
        rewardPoints: 240,
        authProvider: 'google',
        isGoogleAuth: true
      };
      setCurrentUser(user);
      return { success: true, user };
    }

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
      verified: true,
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
      verified: true,
      totalRecycledKg: 30,
      rewardPoints: 120,
      isAppleAuth: true
    };
    setCurrentUser(user);
    return { success: true, user };
  };

  // Customer Registration
  const registerUser = (data) => {
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('sv_registered_users') || '[]');
    } catch {
      registeredUsers = [];
    }

    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: data.name || 'New Customer',
      email: data.email || 'customer@scrapventure.xyz',
      phone: data.phone || '01700-000000',
      address: data.address || 'Dhaka, Bangladesh',
      role: 'user',
      joinedDate: 'Today',
      verified: true,
      avatar: null,
      totalRecycledKg: 0,
      rewardPoints: 50
    };

    registeredUsers.push(newUser);
    try {
      localStorage.setItem('sv_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }

    setCurrentUser(newUser);
    return { success: true, user: newUser };
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

    // 1. Instant Pre-approved Registered Collectors
    const REGISTERED_COLLECTORS = [
      {
        id: 'COL-104',
        name: 'Rafiqul Islam',
        email: 'rafiq.collector@scrapventure.xyz',
        phone: '01819-876543',
        cleanPhone: '01819876543',
        role: 'collector',
        badgeId: 'COL-104',
        zone: 'Dhaka North (Banani, Gulshan, Uttara)',
        vehicle: 'Motorized Van (ঢাকা মেট্রো-হ ১১-২২৩৩)',
        joinedDate: 'January 2026',
        totalPickupsDone: 94,
        totalWeightCollected: 1420,
        totalEarnings: 42500,
        status: 'Active',
        approved: true,
        rating: '4.95'
      },
      {
        id: 'COL-001',
        name: 'Md. Faruk Hossain',
        email: 'faruk.collector@scrapventure.xyz',
        phone: '01718-445566',
        cleanPhone: '01718445566',
        altPhone: '01911234567',
        role: 'collector',
        badgeId: 'COL-001',
        zone: 'Uttara (Sector 1 to 14)',
        vehicle: 'Van-04 (Electric)',
        joinedDate: 'December 2025',
        totalPickupsDone: 148,
        totalWeightCollected: 2150,
        totalEarnings: 32400,
        status: 'Active',
        approved: true,
        rating: '4.9'
      },
      {
        id: 'COL-002',
        name: 'Shahidul Islam',
        email: 'shahidul.collector@scrapventure.xyz',
        phone: '01812-334455',
        cleanPhone: '01812334455',
        altPhone: '01711889900',
        role: 'collector',
        badgeId: 'COL-002',
        zone: 'Mirpur & Pallabi',
        vehicle: 'Van-12 (Electric)',
        joinedDate: 'February 2026',
        totalPickupsDone: 112,
        totalWeightCollected: 1680,
        totalEarnings: 24500,
        status: 'Active',
        approved: true,
        rating: '4.8'
      },
      {
        id: 'COL-003',
        name: 'Jasim Uddin',
        email: 'jasim.collector@scrapventure.xyz',
        phone: '01911-667788',
        cleanPhone: '01911667788',
        altPhone: '01815667788',
        role: 'collector',
        badgeId: 'COL-003',
        zone: 'Gulshan & Banani',
        vehicle: 'E-Trike 02',
        joinedDate: 'March 2026',
        totalPickupsDone: 94,
        totalWeightCollected: 1410,
        totalEarnings: 21100,
        status: 'Active',
        approved: true,
        rating: '4.9'
      },
      {
        id: 'COL-004',
        name: 'Anwar Ali',
        email: 'anwar.collector@scrapventure.xyz',
        phone: '01612-889900',
        cleanPhone: '01612889900',
        role: 'collector',
        badgeId: 'COL-004',
        zone: 'Dhanmondi & Mohammadpur',
        vehicle: 'Van-07 (Electric)',
        joinedDate: 'April 2026',
        totalPickupsDone: 82,
        totalWeightCollected: 1230,
        totalEarnings: 17800,
        status: 'Active',
        approved: true,
        rating: '4.7'
      }
    ];

    const matchedCollector = REGISTERED_COLLECTORS.find((c) => {
      return (
        c.cleanPhone === cleanPhone ||
        c.altPhone === cleanPhone ||
        c.phone === cleanInput ||
        c.email.toLowerCase() === cleanInput.toLowerCase() ||
        (cleanInput.toLowerCase() === 'demo' && c.id === 'COL-104')
      );
    });

    if (matchedCollector) {
      setCurrentUser(matchedCollector);
      return { success: true, user: matchedCollector };
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
        totalEarnings: 0,
        status: 'Active',
        approved: true,
        rating: '5.0'
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

  // Update User / Collector Profile Settings
  const updateUserSettings = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    try {
      const registeredUsers = JSON.parse(localStorage.getItem('sv_registered_users') || '[]');
      const idx = registeredUsers.findIndex((u) => u.id === updated.id);
      if (idx !== -1) {
        registeredUsers[idx] = updated;
        localStorage.setItem('sv_registered_users', JSON.stringify(registeredUsers));
      }
    } catch (e) {
      console.error(e);
    }

    return { success: true, user: updated };
  };

  // Change Password
  const changePassword = (currentPass, newPass) => {
    // Simulated secure password update
    return { success: true };
  };

  // Add a new Pickup request for user
  const addUserPickup = (newPickup) => {
    setUserPickups((prev) => [newPickup, ...prev]);
  };

  // Add a new Selling Transaction for user
  const addUserSale = (newSale) => {
    setUserSales((prev) => [newSale, ...prev]);
  };

  // Add a new Marketplace order for user
  const addUserOrder = (newOrder) => {
    setUserOrders((prev) => [newOrder, ...prev]);
  };

  // Collector Updates a Task's status / weighed amount with cross-dashboard synchronization
  const updateCollectorTask = (taskId, newStatus, weight, amount, customNotes) => {
    const numericWeight = weight ? parseFloat(String(weight).replace(/[^0-9.]/g, '')) : null;
    const weightStr = numericWeight ? `${numericWeight} kg` : null;
    const payoutStr = amount ? `৳ ${String(amount).replace(/[^0-9]/g, '')}` : null;
    const completionDate = new Date().toISOString();

    // 1. Update collectorPickups
    setCollectorPickups((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const earned = numericWeight ? Math.round(numericWeight * 5) : (t.collectorEarnings || 100);
          return {
            ...t,
            status: newStatus,
            actualWeight: weightStr || t.actualWeight || t.collectedWeight,
            collectedWeight: weightStr || t.collectedWeight || t.actualWeight,
            finalWeight: weightStr || t.finalWeight || t.actualWeight,
            cashPaid: payoutStr || t.cashPaid || t.payout,
            payout: payoutStr || t.payout || t.cashPaid,
            collectorEarnings: newStatus === 'Completed' ? earned : t.collectorEarnings,
            completedAt: newStatus === 'Completed' ? completionDate : t.completedAt,
            notes: customNotes || t.notes
          };
        }
        return t;
      });
      try {
        localStorage.setItem('sv_collector_pickups', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // 2. Synchronize to userPickups
    setUserPickups((prev) => {
      const updated = prev.map((u) => {
        if (u.id === taskId) {
          return {
            ...u,
            status: newStatus,
            actualWeight: weightStr || u.actualWeight,
            earnedAmount: payoutStr || u.earnedAmount,
            completedDate: newStatus === 'Completed' ? completionDate : u.completedDate,
            notes: customNotes || u.notes
          };
        }
        return u;
      });
      try {
        localStorage.setItem('sv_user_pickups', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // 3. Synchronize to sv_admin_pickups
    try {
      const adminPickups = JSON.parse(localStorage.getItem('sv_admin_pickups') || '[]');
      const aIdx = adminPickups.findIndex((a) => a.id === taskId);
      if (aIdx !== -1) {
        adminPickups[aIdx].status = newStatus === 'In Progress' ? 'In Transit' : newStatus;
        if (weightStr) adminPickups[aIdx].actualWeight = weightStr;
        if (payoutStr) adminPickups[aIdx].paidPayout = payoutStr;
        localStorage.setItem('sv_admin_pickups', JSON.stringify(adminPickups));
      }
    } catch (e) {
      console.error(e);
    }

    // 4. If Completed, create user sales receipt if customer has matching record
    if (newStatus === 'Completed') {
      try {
        const allColPickups = JSON.parse(localStorage.getItem('sv_collector_pickups') || '[]');
        const target = allColPickups.find((p) => p.id === taskId);
        if (target && target.userId) {
          const saleRecord = {
            id: `TXN-${Date.now().toString().slice(-4)}`,
            userId: target.userId,
            pickupId: taskId,
            date: new Date().toISOString().slice(0, 10),
            completedDate: completionDate,
            category: 'Mixed Recyclables',
            materialName: Array.isArray(target.materials) ? target.materials.join(', ') : 'Collected Scrap Materials',
            collectedWeight: numericWeight || 25,
            weightUnit: 'kg',
            pricePerKg: numericWeight ? Math.round(Number(String(amount || 500).replace(/[^0-9]/g, '')) / numericWeight) : 25,
            totalAmount: Number(String(amount || 500).replace(/[^0-9]/g, '')),
            collectorName: currentUser?.name || 'Assigned Collector',
            collectorBadge: currentUser?.badgeId || 'Collector',
            collectorPhone: currentUser?.phone || 'Field Operations',
            status: 'Verified',
            paymentStatus: 'Cash / Digital Paid',
            paymentMethod: 'Instant Handover',
            address: target.address,
            notes: customNotes || 'Verified scale weighing on site.'
          };
          addUserSale(saleRecord);
        }
      } catch (e) {
        console.error(e);
      }
    }

    window.dispatchEvent(new Event('sv_pickups_sync'));
  };

  // Collector reports an issue with an assignment (e.g. customer unavailable, wrong address)
  const reportCollectorIssue = (taskId, issueCategory, issueNote) => {
    setCollectorPickups((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'Issue Reported',
            issue: {
              category: issueCategory,
              note: issueNote,
              reportedAt: new Date().toISOString()
            }
          };
        }
        return t;
      });
      try {
        localStorage.setItem('sv_collector_pickups', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      const adminPickups = JSON.parse(localStorage.getItem('sv_admin_pickups') || '[]');
      const aIdx = adminPickups.findIndex((a) => a.id === taskId);
      if (aIdx !== -1) {
        adminPickups[aIdx].status = 'Issue Reported';
        adminPickups[aIdx].issue = { category: issueCategory, note: issueNote };
        localStorage.setItem('sv_admin_pickups', JSON.stringify(adminPickups));
      }
    } catch (e) {
      console.error(e);
    }

    window.dispatchEvent(new Event('sv_pickups_sync'));
    return { success: true };
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
        userSales,
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
        addUserPickup,
        addUserSale,
        addUserOrder,
        updateCollectorTask,
        reportCollectorIssue,
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

