import { mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ProductSort from "@/components/ui/ProductSort.vue";
import BaseRadio from "@/components/ui/BaseRadio.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

describe("ProductSort.vue", () => {
  const factory = (props = { sortType: "" }): VueWrapper =>
    mount(ProductSort, {
      props,
      global: {
        stubs: { BaseRadio, BaseButton },
      },
    });

  it("displays the sort title", () => {
    const wrapper = factory();
    expect(wrapper.text()).toContain("Сортировка");
  });

  it("emits selected sort type on apply", async () => {
    const wrapper = factory();
    await wrapper.find(".sort-header").trigger("click");

    await wrapper.find('input[id="descending"]').setValue();

    await wrapper.findAllComponents(BaseButton)[1].trigger("click");

    expect(wrapper.emitted("update:sortType")).toBeTruthy();
    expect(wrapper.emitted("update:sortType")![0]).toEqual(["descending"]);
  });

  it("resets sort type on cancel", async () => {
    const wrapper = factory({ sortType: "ascending" });

    await wrapper.find(".sort-header").trigger("click");
    await wrapper.findAllComponents(BaseButton)[0].trigger("click");

    expect(wrapper.emitted("update:sortType")![0]).toEqual([""]);
  });
});
