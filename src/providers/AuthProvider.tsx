'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'client';
  scopes: Record<string, boolean>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    
    // Demo: Auto-login as Super Admin
    const demoUser: User = {
      id: 'demo_superadmin_001',
      email: 'admin@celaest.com',
      name: 'CELAEST Admin',
      role: 'super_admin',
      scopes: {
        'templates:write': true,
        'templates:read': true,
        'billing:read': true,
        'billing:write': true,
        'users:manage': true,
        'analytics:read': true,
        'releases:write': true,
        'releases:read': true,
        'marketplace:purchase': true,
      }
    };
    
    setUser(demoUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement real authentication
    const demoUser: User = {
      id: 'demo_001',
      email,
      name: email.split('@')[0],
      role: 'admin',
      scopes: {
        'templates:read': true,
        'billing:read': true,
      }
    };
    
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
