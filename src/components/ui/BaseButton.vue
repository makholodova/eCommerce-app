<script lang="ts" setup>
type ButtonProps = {
  text: string;
  size?: "xs-s" | "xs" | "sm" | "md" | "lg" | "xl";
  type?: "button" | "submit";
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
};

const {
  size = "md",
  type = "button",
  text,
  disabled,
  variant = "primary",
} = defineProps<ButtonProps>();
</script>

<template>
  <button
    :type
    :disabled="disabled || isLoading"
    :class="['button', `size-${size}`, `variant-${variant}`]"
  >
    <span v-if="isLoading" class="spinner" />
    <span v-else
      ><slot>{{ text }}</slot></span
    >
  </button>
</template>

<style scoped>
.button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  transition:
    background 0.2s ease,
    color 0.2s ease;
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

.size-xs {
  max-width: 96px;
  height: 34px;
  font-size: 14px;
}

.size-xs-s {
  max-width: 80px;
  height: 30px;
  font-size: 12px;
}

.variant-primary {
  background-color: var(--blue);
  color: var(--white);
}
.variant-primary:hover {
  background-color: var(--blue-hover);
}

.variant-secondary {
  background-color: var(--grey);
  color: var(--white);
}
.variant-secondary:hover {
  background-color: var(--grey-dark);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--white);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
