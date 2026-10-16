import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

const STORAGE_KEY = 'scrapventure_admin_session';

const DEFAULT_ADMIN = {
  name: 'Motaleb Hossain Emon',
  email: 'admin@scrapventure.com',
  role: 'Super Administrator',
  avatar: '/assets/team/founder-ceo-motaleb-emon.jpg',
  badge: 'Admin Lead',
};

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed?.authenticated);
      }
    } catch {
      // fallback
    }
    // Default to true for seamless instant review if user visits directly,
    // or keep session persistent
    return true;
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) return parsed.user;
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN;
  });

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Allow admin@scrapventure.com or any non-empty input
        if (!email || !password) {
          reject(new Error('Please provide both email and password.'));
          return;
        }

        const user = {
          ...DEFAULT_ADMIN,
          email: email.trim().toLowerCase(),
        };

        setIsAuthenticated(true);
        setAdminUser(user);
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ authenticated: true, user })
          );
        } catch (e) {
          console.error(e);
        }
        resolve(user);
      }, 300);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

