import type { ProductProjection } from "@commercetools/platform-sdk";
import type { ProductAdapter, ProductAttribute } from "@/types/interfaces";

export function productAdapter(product: ProductProjection): ProductAdapter {
  const rawAttributes = product.masterVariant.attributes ?? [];

  const attributes: ProductAttribute = {
    brand: "",
    model: "",
    color: "",
    screen: "",
    ram: "",
    rom: "",
    cores: 0,
    wattage: "",
    weight: "",
  };

  for (const attr of rawAttributes) {
    const value =
      typeof attr.value === "object" && "label" in attr.value
        ? attr.value.label
        : attr.value;

    switch (attr.name) {
      case "brand":
        attributes.brand = value;
        break;
      case "model":
        attributes.model = value;
        break;
      case "color":
        attributes.color = value;
        break;
      case "screen":
        attributes.screen = value;
        break;
      case "ram":
        attributes.ram = value;
        break;
      case "rom":
        attributes.rom = value;
        break;
      case "cores":
        attributes.cores = value;
        break;
      case "wattage":
        attributes.wattage = value;
        break;
      case "weight":
        attributes.weight = value;
        break;
    }
  }
  const priceObj = product.masterVariant.prices?.[0];
  const price = priceObj?.value?.centAmount ?? null;
  const discountedPrice = priceObj?.discounted?.value?.centAmount ?? null;
  const discountedPercentage =
    price && discountedPrice
      ? Math.round(((price - discountedPrice) / price) * 100)
      : null;

  return {
    id: product.id,
    title: product.name?.ru ?? "",
    description: product.description?.ru ?? "",
    images: product.masterVariant.images?.map((img) => img.url) ?? [],
    price,
    discountedPrice,
    discountedPercentage,
    attributes,
  };
}
