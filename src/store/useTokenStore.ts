import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useTokenStore = defineStore("token", () => {
  const token = ref<string>("");
  const refreshToken = ref<string>("");
  const expirationTime = ref<number>(0);

  const isAuthorized = computed(() => {
    return !!token.value;
  });

  function setTokenStore(newToken: {
    token: string;
    refreshToken?: string;
    expirationTime?: number;
  }): void {
    token.value = newToken.token;
    refreshToken.value = newToken.refreshToken ?? "";
    expirationTime.value = newToken.expirationTime ?? 0;
  }

  function logout(): void {
    localStorage.removeItem("user");
    token.value = "";
    refreshToken.value = "";
    expirationTime.value = 0;
  }

  return {
    token,
    refreshToken,
    expirationTime,
    setTokenStore,
    logout,
    isAuthorized,
  };
});
