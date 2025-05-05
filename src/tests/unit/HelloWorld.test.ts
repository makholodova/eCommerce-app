import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HelloWorld from "../../components/HelloWorld.vue";

describe("HelloWorld", () => {
  it("renders properly", () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: "Привет, мир!" },
    });
    expect(wrapper.text()).toContain("Привет, мир!");
  });
});
