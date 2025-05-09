<script lang="ts" setup>
import { defineProps } from "vue";

const model = defineModel<string>();

defineProps<{
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  error?: string;
}>();
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <input
      :id="id"
      v-model="model"
      :class="['base-input', { valid: model && !error, error: !!error }]"
      :placeholder="placeholder"
      :type="type"
      :value="model"
    />
    <span v-if="error" class="error-text">{{ error }}</span>
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

/*.base-input.error {
  font-size: 1rem;
  border: 1px solid var(--red);
  color: var(--red);
}*/

.base-input:focus:not(.error) {
  border: 1px solid var(--black);
  color: var(--black);
}

.error-text {
  color: var(--red);
  font-size: 0.7rem;
}
</style>
