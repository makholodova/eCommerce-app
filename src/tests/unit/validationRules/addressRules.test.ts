import { describe, it, expect } from "vitest";
import { addressRules } from "@/utils/validation";

describe("addressRules.streetName", () => {
  const { required } = addressRules.streetName;
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("accepts a non-empty street", () => {
    expect(required.$validator("Ленина", null, null)).toBe(true);
  });
});

describe("addressRules.city", () => {
  const { required, onlyLetters } = addressRules.city;
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects city with numbers", () => {
    expect(onlyLetters.$validator("Москва1", null, null)).toBe(false);
  });

  it("accepts city with letters and hyphen", () => {
    expect(onlyLetters.$validator("Нижний-Новгород", null, null)).toBe(true);
  });
});

describe("addressRules.country", () => {
  const { required, allowed } = addressRules.country;
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects invalid country", () => {
    expect(allowed.$validator("US", null, null)).toBe(false);
  });

  it("accepts valid country", () => {
    expect(allowed.$validator("RU", null, null)).toBe(true);
  });
});

describe("addressRules.postalCode", () => {
  const { required, hasDigit } = addressRules.postalCode;
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects 5 digit index", () => {
    expect(hasDigit.$validator("12345", null, null)).toBe(false);
  });

  it("rejects index with letters", () => {
    expect(hasDigit.$validator("12AB34", null, null)).toBe(false);
  });

  it("accepts a 6-digit index", () => {
    expect(hasDigit.$validator("123456", null, null)).toBe(true);
  });
});
