import type { AttributeDefinition } from "@commercetools/platform-sdk";
import type { ProductFilterMap } from "@/types/types";

export function adaptAttributes(
  attributes: AttributeDefinition[],
  needed: string[] = ["brand", "color", "rom", "ram"],
): ProductFilterMap {
  const result: ProductFilterMap = {};

  for (const attr of attributes) {
    if (
      needed.includes(attr.name) &&
      attr.type.name === "enum" &&
      Array.isArray(attr.type.values)
    ) {
      result[attr.name] = {
        title: attr.label?.ru ?? attr.name,
        options: attr.type.values.map((val) => ({
          key: val.key,
          name: val.label,
        })),
      };
    }
  }

  return result;
}
