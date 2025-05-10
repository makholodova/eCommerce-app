<script lang="ts" setup>
import { computed, defineProps } from "vue";
import {
  useVuelidate,
  type ValidationRuleWithoutParams,
  type ValidationRuleWithParams,
  type ValidatorFn,
} from "@vuelidate/core";

const props = defineProps<{
  id: string;
  label: string;
  type: string;
  vuelidateRules?: Record<
    string,
    ValidationRuleWithoutParams | ValidationRuleWithParams | ValidatorFn
  >;
  placeholder?: string;
  showError?: boolean;
}>();

const inputValue = defineModel<string>({ required: true });

const rules = computed(() => {
  const rules = props.vuelidateRules ?? {};
  return {
    inputValue: rules,
  };
});

const v$ = useVuelidate(
  rules,
  { inputValue },
  { $lazy: true, $autoDirty: true },
);

const errorMessage = computed(() => {
  const errors = v$.value.inputValue.$errors;
  return errors.length ? errors[0].$message : "";
});
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <input
      :id
      v-model="inputValue"
      :class="[
        'base-input',
        {
          invalid: v$.inputValue.$error,
          valid: inputValue && !v$.inputValue.$error,
        },
      ]"
      :placeholder
      :type
      :value="inputValue"
    />
    <span
      v-if="showError"
      :class="{ visible: v$.inputValue.$error }"
      class="error-text"
      >{{ errorMessage }}</span
    >
  </label>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-input {
  border: 1px solid var(--grey-not-active);
  border-radius: 8px;
  padding: 11px 8px 11px 16px;

  font-size: 1rem;
  font-weight: 400;
  color: var(--grey-not-active);

  outline: none;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.base-input:not(:placeholder-shown):not(.error):not(:focus) {
  font-size: 1rem;
  color: var(--black);
}

.base-input.valid {
  background-image: url("@/assets/icons/icon_valid.svg");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px 20px;
}

.base-input.invalid {
  border-color: var(--red);
  color: var(--red);
}

.base-input:focus:not(.error) {
  border: 1px solid var(--black);
  color: var(--black);
}

.error-text {
  color: var(--red);
  font-size: 0.7rem;
  min-height: 1rem;
}

.error-text {
  transition: opacity 0.2s ease;
  opacity: 0;
}

.error-text.visible {
  opacity: 1;
}
</style>
