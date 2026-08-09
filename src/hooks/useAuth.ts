import { useCallback, useState } from "react";

export interface AuthUser {
  id: number;
  userName: string;
  fullName: string;
  role: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const login = useCallback((accessToken: string, userData: AuthUser) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400`;
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    document.cookie = "accessToken=; path=/; max-age=0";
    setToken(null);
    setUser(null);
  }, []);

  return { isLoggedIn: !!token, token, user, login, logout };
}