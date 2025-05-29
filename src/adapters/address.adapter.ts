import type { Address } from "@commercetools/platform-sdk";
import type { UIAddress } from "@/types/types.ts";

export function toUIAddress(address: Address): UIAddress {
  return {
    id: address.id!,
    country: address.country,
    city: address.city,
    streetName: address.streetName,
    postalCode: address.postalCode,
  };
}
