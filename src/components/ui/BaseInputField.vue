<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  useVuelidate,
  type ValidationRuleWithoutParams,
  type ValidationRuleWithParams,
  type ValidatorFn,
} from "@vuelidate/core";
import TogglePassword from "@/components/ui/TogglePassword.vue";

const props = defineProps<{
  id: string;
  name: string;
  label: string;
  type: string;
  vuelidateRules?: Record<
    string,
    ValidationRuleWithoutParams | ValidationRuleWithParams | ValidatorFn
  >;
  placeholder?: string;
  showError?: boolean;
  autocomplete?: string;
}>();

const isPasswordVisible = ref(false);

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
    <span class="input-wrapper">
      <input
        :id
        v-model="inputValue"
        :name="name"
        :class="[
          'base-input',
          {
            invalid: v$.inputValue.$error,
            valid: inputValue && !v$.inputValue.$error,
          },
        ]"
        :placeholder
        :type="isPasswordVisible && type === 'password' ? 'text' : type"
        :autocomplete="autocomplete"
      />
      <TogglePassword
        v-if="type === 'password'"
        v-model:password-visible="isPasswordVisible"
      />
    </span>
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

.input-wrapper {
  position: relative;
}

.base-input {
  border: 1px solid var(--grey-not-active);
  border-radius: 8px;
  padding: 11px 35px 11px 16px;
  width: 100%;

  font-size: 1rem;
  font-weight: 400;
  color: var(--grey-not-active);

  outline: none;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
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

.base-input:not(:placeholder-shown):not(.error):not(:focus):not([type="date"]) {
  font-size: 1rem;
  color: var(--black);
}

input[type="date"].base-input {
  padding-right: 34px;
}

.error-text {
  color: var(--red);
  font-size: 0.7rem;
  min-height: 1rem;
  transition: opacity 0.2s ease;
  opacity: 0;
}

.error-text.visible {
  opacity: 1;
}
</style>
