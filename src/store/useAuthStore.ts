import { computed } from "vue";
import { defineStore } from "pinia";
import { useTokenStore } from "./useTokenStore";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const authUrl = import.meta.env.VITE_AUTH_URL;
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

export const useAuthStore = defineStore("auth", () => {
  const tokenStore = useTokenStore();

  const isAuthenticated = computed(() => {
    return !!tokenStore.token;
  });

  async function refreshToken(): Promise<void> {
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      logout();
    }
  }

  function logout(): void {
    tokenStore.setTokenStore({
      token: null,
      refreshToken: null,
      expirationTime: null,
    });
  }

  return {
    logout,
    isAuthenticated,
    refreshToken,
  };
});
