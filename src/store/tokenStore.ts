import { defineStore } from "pinia";

export const tokenStore = defineStore("token", {
  state: () => ({
    token: "",
    refreshToken: "",
    expirationTime: 0,
  }),
  actions: {
    setToken(newToken: {
      token: string;
      refreshToken?: string;
      expirationTime?: number;
    }) {
      this.token = newToken.token;
      this.refreshToken = newToken.refreshToken ?? "";
      this.expirationTime = newToken.expirationTime ?? 0;
    },
    getTokenStore() {
      return {
        token: this.token,
        refreshToken: this.refreshToken,
        expirationTime: this.expirationTime,
      };
    },
  },
});
