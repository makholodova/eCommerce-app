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

export type FilterType = {
  [categoryKey: string]: {
    selectedFilters: Record<string, Record<string, boolean>>;
    priceMin: number | null;
    priceMax: number | null;
  };
};
