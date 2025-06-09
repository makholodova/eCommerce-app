import type { CartPagedQueryResponse } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";

export async function getMyCart(): Promise<CartPagedQueryResponse> {
  const response = await api.get("/me/carts");
  return response.data;
}
