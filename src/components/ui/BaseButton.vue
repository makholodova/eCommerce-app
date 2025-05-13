<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults } from "vue";

type ButtonProps = {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  type?: "button" | "submit";
  disabled?: boolean;
};

const props = withDefaults(defineProps<ButtonProps>(), {
  size: "md",
  type: "button",
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['button', `size-${size}`]"
    @click="emit('click')"
  >
    {{ props.text }}
  </button>
</template>

<style scoped>
.button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  background-color: var(--blue);
  color: var(--white);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.button:hover {
  background-color: var(--blue-hover);
}

.button:disabled {
  pointer-events: none;
  background-color: var(--blue-light);
  color: var(--grey-not-active);
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
</style>
