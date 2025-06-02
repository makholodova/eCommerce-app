import type { FilterData } from "@/types/types";

export function hasActiveFilters(filters: FilterData): boolean {
  const { selectedFilters, priceMin, priceMax } = filters;

  const hasAnySelected = Object.keys(selectedFilters).some((group) =>
    Object.values(selectedFilters[group] ?? {}).includes(true),
  );

  return hasAnySelected || priceMin !== null || priceMax !== null;
}

export function convertFiltersToApiFormat(
  filters: FilterData,
): Record<string, string[] | number> {
  const filtersForApi: Record<string, string[] | number> = {};

  for (const [group, options] of Object.entries(filters.selectedFilters)) {
    const selected = Object.entries(options)
      .filter(([, isChecked]) => isChecked)
      .map(([key]) => key);

    if (selected.length > 0) {
      filtersForApi[group] = selected;
    }
  }

  if (filters.priceMin !== null) filtersForApi.priceMin = filters.priceMin;
  if (filters.priceMax !== null) filtersForApi.priceMax = filters.priceMax;

  console.log("filtersForApi ", filtersForApi);

  return filtersForApi;
}

export function getDataFiltersForApi(
  filterData: FilterData,
): Record<string, string[] | number> | null {
  return hasActiveFilters(filterData)
    ? convertFiltersToApiFormat(filterData)
    : null;
}

export const sortApiMap: Record<string, string> = {
  ascending: "price asc",
  descending: "price desc",
  alphabetically: "name.ru asc",
};
