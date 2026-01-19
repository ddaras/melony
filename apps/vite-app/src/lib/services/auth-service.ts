import type { AuthService } from "@melony/react";

export const TOKEN_STORAGE_KEY = "melony_auth_token";

const DEFAULT_AUTH_URL =
  "https://auth-service-549776254754.us-central1.run.app";

export const createMelonyAuthService = (
  config: {
    authBaseUrl?: string;
    getToken?: () => string | null;
  } = {},
): AuthService => {
  const authBaseUrl = config.authBaseUrl || DEFAULT_AUTH_URL;

  const getToken = () => {
    if (config.getToken) return config.getToken();

    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) return storedToken;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      urlParams.delete("token");
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", newUrl);
      return token;
    }

    return null;
  };

  return {
    getToken,
    getMe: async () => {
      const token = getToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${authBaseUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (response.ok) return await response.json();
      return null;
    },
    login: () => {
      window.location.href = `${authBaseUrl}/api/auth/google`;
    },
    logout: async () => {
      const response = await fetch(`${authBaseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    },
  };
};
