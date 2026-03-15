"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { login as apiLogin } from '../lib/api';
import jwtDecode from 'jwt-decode';

interface AuthState {
  token: string | null;
  email: string | null;
  userId: number | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface JwtPayload {
  sub?: string;
  user_id?: number;
}

const TOKEN_KEY = 'blog_token';
const EMAIL_KEY = 'blog_email';
const USER_ID_KEY = 'blog_user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    email: null,
    userId: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(TOKEN_KEY);
    const email = localStorage.getItem(EMAIL_KEY);
    const userIdRaw = localStorage.getItem(USER_ID_KEY);
    const userId = userIdRaw ? Number(userIdRaw) : null;

    if (token) {
      setState({
        token,
        email,
        userId,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    const token = res.access_token;

    let userId: number | null = null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (typeof decoded.user_id === 'number') {
        userId = decoded.user_id;
      } else if (decoded.sub) {
        const maybeId = Number(decoded.sub);
        userId = Number.isNaN(maybeId) ? null : maybeId;
      }
    } catch {
      // ignore decode errors; ownership checks will be skipped
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(EMAIL_KEY, email);
      if (userId !== null) {
        localStorage.setItem(USER_ID_KEY, String(userId));
      }
    }

    setState({
      token,
      email,
      userId,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
    setState({ token: null, email: null, userId: null, isAuthenticated: false });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
