import { defineStore } from "pinia";
import { ref } from "vue";
import type { FilterMap } from "@/types/types";

export const useFilterStore = defineStore(
  "filters",
  () => {
    const filtersMap = ref<FilterMap>({});

    function setFilters(
      category: string,
      filters: {
        selectedFilters: Record<string, Record<string, boolean>>;
        priceMin: number | null;
        priceMax: number | null;
      },
    ): void {
      filtersMap.value[category] = {
        selectedFilters: filters.selectedFilters,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
      };
    }

    function getFilters(category: string): {
      selectedFilters: Record<string, Record<string, boolean>>;
      priceMin: number | null;
      priceMax: number | null;
    } {
      return (
        filtersMap.value[category] ?? {
          selectedFilters: {},
          priceMin: null,
          priceMax: null,
        }
      );
    }

    function resetFilters(category: string): void {
      filtersMap.value[category] = {
        selectedFilters: {},
        priceMin: null,
        priceMax: null,
      };
    }

    return {
      filtersMap,
      setFilters,
      getFilters,
      resetFilters,
    };
  },
  {
    persist: true,
  },
);
