'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService } from '../../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, full_name: string, role: string) => Promise<boolean>;
  logout: () => void;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  if (typeof window !== 'undefined' && window.location.hostname.includes('stadium-os-frontend')) {
    url = window.location.origin.replace('stadium-os-frontend', 'stadium-os-backend');
  }
  return url;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = getApiUrl();

  const autoLoginOrganizer = async () => {
    try {
      const data = await authService.login({ email: 'organizer@fifa.com', password: 'strongpassword123' });
      localStorage.setItem('stadium_token', data.access_token);
      setToken(data.access_token);
      await fetchProfile(data.access_token);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('stadium_token');
    if (savedToken) {
      setToken(savedToken);
      fetchProfile(savedToken);
    } else {
      autoLoginOrganizer();
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('stadium_token', data.access_token);
      setToken(data.access_token);
      await fetchProfile(data.access_token);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (email: string, password: string, full_name: string, role: string): Promise<boolean> => {
    try {
      await authService.signup({ email, password, full_name, role });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('stadium_token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (res.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Request failed');
    }
    return res.json();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
