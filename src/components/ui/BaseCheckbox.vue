<script lang="ts" setup>
const inputValue = defineModel<boolean>({ required: true });
defineProps<{
  label: string;
  id: string;
  name: string;
}>();
</script>

<template>
  <label class="checkbox">
    <input
      :id="id"
      v-model="inputValue"
      :name="name"
      class="checkbox-input"
      type="checkbox"
    />
    <span class="checkbox-label">{{ label }}</span>
  </label>
</template>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  max-width: 700px;
  user-select: none;
  -webkit-user-select: none;
}

.checkbox-label {
  transition: color 0.2s ease;
}
.checkbox-label:hover {
  cursor: pointer;
  color: var(--blue-hover);
}
</style>
