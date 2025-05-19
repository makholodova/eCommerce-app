import { describe, it, expect } from "vitest";
import { authRules } from "@/utils/validation";

const { required, email } = authRules.email;

describe("authRules", () => {
  it("rejects empty string", () => {
    expect(required.$validator(" ", null, null)).toBe(false);
  });

  it("rejects email without @", () => {
    expect(email.$validator("userexample.com", null, null)).toBe(false);
  });

  it("rejects email without domain name", () => {
    expect(email.$validator("user@", null, null)).toBe(false);
  });

  it("rejects email with spaces at the beginning and end", () => {
    expect(email.$validator("  user@example.com  ", null, null)).toBe(false);
  });

  it("accepts correct email", () => {
    expect(email.$validator("user@example.com", null, null)).toBe(true);
  });
});
