<script lang="ts" setup>
const inputValue = defineModel<boolean>({ required: true });
defineProps<{
  id: string;
  label: string;
}>();
</script>

<template>
  <label class="checkbox">
    <input :id v-model="inputValue" class="checkbox-input" type="checkbox" />
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

/*.checkbox-input {
  width: 18px;
  height: 18px;
  appearance: none;
  border: 2px solid var(--blue);
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  background-color: var(--blue);
  border-color: var(--blue);
}

.checkbox-input:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid var(--white);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:checked {
  border-color: var(--blue);
}*/

.checkbox-label {
  transition: color 0.2s ease;
}
.checkbox-label:hover {
  cursor: pointer;
  color: var(--blue-hover);
}
</style>
