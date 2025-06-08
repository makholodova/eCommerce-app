import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoginForm from "@/components/forms/LoginForm.vue";

describe("LoginForm.vue", () => {
  it("renders a form with email and password", () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("displays initial empty field values", () => {
    const wrapper = mount(LoginForm);
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');
    expect(emailInput.attributes("value")).toBeUndefined();
    expect(passwordInput.attributes("value")).toBeUndefined();
  });
});
