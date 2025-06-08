import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "@/store/useProductFilterStore";

describe("useFilterStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("has an empty filtersMap by default", () => {
    const store = useFilterStore();
    expect(store.filtersMap).toEqual({});
  });

  it("setFilters populates and getFilters returns correct data", () => {
    const store = useFilterStore();
    const category = "electronics";
    const payload = {
      selectedFilters: { brand: { Apple: true, Samsung: false } },
      priceMin: 100,
      priceMax: 1000,
    };

    store.setFilters(category, payload);

    expect(store.filtersMap[category]).toEqual(payload);

    expect(store.getFilters(category)).toEqual(payload);
  });

  it("getFilters returns defaults for unknown category", () => {
    const store = useFilterStore();
    expect(store.getFilters("nonexistent")).toEqual({
      selectedFilters: {},
      priceMin: null,
      priceMax: null,
    });
  });

  it("resetFilters clears filters for given category", () => {
    const store = useFilterStore();
    const category = "books";

    store.setFilters(category, {
      selectedFilters: { author: { Tolkien: true } },
      priceMin: 5,
      priceMax: 50,
    });
    expect(store.filtersMap[category]).toBeDefined();

    store.resetFilters(category);
    expect(store.filtersMap[category]).toEqual({
      selectedFilters: {},
      priceMin: null,
      priceMax: null,
    });
  });
});
