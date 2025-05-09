<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  type?: "button" | "submit";
  variant?: "primary" | "disabled";
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    :class="[
      'base-button',
      `type-${type}`,
      `size-${size}`,
      `variant-${variant}`,
    ]"
    @click="emit('click')"
  >
    {{ props.text }}
  </button>
</template>

<style scoped>
.base-button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  font-weight: 500;
}

.size-xl {
  max-width: 267px;
  height: 49px;
  font-size: 16px;
}

.size-lg {
  max-width: 199px;
  height: 49px;
  font-size: 16px;
}

.size-md {
  max-width: 200px;
  height: 44px;
  font-size: 14px;
}

.size-sm {
  max-width: 164px;
  height: 44px;
  font-size: 14px;
}

.variant-primary {
  background-color: var(--blue);
  color: var(--white);
}

.variant-disabled {
  pointer-events: none;
  background-color: var(--blue-light);
  color: var(--grey-not-active);
}
</style>
