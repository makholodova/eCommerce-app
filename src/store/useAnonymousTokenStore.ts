import { ref } from "vue";
import { defineStore } from "pinia";

export const useAnonymousTokenStore = defineStore(
  "tokenAnonymus",
  () => {
    const token = ref<string>("");
    const refreshToken = ref<string>("");
    const expirationTime = ref<number>(0);
    const anonymousId = ref<string>("");

    function reset(): void {
      token.value = "";
      refreshToken.value = "";
      expirationTime.value = 0;
      anonymousId.value = "";
    }

    function setAnonymousToken(newAnonymousToken: {
      token: string;
      refreshToken?: string;
      expirationTime?: number;
      anonymousId?: string;
    }): void {
      token.value = newAnonymousToken.token;
      refreshToken.value = newAnonymousToken.refreshToken ?? refreshToken.value;
      anonymousId.value = newAnonymousToken.anonymousId ?? "";
      if (
        newAnonymousToken.expirationTime !== 0 &&
        newAnonymousToken.expirationTime
      ) {
        expirationTime.value =
          Date.now() + newAnonymousToken.expirationTime * 1000;
      } else {
        expirationTime.value = 0;
      }
    }

    return {
      token,
      refreshToken,
      expirationTime,
      anonymousId,
      setAnonymousToken,
      reset,
    };
  },
  {
    persist: true,
  },
);
