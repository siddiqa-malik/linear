"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { api, getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (
    googleData: { name: string; email: string; avatar?: string },
    options?: { isSignUp?: boolean }
  ) => Promise<{ isNewUser?: boolean }>;
  checkEmailExists: (email: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const userData = res?.data || res?.user;
      if (userData) {
        if (typeof window !== "undefined" && userData.email) {
          sessionStorage.setItem("recent_auth_email", userData.email);
        }
        setUser({
          _id: userData._id || userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role || "user",
          createdAt: userData.createdAt || new Date().toISOString(),
        });
        setTokenState(currentToken);
      } else {
        removeAuthToken();
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("recent_auth_email");
        }
        setUser(null);
        setTokenState(null);
      }
    } catch {
      removeAuthToken();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("recent_auth_email");
      }
      setUser(null);
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res?.data?.token || res?.token;
      const userData = res?.data?.user || res?.user;

      if (token && userData) {
        if (typeof window !== "undefined" && userData.email) {
          sessionStorage.setItem("recent_auth_email", userData.email);
        }
        setAuthToken(token);
        setTokenState(token);
        setUser({
          _id: userData.id || userData._id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role || "user",
          createdAt: userData.createdAt || new Date().toISOString(),
        });
      } else {
        throw new Error(res?.message || "Invalid login response from backend");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Create user in MongoDB database via TaskFlow backend
      await api.post("/auth/register", { name, email, password });

      // 2. Obtain real JWT token and session from backend
      const loginRes = await api.post("/auth/login", { email, password });
      const token = loginRes?.data?.token || loginRes?.token;
      const userData = loginRes?.data?.user || loginRes?.user;

      if (token && userData) {
        if (typeof window !== "undefined" && userData.email) {
          sessionStorage.setItem("recent_auth_email", userData.email);
        }
        setAuthToken(token);
        setTokenState(token);
        setUser({
          _id: userData.id || userData._id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role || "user",
          createdAt: userData.createdAt || new Date().toISOString(),
        });
      } else {
        throw new Error(loginRes?.message || "Account created, but failed to log in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/check-email", { email: email.trim().toLowerCase() });
      return !!res?.exists;
    } catch {
      return false;
    }
  };

  const loginWithGoogle = async (
    googleData: { name: string; email: string; avatar?: string },
    options?: { isSignUp?: boolean }
  ): Promise<{ isNewUser?: boolean }> => {
    setIsLoading(true);
    try {
      const isSignUp = !!options?.isSignUp;
      const res = await api.post("/auth/google", {
        name: googleData.name,
        email: googleData.email,
        avatar: googleData.avatar,
        isSignUp,
      });

      const token = res?.data?.token || res?.token;
      const userData = res?.data?.user || res?.user;
      const isNewUser = !!res?.data?.isNewUser;

      if (token && userData) {
        const finalEmail = userData.email || googleData.email;
        if (typeof window !== "undefined" && finalEmail) {
          sessionStorage.setItem("recent_auth_email", finalEmail);
        }
        setAuthToken(token);
        setTokenState(token);
        setUser({
          _id: userData.id || userData._id,
          name: userData.name || googleData.name,
          email: userData.email || googleData.email,
          avatar: googleData.avatar || userData.avatar,
          role: userData.role || "user",
          createdAt: userData.createdAt || new Date().toISOString(),
        });
        return { isNewUser };
      } else {
        throw new Error(res?.message || "Failed to authenticate Google user with backend database");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("recent_auth_email");
    }
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        checkEmailExists,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}