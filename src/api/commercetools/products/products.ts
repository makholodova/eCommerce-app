import api from "@/api/commercetools/axiosInstance";
import type { ProductProjectionPagedSearchResponse } from "@commercetools/platform-sdk";
import { MIN_PPRICE, MAX_PPRICE } from "@/utils/constants";

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

export function buildFilterQuery(
  categoryId: string,
  filters: Record<string, string[] | number> = {},
): string[] {
  const filterQuery: string[] = [`categories.id:"${categoryId}"`];

  for (const [key, values] of Object.entries(filters)) {
    if (Array.isArray(values)) {
      const joinedValues = values.map((v) => `"${v}"`).join(",");
      filterQuery.push(`variants.attributes.${key}.key:${joinedValues}`);
    }
  }

  const min =
    typeof filters.priceMin === "number" ? filters.priceMin : MIN_PPRICE;
  const max =
    typeof filters.priceMax === "number" ? filters.priceMax : MAX_PPRICE;

  filterQuery.push(`variants.price.centAmount:range(${min} to ${max})`);

  return filterQuery;
}

export async function searchProductsInCategory(
  categoryId: string,
  query: string,
  filters: Record<string, string[] | number> = {},
): Promise<ProductProjectionPagedSearchResponse> {
  const trimmedQuery = query.trim();
  const fuzzyLevel =
    trimmedQuery.length <= 2 ? 0 : trimmedQuery.length === 3 ? 1 : 2;

  const filterQuery = buildFilterQuery(categoryId, filters);

  console.log("filterQuery search ", filterQuery);

  const response = await api.get("/product-projections/search", {
    params: {
      "filter.query": filterQuery,
      "text.ru": `*${trimmedQuery}*`,
      fuzzy: true,
      fuzzyLevel,
    },
  });
  console.log("Ответ с товарами фильтр+поиск: ", response.data);
  return response.data;
}

export async function getFilteredProducts(
  categoryId: string,
  filters: Record<string, string[] | number>,
): Promise<ProductProjectionPagedSearchResponse> {
  const filterQuery = buildFilterQuery(categoryId, filters);

  console.log("filterQuery ", filterQuery);

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
