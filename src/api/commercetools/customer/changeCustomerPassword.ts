import api from "@/api/commercetools/axiosInstance.ts";
import type {
  Customer,
  MyCustomerChangePassword,
} from "@commercetools/platform-sdk";

export async function changeCustomerPassword(
  data: MyCustomerChangePassword,
): Promise<Customer> {
  const response = await api.post(`/me/password`, data);
  return response.data;
}
