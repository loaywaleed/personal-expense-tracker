import { useState, useEffect } from "react";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth";
import { AuthContext } from "./auth-context-types";
import { api } from "../lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const { data } = await api.get<{ user: User }>("/auth/user", {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Auth check failed:", error.response?.data);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await api.post<AuthResponse>(
        "/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );
      setUser(data.user);
      toast.success("Successfully logged in!");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Invalid credentials";
        toast.error(message);
      }
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data } = await api.post<AuthResponse>(
        "/auth/register",
        credentials,
        {
          withCredentials: true,
        }
      );
      setUser(data.user);
      toast.success("Registration successful!");
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Registration failed";
        toast.error(message);
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    document.cookie =
      "ecomm-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Successfully logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
