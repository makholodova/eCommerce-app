import type {
  ValidationRuleWithoutParams,
  ValidationRuleWithParams,
  ValidatorFn,
} from "@vuelidate/core";
import type {
  AddressFormFields,
  AuthFields,
  PersonalInfoFields,
} from "@/types/interfaces.ts";

export type AddressFormRules = {
  [K in keyof AddressFormFields]?: Record<
    string,
    ValidatorFn | ValidationRuleWithoutParams | ValidationRuleWithParams
  >;
};

export type AuthFormRules = {
  [K in keyof AuthFields]?: Record<
    string,
    ValidatorFn | ValidationRuleWithoutParams | ValidationRuleWithParams
  >;
};
export type PersonalFormRules = {
  [K in keyof PersonalInfoFields]?: Record<
    string,
    ValidatorFn | ValidationRuleWithoutParams | ValidationRuleWithParams
  >;
};
