'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserSession } from '@/lib/api';

interface AuthContextType {
  user: UserSession | null;
  login: (role: 'Admin' | 'Teknisi' | 'Supervisor') => void;
  switchRole: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  switchRole: () => { },
  logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    // Check saved session in localStorage on mount
    const saved = localStorage.getItem('injourney_fids_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) { }
    } else {
      // Default initial session for direct demo landing
      const defaultUser: UserSession = {
        id: 'usr-001',
        name: 'Administrator',
        role: 'Admin',
        username: 'admin.fids',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        token: 'demo-token-admin'
      };
      setUser(defaultUser);
      localStorage.setItem('injourney_fids_session', JSON.stringify(defaultUser));
    }

    // Auto-recovery for HMR / Dev Chunk disconnect after long idle time (>5 mins)
    let lastActive = Date.now();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        // If tab was idle in background for over 5 minutes (300,000 ms)
        if (now - lastActive > 300000) {
          queryClient.invalidateQueries();
        }
        lastActive = now;
      }
    };

    const handleChunkError = (e: ErrorEvent) => {
      if (
        e?.message?.includes('Cannot find module') ||
        e?.message?.includes('Loading chunk') ||
        e?.message?.includes('PageNotFoundError')
      ) {
        e.preventDefault();
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('error', handleChunkError);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleChunkError);
    };
  }, [queryClient]);

  const login = (role: 'Admin' | 'Teknisi' | 'Supervisor') => {
    const session: UserSession = {
      id: role === 'Admin' ? 'usr-001' : role === 'Teknisi' ? 'usr-002' : 'usr-003',
      name: role === 'Admin' ? 'Administrator FIDS' : role === 'Teknisi' ? 'Teknisi Maintenance' : 'Supervisor SLA',
      role: role,
      username: role === 'Admin' ? 'admin.fids' : role === 'Teknisi' ? 'teknisi.fids' : 'supervisor.fids',
      avatar: role === 'Admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      token: `jwt-token-${role.toLowerCase()}-${Date.now()}`
    };
    setUser(session);
    localStorage.setItem('injourney_fids_session', JSON.stringify(session));
  };

  const switchRole = () => {
    if (!user) return;
    const newRole = user.role === 'Admin' ? 'Teknisi' : 'Admin';
    login(newRole);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('injourney_fids_session');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, login, switchRole, logout }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
