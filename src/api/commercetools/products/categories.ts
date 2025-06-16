import api from "@/api/commercetools/axiosInstance";
import type { Category } from "@commercetools/platform-sdk";

export async function getCategoryByKey(categoryKey: string): Promise<Category> {
  const response = await api.get(`categories/key=${categoryKey}`);
  return response.data;
}
