<script lang="ts" setup>
const inputValue = defineModel<string>({ required: true });
defineProps<{
  label: string;
  id: string;
  name: string;
}>();
</script>

<template>
  <label class="radio">
    <input
      :id="id"
      v-model="inputValue"
      :name="name"
      :value="id"
      class="radio-input"
      type="radio"
    />
    <span class="radio-label">{{ label }}</span>
  </label>
</template>

<style scoped>
.radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  max-width: 700px;
  user-select: none;
  -webkit-user-select: none;
}

.radio-label {
  transition: color 0.2s ease;
}
.radio-label:hover {
  cursor: pointer;
  color: var(--blue-hover);
}
</style>
