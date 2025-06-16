import api from "@/api/commercetools/axiosInstance";
import type { Customer } from "@commercetools/platform-sdk";

export async function getUserProfile(): Promise<Customer> {
  const response = await api.get("/me");
  return response.data;
}
