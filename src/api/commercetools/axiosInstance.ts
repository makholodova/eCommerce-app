import axios from "axios";
import { storeToRefs } from "pinia";
import { useTokenStore } from "@/store/useTokenStore";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import { API_BASE_URL } from "@/utils/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { loginAnonymous } from "./loginAnonymous";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const tokenStore = useTokenStore();
const anonymousStore = useAnonymousTokenStore();
const { token: userToken } = storeToRefs(tokenStore);
const { token: anonymousToken } = storeToRefs(anonymousStore);
const authStore = useAuthStore();

api.interceptors.request.use(
  (config) => {
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (userToken.value) {
        try {
          await authStore.refreshToken();
          originalRequest.headers["Authorization"] =
            `Bearer ${tokenStore.token}`;
          return axios(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      if (anonymousToken.value) {
        try {
          await loginAnonymous();
          originalRequest.headers["Authorization"] =
            `Bearer ${anonymousStore.token}`;
          return axios(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
