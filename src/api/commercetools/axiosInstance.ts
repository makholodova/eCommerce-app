import axios from "axios";
import { tokenStore } from "@/store/tokenStore";

const api = axios.create({
  baseURL: "https://api.europe-west1.gcp.commercetools.com/ecommerce-app-team",
});

api.interceptors.request.use(
  (config) => {
    const useTokenStore = tokenStore();
    const { token } = useTokenStore.getTokenStore();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
