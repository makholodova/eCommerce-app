import type {
  ValidationRuleWithoutParams,
  ValidationRuleWithParams,
  ValidatorFn,
} from "@vuelidate/core";
import type { AddressFormFields } from "@/types/interfaces.ts";

export type AddressFormRules = {
  [K in keyof AddressFormFields]?: Record<
    string,
    ValidatorFn | ValidationRuleWithoutParams | ValidationRuleWithParams
  >;
};
