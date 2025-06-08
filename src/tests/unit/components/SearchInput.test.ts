import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import type { ComponentPublicInstance } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import SearchInput from "@/components/ui/SearchInput.vue";

describe("SearchInput.vue", () => {
  const factory = (modelValue: string): VueWrapper<ComponentPublicInstance> =>
    mount(SearchInput, {
      props: {
        modelValue,
        "onUpdate:modelValue": () => {},
      },
    });

  it("renders input and button, handles search logic", async () => {
    const wrapper = factory("");

    const input = wrapper.find("input.input-search");
    const button = wrapper.find("button.button-search");
    expect(input.exists()).toBe(true);
    expect(button.exists()).toBe(true);

    expect(wrapper.find(".search").classes()).toContain("search--disabled");

    await wrapper.setProps({ modelValue: "hello" });

    expect(wrapper.find(".search").classes()).not.toContain("search--disabled");

    await button.trigger("click");
    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")![0]).toEqual(["hello"]);

    await wrapper.setProps({ modelValue: "query" });

    await input.trigger("keydown.enter");
    expect(wrapper.emitted("search")![1]).toEqual(["query"]);
  });
});
