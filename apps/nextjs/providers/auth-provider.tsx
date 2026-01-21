import React, { createContext, useCallback, ReactNode } from "react";
import { User, AuthService } from "@/types";
import { WelcomeScreen, WelcomeScreenProps } from "@/components/welcome-screen";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export interface AuthProviderProps {
  children: ReactNode;
  service: AuthService;
  welcomeScreenProps?: WelcomeScreenProps;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  service,
  welcomeScreenProps,
}) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user", service],
    queryFn: () => service.getMe(),
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => service.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["auth-user", service], null);
    },
  });

  const login = useCallback(() => {
    service.login();
  }, [service]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [logoutMutation]);

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

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getToken: service.getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!value.isAuthenticated && welcomeScreenProps ? (
        <WelcomeScreen {...welcomeScreenProps} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
