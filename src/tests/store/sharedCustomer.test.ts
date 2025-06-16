import { describe, it, expect } from "vitest";
import { sharedCustomer } from "@/store/sharedCustomer.ts";
import type { Customer } from "@commercetools/platform-sdk";

describe("sharedCustomer", () => {
  it("is null by default", () => {
    expect(sharedCustomer.value).toBeNull();
  });

  it("can be set", () => {
    const mockCustomer: Customer = {
      id: "123",
      version: 1,
      email: "test@test.com",
      addresses: [],
      isEmailVerified: false,
      createdAt: "",
      lastModifiedAt: "",
      authenticationMode: "Password",
      stores: [],
    };

    sharedCustomer.value = mockCustomer;

    expect(sharedCustomer.value?.id).toBe("123");
    expect(sharedCustomer.value?.email).toBe("test@test.com");
  });

  it("can be reset", () => {
    sharedCustomer.value = null;
    expect(sharedCustomer.value).toBeNull();
  });
});
