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

export async function searchProductsInCategory(
  categoryId: string,
  query: string,
): Promise<ProductProjectionPagedSearchResponse> {
  const trimmedQuery = query.trim();
  const fuzzyLevel =
    trimmedQuery.length <= 2 ? 0 : trimmedQuery.length === 3 ? 1 : 2;

  const response = await api.get("/product-projections/search", {
    params: {
      "filter.query": `categories.id:"${categoryId}"`,
      "text.ru": `*${trimmedQuery}*`,
      fuzzy: true,
      fuzzyLevel,
    },
  });

  return response.data;
}
