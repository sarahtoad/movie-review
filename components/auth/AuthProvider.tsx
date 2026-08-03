"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthUser } from "@/types/auth";
import { apiFetch } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: AuthUser }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await refreshUser();
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (input: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => {
      const data = await apiFetch<{ user: AuthUser }>("/api/auth/register", {
        method: "POST",
        body: input,
      });
  
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
  
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
