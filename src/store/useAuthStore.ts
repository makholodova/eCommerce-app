import { computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { useTokenStore } from "./useTokenStore";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

export const useAuthStore = defineStore("auth", () => {
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  const REFRESH_BUFFER_MS = 1000 * 60 * 5;
  let isRefreshing = false;

  const tokenStore = useTokenStore();

  const isAuthenticated = computed(() => {
    return !!tokenStore.token;
  });

  const isTokenExpired = computed((): boolean => {
    return tokenStore.expirationTime - (Date.now() + REFRESH_BUFFER_MS) <= 0;
  });

  async function updateTokenIfExpired(): Promise<boolean> {
    try {
      if (isTokenExpired.value && !isRefreshing) {
        isRefreshing = true;
        await refreshToken();
        return true;
      }
    } catch {
      console.log("не удалось обновить токен");
      return false;
    } finally {
      isRefreshing = false;
    }
    return false;
  }

  async function refreshToken(): Promise<void> {
    if (refreshTimer !== null) clearTimeout(refreshTimer);
    if (!tokenStore.refreshToken) return logout();
    try {
      const response = await fetch(`${authUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: tokenStore.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Не удалось обновить токен, статус: ${response.status}`,
        );
      }

      const data = await response.json();

      tokenStore.setTokenStore({
        token: data["access_token"],
        refreshToken: data["refresh_token"],
        expirationTime: data["expires_in"],
      });
      startRefreshToken();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      logout();
    }
  }

  function startRefreshToken(): void {
    if (refreshTimer !== null) clearTimeout(refreshTimer);
    const delay = tokenStore.expirationTime - Date.now() - REFRESH_BUFFER_MS;
    if (delay <= 0) {
      refreshToken();
    } else {
      refreshTimer = setTimeout(() => refreshToken(), delay);
    }
  }

  watchEffect(() => {
    if (isAuthenticated.value) {
      startRefreshToken();
    } else {
      if (refreshTimer !== null) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    }
  });

  function logout(): void {
    if (refreshTimer !== null) clearTimeout(refreshTimer);
    tokenStore.setTokenStore({
      token: "",
      refreshToken: "",
      expirationTime: 0,
    });
  }

  return {
    logout,
    isAuthenticated,
    refreshToken,
    updateTokenIfExpired,
  };
});
