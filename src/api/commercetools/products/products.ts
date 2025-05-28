import api from "@/api/commercetools/axiosInstance";
import type { ProductProjectionPagedSearchResponse } from "@commercetools/platform-sdk";

export async function getProductsCategory(
  categoryId: string,
): Promise<ProductProjectionPagedSearchResponse> {
  const response = await api.get("/product-projections/search", {
    params: {
      "filter.query": `categories.id:"${categoryId}"`,
    },
  });
  return response.data;
}
