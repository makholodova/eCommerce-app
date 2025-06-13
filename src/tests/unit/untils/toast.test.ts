import { describe, it, expect, vi } from "vitest";
import { showSuccess, showError } from "@/utils/toast.ts";
import { toast } from "vue3-toastify";

vi.mock("vue3-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    POSITION: { TOP_RIGHT: "top-right" },
    THEME: { LIGHT: "light" },
    TRANSITIONS: { SLIDE: "slide" },
  },
}));

describe("toast utils", () => {
  const defaultOptions = {
    autoClose: 3000,
    position: "top-right",
    theme: "light",
    transition: "slide",
  };

  it("calls toast.success with correct message and options", () => {
    const onClose = vi.fn();
    showSuccess("Success message", onClose);

    expect(toast.success).toHaveBeenCalledWith("Success message", {
      ...defaultOptions,
      onClose,
    });
  });

  it("calls toast.error with correct message and options", () => {
    const onClose = vi.fn();
    showError("Error message", onClose);

    expect(toast.error).toHaveBeenCalledWith("Error message", {
      ...defaultOptions,
      onClose,
    });
  });
});
