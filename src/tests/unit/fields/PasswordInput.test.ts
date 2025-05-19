import { describe, it, expect } from "vitest";
import { authRules } from "@/utils/validation";

const {
  required,
  minLength,
  hasUppercase,
  hasLowercase,
  hasDigit,
  hasSpecialChar,
  noWhitespace,
} = authRules.password;

describe("authRules.password", () => {
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects password less than 8 characters", () => {
    expect(minLength.$validator("Qq1!a", null, null)).toBe(false);
  });

  it("rejects password without capital letters", () => {
    expect(hasUppercase.$validator("password1!", null, null)).toBe(false);
  });

  it("rejects password without lowercase letters", () => {
    expect(hasLowercase.$validator("PASSWORD1!", null, null)).toBe(false);
  });

  it("rejects password without numbers", () => {
    expect(hasDigit.$validator("Password!", null, null)).toBe(false);
  });

  it("rejects password without special characters", () => {
    expect(hasSpecialChar.$validator("Password1", null, null)).toBe(false);
  });

  it("rejects password with spaces", () => {
    expect(noWhitespace.$validator("Password 1!", null, null)).toBe(false);
  });

  it("accepts the correct password", () => {
    const validPassword = "Qwerty1!";
    expect(required.$validator(validPassword, null, null)).toBe(true);
    expect(minLength.$validator(validPassword, null, null)).toBe(true);
    expect(hasUppercase.$validator(validPassword, null, null)).toBe(true);
    expect(hasLowercase.$validator(validPassword, null, null)).toBe(true);
    expect(hasDigit.$validator(validPassword, null, null)).toBe(true);
    expect(hasSpecialChar.$validator(validPassword, null, null)).toBe(true);
    expect(noWhitespace.$validator(validPassword, null, null)).toBe(true);
  });
});
