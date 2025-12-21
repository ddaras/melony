import type { AuthService } from "@melony/react";

export const createMelonyAuthService = (): AuthService => {
  return {
    getToken: () => null,
    getMe: async () => null,
    login: () => {
      // No-op for this example
    },
    logout: async () => {
      // No-op for this example
    },
  };
};

