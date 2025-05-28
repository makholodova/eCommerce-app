import type { Address } from "@commercetools/platform-sdk";
import type { UIAddress } from "@/types/types.ts";
import type { AddressFormFields } from "@/types/interfaces.ts";

export function toUIAddressFromPlatform(address: Address): UIAddress {
  return {
    id: address.id!,
    country: address.country,
    city: address.city,
    streetName: address.streetName,
    postalCode: address.postalCode,
  };
}

export function toFormFields(address?: UIAddress): AddressFormFields {
  return {
    country: address?.country ?? "",
    city: address?.city ?? "",
    streetName: address?.streetName ?? "",
    postalCode: address?.postalCode ?? "",
  };
}

export function toUIAddress(
  form: AddressFormFields,
  id: string = "",
): UIAddress {
  return {
    id,
    ...form,
  };
}
