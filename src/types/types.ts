import type {
  ValidationRuleWithoutParams,
  ValidationRuleWithParams,
  ValidatorFn,
} from "@vuelidate/core";

export type FormRules<T> = {
  [K in keyof T]?: Record<
    string,
    ValidatorFn | ValidationRuleWithoutParams | ValidationRuleWithParams
  >;
};

export type UIAddress = {
  id: string;
  country: string;
  city?: string;
  streetName?: string;
  postalCode?: string;
};

export type FilterData = {
  selectedFilters: Record<string, Record<string, boolean>>;
  priceMin: number | null;
  priceMax: number | null;
};

export type FilterMap = {
  [categoryKey: string]: FilterData;
};

export type FilterOption = {
  key: string;
  name: string;
};

export type ProductFilterMap = Record<
  string,
  {
    title: string;
    options: FilterOption[];
  }
>;
