import { flushPromises, mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import ProductFilter from "@/components/ui/ProductFilter.vue";
import BaseCheckbox from "@/components/ui/BaseCheckbox.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import type { Mock } from "vitest";

type MockFilterStore = {
  getFilters: () => {
    selectedFilters: { brand: { apple: boolean } };
    priceMin: number;
    priceMax: number;
  };
  setFilters: Mock;
  resetFilters: Mock;
};

vi.mock("@/store/useProductFilterStore", () => {
  const store: MockFilterStore = {
    getFilters: () => ({
      selectedFilters: {
        brand: { apple: true },
      },
      priceMin: 5000,
      priceMax: 30000,
    }),
    setFilters: vi.fn(),
    resetFilters: vi.fn(),
  };

  return {
    useFilterStore: (): MockFilterStore => store,
  };
});

vi.mock("@/utils/filters/dataProductFilters", () => ({
  productFilters: {
    brand: [
      { key: "apple", name: "Apple" },
      { key: "samsung", name: "Samsung" },
    ],
  },
  filterLabels: {
    brand: "Бренд",
  },
}));

vi.mock("@/utils/filters/filters", () => ({
  convertFiltersToApiFormat: vi.fn(() => ({
    brand: ["apple"],
    priceMin: 5000,
    priceMax: 30000,
  })),
}));

vi.mock("@/api/commercetools/products/attributes", () => ({
  getAttributes: vi.fn(() =>
    Promise.resolve([
      {
        name: { en: "Brand" },
        type: { name: "lenum" },
        attributeConstraint: "None",
        isRequired: false,
        isSearchable: true,
        inputHint: "SingleLine",
        displayGroup: "Other",
        label: { en: "Brand" },
      },
    ]),
  ),
}));

vi.mock("@/adapters/type.adapter", () => ({
  adaptAttributes: vi.fn(() => ({
    brand: {
      title: "Бренд",
      options: [
        { key: "apple", name: "Apple" },
        { key: "samsung", name: "Samsung" },
      ],
    },
  })),
}));

describe("ProductFilter.vue", () => {
  it("displays filters and emits when applied", async () => {
    const wrapper = mount(ProductFilter, {
      props: {
        category: "smartphones",
        isMobile: false,
      },
      global: {
        stubs: { BaseCheckbox, BaseButton },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain("Бренд");
    expect(wrapper.findComponent(BaseCheckbox).exists()).toBe(true);

    const applyBtn = wrapper
      .findAllComponents(BaseButton)
      .find((btn) => btn.text().includes("Применить"));

    expect(applyBtn).toBeDefined();
    await applyBtn!.trigger("click");

    expect(wrapper.emitted("update:filters")).toBeTruthy();
    expect(wrapper.emitted("update:filters")![0]).toEqual([
      { brand: ["apple"], priceMin: 5000, priceMax: 30000 },
    ]);
  });
});
