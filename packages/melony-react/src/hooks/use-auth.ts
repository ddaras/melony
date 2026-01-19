import { useContext } from "react";
import { AuthContext, AuthContextValue } from "@/providers/auth-provider";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
