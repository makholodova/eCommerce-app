import type { Cart } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";

export async function getMyCart(): Promise<Cart | null> {
  const response = await api.get("/me/carts");
  const carts = response.data.results;
  return carts.length > 0 ? carts[0] : null;
}
