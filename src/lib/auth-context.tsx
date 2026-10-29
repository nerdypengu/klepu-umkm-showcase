import * as React from "react";
import { loginUserServerFn, logoutUserServerFn, registerMitraServerFn, type UserProfile } from "@/lib/auth.functions";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    password: string;
    fullName: string;
    phone: string;
    mitraType?: "personal" | "organisasi" | "persero";
    organizationName?: string | null;
    organizationPosition?: string | null;
    address?: string | null;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "klepu_auth_user";
const TOKEN_KEY = "klepu_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginUserServerFn({ data: { username, password } });
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
        if (res.token) {
          setToken(res.token);
          localStorage.setItem(TOKEN_KEY, res.token);
        }
        return { success: true };
      }
      return { success: false, error: res.error || "Login gagal" };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat login";
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    password: string;
    fullName: string;
    phone: string;
    mitraType?: "personal" | "organisasi" | "persero";
    organizationName?: string | null;
    organizationPosition?: string | null;
    address?: string | null;
  }) => {
    setIsLoading(true);
    try {
      const res = await registerMitraServerFn({ data });
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || "Pendaftaran gagal" };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran";
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (token) {
      logoutUserServerFn({ data: { token } }).catch(() => {});
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
