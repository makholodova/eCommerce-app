import { describe, it, expect } from "vitest";
import { authRules } from "@/utils/validation";

const emailRules = authRules.email;
const passwordRules = authRules.password;

describe("authRules.email", () => {
  it("rejects empty string", () => {
    expect(emailRules.required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects email without @", () => {
    expect(emailRules.email.$validator("userexample.com", null, null)).toBe(
      false,
    );
  });

  it("rejects email without domain name", () => {
    expect(emailRules.email.$validator("user@", null, null)).toBe(false);
  });

  it("rejects email with spaces at the beginning and end", () => {
    expect(
      emailRules.email.$validator("  user@example.com  ", null, null),
    ).toBe(false);
  });

  it("accepts correct email", () => {
    expect(emailRules.email.$validator("user@example.com", null, null)).toBe(
      true,
    );
  });
});

describe("authRules.password", () => {
  it("rejects empty string", () => {
    expect(passwordRules.required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects password less than 8 characters", () => {
    expect(passwordRules.minLength.$validator("Qq1!a", null, null)).toBe(false);
  });

  it("rejects password without capital letters", () => {
    expect(
      passwordRules.hasUppercase.$validator("password1!", null, null),
    ).toBe(false);
  });

  it("rejects password without lowercase letters", () => {
    expect(
      passwordRules.hasLowercase.$validator("PASSWORD1!", null, null),
    ).toBe(false);
  });

  it("rejects password without numbers", () => {
    expect(passwordRules.hasDigit.$validator("Password!", null, null)).toBe(
      false,
    );
  });

  it("rejects password without special characters", () => {
    expect(
      passwordRules.hasSpecialChar.$validator("Password1", null, null),
    ).toBe(false);
  });

  it("rejects password with spaces", () => {
    expect(
      passwordRules.noWhitespace.$validator("Password 1!", null, null),
    ).toBe(false);
  });

  it("accepts the correct password", () => {
    const validPassword = "Qwerty1!";
    expect(passwordRules.required.$validator(validPassword, null, null)).toBe(
      true,
    );
    expect(passwordRules.minLength.$validator(validPassword, null, null)).toBe(
      true,
    );
    expect(
      passwordRules.hasUppercase.$validator(validPassword, null, null),
    ).toBe(true);
    expect(
      passwordRules.hasLowercase.$validator(validPassword, null, null),
    ).toBe(true);
    expect(passwordRules.hasDigit.$validator(validPassword, null, null)).toBe(
      true,
    );
    expect(
      passwordRules.hasSpecialChar.$validator(validPassword, null, null),
    ).toBe(true);
    expect(
      passwordRules.noWhitespace.$validator(validPassword, null, null),
    ).toBe(true);
  });
});
