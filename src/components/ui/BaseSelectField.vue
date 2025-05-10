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
onClickOutside(root, () => (isOpen.value = false));

const selectedLabel = computed(() => {
  return (
    props.options.find((opt) => opt.title === model.value)?.value ||
    props.placeholder ||
    ""
  );
});
</script>

<template>
  <div ref="root" class="field">
    <span>{{ label }}</span>
    <div class="dropdown" @click="toggleOpen">
      <div :class="['selected', { invalid: v$.model.$error }]">
        {{ selectedLabel }}
      </div>
      <ul v-if="isOpen" class="options">
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
      v-if="showError && v$.model.$error"
      :class="{ visible: v$.model.$error }"
      class="error-text"
    >
      {{ v$.model.$errors[0]?.$message }}
    </span>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown {
  position: relative;
  user-select: none;
}

.selected {
  border: 1px solid var(--grey-not-active);
  border-radius: 8px;
  padding: 11px 8px;
  cursor: pointer;
}

.selected.invalid {
  border-color: var(--red);
  color: var(--red);
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
  background: var(--grey-light);
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
