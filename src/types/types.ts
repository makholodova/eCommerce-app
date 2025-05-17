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
