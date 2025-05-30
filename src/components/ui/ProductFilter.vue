<script lang="ts" setup>
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import BaseCheckbox from "./BaseCheckbox.vue";
import { productFilters, filterLabels } from "@/utils/dataProductFilters";

const emit = defineEmits<{
  (e: "update:filters", value: Record<string, string[]>): void;
}>();

const selectedFilters = ref<Record<string, Record<string, boolean>>>({});

for (const [groupName, options] of Object.entries(productFilters)) {
  selectedFilters.value[groupName] = {};
  for (const option of options) {
    selectedFilters.value[groupName][option.key] = false;
  }
}

function collectFilters(
  filters: Record<string, Record<string, boolean>>,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const [group, values] of Object.entries(filters)) {
    const selected = Object.entries(values)
      .filter(([, isChecked]) => isChecked)
      .map(([key]) => key);

    if (selected.length > 0) {
      result[group] = selected;
    }
  }

  return result;
}

const emitFiltered = useDebounceFn(() => {
  const activeFilters = collectFilters(selectedFilters.value);
  console.log("Выбранные фильтры:", activeFilters);
  emit("update:filters", activeFilters);
}, 800);

watch(
  selectedFilters,
  () => {
    emitFiltered();
  },
  { deep: true },
);
</script>

<template>
  <div class="container">
    <div
      v-for="(options, groupName) in productFilters"
      :key="groupName"
      class="group"
    >
      <h3 class="title">{{ filterLabels[groupName] }}</h3>
      <div v-for="option in options" :key="option.key" class="variant">
        <BaseCheckbox
          :id="option.key"
          v-model="selectedFilters[groupName][option.key]"
          :name="option.key"
          :label="option.name"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 260px;
  width: 100%;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.group {
  margin: 8px 0;
}

.title {
  font-weight: 400;
  font-size: 16px;
  margin: 5px 0;
}
</style>
