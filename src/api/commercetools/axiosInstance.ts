import axios from "axios";
import { storeToRefs } from "pinia";
import { useTokenStore } from "@/store/useTokenStore";
import { API_BASE_URL } from "@/utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();
    const { token } = storeToRefs(tokenStore);

    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
