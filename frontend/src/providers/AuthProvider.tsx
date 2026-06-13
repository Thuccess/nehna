'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { RegisterInput, SellerRegisterInput, User } from '@adulis/shared';
import { ApiError, api } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    identifier: string,
    password: string,
    intent?: 'buyer' | 'seller' | 'admin',
  ) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  registerSeller: (input: SellerRegisterInput) => Promise<{ user: User; businessId: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (identifier: string, password: string, intent?: 'buyer' | 'seller' | 'admin') => {
      const res = await api.login({ identifier, password, intent });
      setUser(res.user);
      return res.user;
    },
    [],
  );

  const register = useCallback(async (input: RegisterInput) => {
    const res = await api.register(input);
    if (res.token) setUser(res.user);
    return res.user;
  }, []);

  const registerSeller = useCallback(async (input: SellerRegisterInput) => {
    const res = await api.registerSeller(input);
    if (res.token) setUser(res.user);
    return { user: res.user, businessId: res.business.id };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, registerSeller, logout, refresh }),
    [user, loading, login, register, registerSeller, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
