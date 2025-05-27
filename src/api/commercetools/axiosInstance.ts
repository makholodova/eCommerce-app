import axios from "axios";
import { storeToRefs } from "pinia";
import { useTokenStore } from "@/store/useTokenStore";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import { API_BASE_URL } from "@/utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();
    const anonymousStore = useAnonymousTokenStore();

    const { token: userToken } = storeToRefs(tokenStore);
    const { token: anonymousToken } = storeToRefs(anonymousStore);

    const activeToken = userToken.value || anonymousToken.value;

    if (activeToken) {
      config.headers.Authorization = `Bearer ${activeToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
