'use client';
// hooks/useAuth.tsx
// Contexte d'authentification côté client : charge l'utilisateur courant
// via GET /api/auth/me au montage (le cookie httpOnly est déjà là si connecté).

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiFetch } from '../lib/api';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email:string,password:string)=>{
    const data = await apiFetch<{user:User}>(
        "/api/auth/login",
        {
            method:"POST",
            body:{email,password}
        }
    );

    setUser(data.user);
};

  const register = async (input: { name: string; username: string; email: string; password: string }) => {
    const data = await apiFetch<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: input,
    });

    setUser(data.user);
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
