import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { User, AuthService } from "@/types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export interface AuthProviderProps {
  children: ReactNode;
  service: AuthService;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  service,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await service.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(() => {
    service.login();
  }, [service]);

  const logout = useCallback(async () => {
    try {
      await service.logout();
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [service]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getToken: service.getToken,
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
        }}
        className="text-muted-foreground animate-pulse"
      >
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
