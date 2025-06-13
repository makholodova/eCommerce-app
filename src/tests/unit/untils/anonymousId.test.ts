import { describe, it, expect, vi } from "vitest";
import { getAnonymousId } from "@/utils/anonymousId.ts";

describe("getAnonymousId", () => {
  it("should return a random UUID string", () => {
    const mockUUID = "123e4567-e89b-12d3-a456-426614174000";
    vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

    const result = getAnonymousId();

    expect(result).toBe(mockUUID);
    expect(crypto.randomUUID).toHaveBeenCalled();
  });
});
