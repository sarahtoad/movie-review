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

type AuthResponse = {
  user: AuthUser;
  token?: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // Ensure token exists before attempting refresh
      const token = typeof window !== "undefined" ? localStorage.getItem("cinehub_token") : null;
      if (!token) {
        setUser(null);
        return;
      }
  
      const data = await apiFetch<AuthResponse>("/api/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("cinehub_token");
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
    const data = await apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  
    if (data.token) {
      localStorage.setItem("cinehub_token", data.token);
    }
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (input: { name: string; username: string; email: string; password: string }) => {
      const data = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: input,
      });
  
      if (data.token) {
        localStorage.setItem("cinehub_token", data.token);
      }
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout network errors
    } finally {
      localStorage.removeItem("cinehub_token");
      setUser(null);
    }
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
