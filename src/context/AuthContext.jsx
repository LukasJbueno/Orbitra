import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('orbitra_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem('orbitra_auth');
      }
    }
    setLoading(false);
  }, []);

  const persist = (token, user) => {
    localStorage.setItem('orbitra_auth', JSON.stringify({ token, user }));
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email, password) => {
    const result = await api.login(email, password);
    persist(result.token, result.user);
    return result.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const result = await api.register(name, email, password);
    persist(result.token, result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('orbitra_auth');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
