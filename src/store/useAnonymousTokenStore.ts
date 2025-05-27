import { ref } from "vue";
import { defineStore } from "pinia";

export const useAnonymousTokenStore = defineStore(
  "tokenAnonymus",
  () => {
    const token = ref<string>("");
    const refreshToken = ref<string>("");
    const expirationTime = ref<number>(0);

    function setAnonymousToken(newToken: {
      token: string;
      refreshToken?: string;
      expirationTime?: number;
    }): void {
      token.value = newToken.token;
      refreshToken.value = newToken.refreshToken ?? refreshToken.value;
      if (newToken.expirationTime !== 0 && newToken.expirationTime) {
        expirationTime.value = Date.now() + newToken.expirationTime * 1000;
      } else {
        expirationTime.value = 0;
      }
    }

    return {
      token,
      refreshToken,
      expirationTime,
      setAnonymousToken,
    };
  },
  {
    persist: true,
  },
);
