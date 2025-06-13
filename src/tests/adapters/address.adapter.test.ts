import { describe, it, expect } from "vitest";

import type { Address } from "@commercetools/platform-sdk";
import type { UIAddress } from "@/types/types";
import type { AddressFormFields } from "@/types/interfaces";
import {
  toFormFields,
  toUIAddress,
  toUIAddressFromPlatform,
} from "@/adapters/address.adapter.ts";

describe("address.adapter", () => {
  describe("toUIAddressFromPlatform", () => {
    it("should convert platform address to UI address", () => {
      const platformAddress: Address = {
        id: "123",
        country: "DE",
        city: "Berlin",
        streetName: "Alexanderplatz",
        postalCode: "10178",
      };

      const result = toUIAddressFromPlatform(platformAddress);

      expect(result).toEqual({
        id: "123",
        country: "DE",
        city: "Berlin",
        streetName: "Alexanderplatz",
        postalCode: "10178",
      });
    });
  });

  describe("toFormFields", () => {
    it("should convert UI address to form fields", () => {
      const uiAddress: UIAddress = {
        id: "456",
        country: "US",
        city: "New York",
        streetName: "5th Avenue",
        postalCode: "10001",
      };

      const result = toFormFields(uiAddress);

      expect(result).toEqual({
        country: "US",
        city: "New York",
        streetName: "5th Avenue",
        postalCode: "10001",
      });
    });

    it("should return empty fields if address is undefined", () => {
      const result = toFormFields();

      expect(result).toEqual({
        country: "",
        city: "",
        streetName: "",
        postalCode: "",
      });
    });
  });

  describe("toUIAddress", () => {
    it("should convert form fields to UI address with given id", () => {
      const form: AddressFormFields = {
        country: "FR",
        city: "Paris",
        streetName: "Champs-Élysées",
        postalCode: "75008",
      };

      const result = toUIAddress(form, "789");

      expect(result).toEqual({
        id: "789",
        country: "FR",
        city: "Paris",
        streetName: "Champs-Élysées",
        postalCode: "75008",
      });
    });

    it("should use empty string as default id", () => {
      const form: AddressFormFields = {
        country: "IT",
        city: "Rome",
        streetName: "Via del Corso",
        postalCode: "00187",
      };

      const result = toUIAddress(form);

      expect(result).toEqual({
        id: "",
        country: "IT",
        city: "Rome",
        streetName: "Via del Corso",
        postalCode: "00187",
      });
    });
  });
});
