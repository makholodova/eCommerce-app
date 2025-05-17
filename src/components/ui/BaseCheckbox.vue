<script lang="ts" setup>
const inputValue = defineModel<boolean>({ required: true });
defineProps<{
  label: string;
}>();
</script>

<template>
  <label class="checkbox">
    <input v-model="inputValue" class="checkbox-input" type="checkbox" />
    <span class="checkbox-label">{{ label }}</span>
  </label>
</template>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.checkbox-label {
  transition: color 0.2s ease;
}
.checkbox-label:hover {
  cursor: pointer;
  color: var(--blue-hover);
}
</style>
