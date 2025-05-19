import { ref } from "vue";
import { defineStore } from "pinia";

export const useTokenStore = defineStore("token", () => {
  const token = ref<string>("");
  const refreshToken = ref<string>("");
  const expirationTime = ref<number>(0);
  const isAuthenticated = ref<boolean>(false);

  function checkIfUserIsAuthorized(): void {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        isAuthenticated.value = false;
      } else {
        const user = JSON.parse(data);
        isAuthenticated.value = user.isAuthenticated ?? false;
      }
    } catch {
      isAuthenticated.value = false;
    }
  }

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
    isAuthenticated.value = false;
  }

  return {
    token,
    refreshToken,
    expirationTime,
    setTokenStore,
    logout,
    isAuthenticated,
    checkIfUserIsAuthorized,
  };
});
