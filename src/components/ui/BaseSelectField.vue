<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  useVuelidate,
  type ValidatorFn,
  type ValidationRuleWithoutParams,
  type ValidationRuleWithParams,
} from "@vuelidate/core";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  id: string;
  label: string;
  options: { title: string; value: string }[];
  placeholder?: string;
  vuelidateRules?: Record<
    string,
    ValidatorFn | ValidationRuleWithoutParams | ValidationRuleWithParams
  >;
  showError?: boolean;
  isLoading?: boolean;
}>();

const model = defineModel<string>({ required: true });

const rules = computed(() => ({
  model: props.vuelidateRules ?? {},
}));

const v$ = useVuelidate(rules, { model }, { $lazy: true, $autoDirty: true });

const isOpen = ref(false);
const toggleOpen = (): boolean => (isOpen.value = !isOpen.value);
const selectValue = (val: string): void => {
  model.value = val;
  isOpen.value = false;
};

const root = ref(null);
onClickOutside(root, () => {
  if (!props.isLoading) {
    isOpen.value = false;
  }
});

const selectedLabel = computed(() => {
  return (
    props.options.find((opt) => opt.title === model.value)?.value ||
    props.placeholder ||
    ""
  );
});
const errorMessage = computed(() => {
  const errors = v$.value.model.$errors;
  return errors.length ? errors[0].$message : "";
});
</script>

<template>
  <div ref="root" class="field">
    <span>{{ label }}</span>
    <div class="input-wrapper">
      <div
        class="base-input"
        :class="{
          invalid: v$.model.$error,
          valid: model && !v$.model.$error,
          disabled: props.isLoading,
        }"
        @click="!props.isLoading && toggleOpen()"
      >
        {{ selectedLabel }}
      </div>
      <ul v-if="isOpen && !props.isLoading" class="options">
        <li
          v-for="option in options"
          :key="option.title"
          @click.stop="selectValue(option.title)"
        >
          {{ option.value }}
        </li>
      </ul>
    </div>
    <span
      v-if="showError"
      :class="{ visible: v$.model.$error }"
      class="error-text"
    >
      {{ errorMessage }}
    </span>
  </div>
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
  background: white;
  border: 1px solid var(--grey-not-active);
  border-radius: 8px;
  padding: 11px 8px 11px 16px;
  width: 100%;
  font-size: 1rem;
  font-weight: 400;
  color: #726f6f;
  cursor: pointer;
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
  color: var(--black);
}

.base-input.invalid {
  border-color: var(--red);
  color: var(--red);
}
.base-input.disabled {
  background-color: rgba(239, 239, 239, 0.3);
  cursor: default;
  pointer-events: none;

  font-size: 1rem;
  color: var(--grey-not-active);
}

.options {
  position: absolute;
  z-index: 10;
  background: white;
  border: 1px solid var(--grey-not-active);
  border-radius: 0 0 8px 8px;

  margin-top: 0.25rem;
  list-style: none;
  padding: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
}

.options li {
  padding: 10px;
  cursor: pointer;
}

.options li:hover {
  background: var(--grey-lighter);
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
