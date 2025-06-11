import { apiRoot } from "@/api/commercetools/buildClient";
import type { AttributeDefinition } from "@commercetools/platform-sdk";

export async function getAttributes(): Promise<AttributeDefinition[]> {
  const response = await apiRoot.productTypes().get().execute();
  const productTypes = response.body.results;
  return productTypes?.[0]?.attributes ?? [];
}
