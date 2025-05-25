import { ref } from "vue";
import { defineStore } from "pinia";

export const useTokenStore = defineStore(
  "token",
  () => {
    const token = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const expirationTime = ref<number>(0);

    function setTokenStore(newToken: {
      token: string | null;
      refreshToken?: string | null;
      expirationTime?: number | null;
    }): void {
      token.value = newToken.token;
      refreshToken.value = newToken.refreshToken ?? null;
      expirationTime.value = newToken.expirationTime ?? 0;
    }

    return {
      token,
      refreshToken,
      expirationTime,
      setTokenStore,
    };
  },
  {
    persist: true,
  },
);
