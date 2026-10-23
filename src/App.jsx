import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Awards from './pages/Awards.jsx';
import Marketplace from './pages/Marketplace.jsx';
import BookPickup from './pages/BookPickup.jsx';
import Team from './pages/Team.jsx';
import CollectorRegistration from './pages/CollectorRegistration.jsx';
import Blog from './pages/Blog.jsx';
import Contact from './pages/Contact.jsx';

// Admin System
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminMarketplace from './pages/admin/AdminMarketplace.jsx';
import AdminScrapPickup from './pages/admin/AdminScrapPickup.jsx';
import AdminEmployeesCollectors from './pages/admin/AdminEmployeesCollectors.jsx';
import AdminTeamMembers from './pages/admin/AdminTeamMembers.jsx';
import AdminBlogs from './pages/admin/AdminBlogs.jsx';
import AdminAwards from './pages/admin/AdminAwards.jsx';
import AdminCampaigns from './pages/admin/AdminCampaigns.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

<<<<<<< HEAD
// User & Collector Auth System
import { AuthProvider } from './context/AuthContext.jsx';
import UserLogin from './pages/auth/UserLogin.jsx';
import CollectorLogin from './pages/auth/CollectorLogin.jsx';
import UserDashboard from './pages/dashboard/UserDashboard.jsx';
import CollectorDashboard from './pages/dashboard/CollectorDashboard.jsx';

=======
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Disable browser automatic scroll restoration to prevent jumping down on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If loaded or refreshed with a hash (e.g. #cta), strip it from the URL so it stays clean
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Always ensure the page starts at the very top (0, 0)
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    // When changing routes (e.g. /marketplace or /), always scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
<<<<<<< HEAD
    <AuthProvider>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/awards.html" element={<Awards />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team.html" element={<Team />} />
          <Route path="/our-team" element={<Team />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace.html" element={<Marketplace />} />
          <Route path="/book-pickup" element={<BookPickup />} />
          <Route path="/book-pickup.html" element={<BookPickup />} />
          <Route path="/become-a-collector" element={<CollectorRegistration />} />
          <Route path="/become-a-collector.html" element={<CollectorRegistration />} />
          <Route path="/collector" element={<CollectorRegistration />} />
          <Route path="/collector.html" element={<CollectorRegistration />} />
          <Route path="/become-collector" element={<CollectorRegistration />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog.html" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />

          {/* User Authentication & Dashboard */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/login.html" element={<UserLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/register" element={<UserLogin />} />
          <Route path="/user/register" element={<UserLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard.html" element={<UserDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/pickups" element={<UserDashboard />} />
          <Route path="/dashboard/selling-history" element={<UserDashboard />} />
          <Route path="/dashboard/orders" element={<UserDashboard />} />
          <Route path="/dashboard/settings" element={<UserDashboard />} />

          {/* Collector Authentication & Portal */}
          <Route path="/collector/login" element={<CollectorLogin />} />
          <Route path="/collector-login" element={<CollectorLogin />} />
          <Route path="/collector/register" element={<CollectorLogin />} />
          <Route path="/collector/dashboard" element={<CollectorDashboard />} />
          <Route path="/collector-dashboard" element={<CollectorDashboard />} />
          <Route path="/collector/orders" element={<CollectorDashboard />} />
          <Route path="/collector/settings" element={<CollectorDashboard />} />
          <Route path="/collector/dashboard/orders" element={<CollectorDashboard />} />
          <Route path="/collector/dashboard/settings" element={<CollectorDashboard />} />

          {/* Admin Login Portal */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Authenticated Admin Dashboard & Operations */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/marketplace" element={<AdminMarketplace />} />
            <Route path="/admin/scrap-pickup" element={<AdminScrapPickup />} />
            <Route path="/admin/employees-collectors" element={<AdminEmployeesCollectors />} />
            <Route path="/admin/collectors" element={<Navigate to="/admin/employees-collectors" replace />} />
            <Route path="/admin/team-members" element={<AdminTeamMembers />} />
            <Route path="/admin/team" element={<Navigate to="/admin/team-members" replace />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/blog" element={<Navigate to="/admin/blogs" replace />} />
            <Route path="/admin/awards" element={<AdminAwards />} />
            <Route path="/admin/campaigns" element={<AdminCampaigns />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
=======
    <AdminAuthProvider>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/awards.html" element={<Awards />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team.html" element={<Team />} />
        <Route path="/our-team" element={<Team />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace.html" element={<Marketplace />} />
        <Route path="/book-pickup" element={<BookPickup />} />
        <Route path="/book-pickup.html" element={<BookPickup />} />
        <Route path="/become-a-collector" element={<CollectorRegistration />} />
        <Route path="/become-a-collector.html" element={<CollectorRegistration />} />
        <Route path="/collector" element={<CollectorRegistration />} />
        <Route path="/collector.html" element={<CollectorRegistration />} />
        <Route path="/become-collector" element={<CollectorRegistration />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog.html" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact.html" element={<Contact />} />
        <Route path="/contact-us" element={<Contact />} />

        {/* Admin Login Portal */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Authenticated Admin Dashboard & Operations */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/marketplace" element={<AdminMarketplace />} />
          <Route path="/admin/scrap-pickup" element={<AdminScrapPickup />} />
          <Route path="/admin/employees-collectors" element={<AdminEmployeesCollectors />} />
          <Route path="/admin/collectors" element={<Navigate to="/admin/employees-collectors" replace />} />
          <Route path="/admin/team-members" element={<AdminTeamMembers />} />
          <Route path="/admin/team" element={<Navigate to="/admin/team-members" replace />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/blog" element={<Navigate to="/admin/blogs" replace />} />
          <Route path="/admin/awards" element={<AdminAwards />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
>>>>>>> 3fbf89bad36747bac50ac0e7c8cd9af3b3f77957
  );
}
