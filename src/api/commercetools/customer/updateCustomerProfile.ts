import api from "@/api/commercetools/axiosInstance.ts";
import type {
  Customer,
  CustomerUpdateAction,
} from "@commercetools/platform-sdk";

export async function updateCustomerProfile(
  version: number,
  actions: CustomerUpdateAction[],
): Promise<Customer> {
  const response = await api.post(`/me`, {
    version,
    actions,
  });
  return response.data;
}
