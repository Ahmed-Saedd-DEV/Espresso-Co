import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types/auth';
import { authApi } from '../api/auth';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  authState: AuthState;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'espresso-access-token';
const USER_KEY = 'espresso-auth-user';

function normalizeRole(role?: string): User['role'] {
  const rawRole = String(role ?? '').toUpperCase();
  if (rawRole === 'ADMIN' || rawRole === 'ADMINISTRATOR') return 'admin';
  return 'customer';
}

function decodeJwtRole(token: string): User['role'] {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded));
    return normalizeRole(decoded.role);
  } catch {
    return 'customer';
  }
}

async function hydrateSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return null;
  }

  try {
    const profile = await authApi.getProfile();
    const nextUser: User = {
      id: String(profile.id ?? Date.now()),
      name: profile.name,
      email: profile.email,
      role: normalizeRole((profile.role as string) ?? decodeJwtRole(token)),
      verified: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return nextUser;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    const restore = async () => {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored) as User);
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }

      const sessionUser = await hydrateSession();
      setUser(sessionUser ?? null);
      setAuthState(sessionUser ? 'authenticated' : 'unauthenticated');
    };

    void restore();
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email and password are required.');

    const response = await authApi.login({ email, password });
    if (!response.token) {
      throw new Error('No access token was returned by the server.');
    }

    localStorage.setItem(TOKEN_KEY, response.token);

    const profile = await authApi.getProfile();
    const nextUser: User = {
      id: String(profile.id ?? Date.now()),
      name: profile.name,
      email: profile.email,
      role: normalizeRole((profile.role as string) ?? decodeJwtRole(response.token)),
      verified: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setAuthState('authenticated');
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) throw new Error('Please complete all required fields.');

    await authApi.register({ name, email, password });
    await login(email, password);
  };

  const logout = () => {
    try {
      void authApi.logout();
    } catch {
      // best effort only
    }

    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setAuthState('unauthenticated');
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authState,
      isLoading: authState === 'loading',
      login,
      logout,
      register,
    }),
    [user, authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
