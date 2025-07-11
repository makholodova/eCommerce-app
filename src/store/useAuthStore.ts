import { computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { useTokenStore } from "./useTokenStore";
import { useAnonymousTokenStore } from "./useAnonymousTokenStore";
import { getAnonymousId } from "@/utils/anonymousId";
import { useCartStore } from "./useCartStore";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
const projectKey = import.meta.env.VITE_PROJECT_KEY;
const scopesAnonymous = import.meta.env.VITE_SCOPES_ANONYMOUS.split(" ");

export const useAuthStore = defineStore("auth", () => {
  const anonymousStore = useAnonymousTokenStore();
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  const REFRESH_BUFFER_MS = 1000 * 60 * 5;
  let isRefreshing = false;

  const tokenStore = useTokenStore();
  const cartStore = useCartStore();

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
      return false;
    } finally {
      isRefreshing = false;
    }
    return false;
  }

  async function refreshAnonymusToken(): Promise<void> {
    const anonymous_id = anonymousStore.anonymousId || getAnonymousId();
    const response = await fetch(
      `${authUrl}/oauth/${projectKey}/anonymous/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: scopesAnonymous.join(" "),
        }),
      },
    );
    if (!response.ok)
      throw new Error("Не удалось получить токен анонимного пользователя");
    const tokenData = await response.json();
    anonymousStore.setAnonymousToken({
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expirationTime: tokenData.expires_in,
      anonymousId: anonymous_id,
    });
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
      logout();
      throw error instanceof Error ? error : new Error("Unknown error");
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
    tokenStore.reset();
    cartStore.cleanCart();
  }

  return {
    logout,
    isAuthenticated,
    refreshToken,
    updateTokenIfExpired,
    refreshAnonymusToken,
  };
});
