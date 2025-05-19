import { describe, it, expect } from "vitest";
import { personalInfoRules } from "@/utils/validation";

describe("personalInfoRules.firstName", () => {
  const { required, onlyLetters } = personalInfoRules.firstName;
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects name with numbers", () => {
    expect(onlyLetters.$validator("Иван123", null, null)).toBe(false);
  });

  it("accepts the correct name", () => {
    expect(onlyLetters.$validator("Анна-Мария", null, null)).toBe(true);
  });
});

describe("personalInfoRules.lastName", () => {
  const { required, onlyLetters } = personalInfoRules.lastName;
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects last name with numbers", () => {
    expect(onlyLetters.$validator("Иванов123", null, null)).toBe(false);
  });

  it("accepts the correct last name", () => {
    expect(onlyLetters.$validator("Иванов-Сидоров", null, null)).toBe(true);
  });
});

describe("personalInfoRules.dateOfBirth", () => {
  const { required, noWhitespace, isAtLeast14 } = personalInfoRules.dateOfBirth;
  it("rejects empty date", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects date with spaces", () => {
    expect(noWhitespace.$validator("10 -10-2010", null, null)).toBe(false);
  });

  it("rejects date under 14", () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    const dateStr = date.toISOString().split("T")[0];
    expect(isAtLeast14.$validator(dateStr, null, null)).toBe(false);
  });

  it("accepts users over 14 years old", () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    const dateStr = date.toISOString().split("T")[0];
    expect(isAtLeast14.$validator(dateStr, null, null)).toBe(true);
  });
});
