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

export async function getFilteredProducts(
  categoryId: string,
  filters: Record<string, string[]>,
): Promise<ProductProjectionPagedSearchResponse> {
  const filterQuery: string[] = [`categories.id:"${categoryId}"`];

  for (const [key, values] of Object.entries(filters)) {
    if (values.length === 0) continue;

    /*const attributeFilters = values.map(
      (value) => `variants.attributes.${key}.key:"${value}"`,
    );

    filterQuery.push(...attributeFilters);*/

    const joinedValues = values.map((v) => `"${v}"`).join(",");
    filterQuery.push(`variants.attributes.${key}.key:${joinedValues}`);
  }

  const response = await api.get("/product-projections/search", {
    params: {
      "filter.query": filterQuery,
    },
    paramsSerializer: {
      indexes: false,
    },
  });
  console.log("Ответ с товарами: ", response.data);
  return response.data;
}
