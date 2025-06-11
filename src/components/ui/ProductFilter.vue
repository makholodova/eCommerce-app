<script lang="ts" setup>
import type { AttributeDefinition } from "@commercetools/platform-sdk";
import { ref, onMounted, watch } from "vue";
import BaseCheckbox from "./BaseCheckbox.vue";
import BaseButton from "./BaseButton.vue";
import { useFilterStore } from "@/store/useProductFilterStore";
import IconCross from "@/assets/icons/icon-cross.svg";
import { convertFiltersToApiFormat } from "@/utils/filters/filters";
import { getAttributes } from "@/api/commercetools/products/attributes";
import { adaptAttributes } from "@/adapters/type.adapter";
import type { ProductFilterMap } from "@/types/types";

const filterStore = useFilterStore();

const props = defineProps<{
  category: string;
  isMobile?: boolean;
  onClose?: () => void;
}>();

const emit = defineEmits<{
  (e: "update:filters", value: Record<string, string[] | number>): void;
}>();

const selectedFilters = ref<Record<string, Record<string, boolean>>>({});
const priceMin = ref<number | null>(null);
const priceMax = ref<number | null>(null);
const attributes = ref<AttributeDefinition[]>([]);
const productFilters = ref<ProductFilterMap>({});

watch(
  () => productFilters.value,
  (filters) => {
    for (const [groupName, group] of Object.entries(filters)) {
      selectedFilters.value[groupName] = {};
      for (const option of group.options) {
        selectedFilters.value[groupName][option.key] = false;
      }
    }
  },
  { immediate: true },
);

function initializeFiltersFromStore(): void {
  const {
    selectedFilters: storeSelected,
    priceMin: storeMin,
    priceMax: storeMax,
  } = filterStore.getFilters(props.category);

  priceMin.value = storeMin;
  priceMax.value = storeMax;

  for (const [groupName, group] of Object.entries(productFilters.value)) {
    const groupFromStore = storeSelected[groupName] ?? {};

    for (const option of group.options) {
      selectedFilters.value[groupName][option.key] =
        groupFromStore[option.key] ?? false;
    }
  }
}

function resetFilters(): void {
  for (const group of Object.keys(selectedFilters.value)) {
    for (const key of Object.keys(selectedFilters.value[group])) {
      selectedFilters.value[group][key] = false;
    }
  }
  priceMin.value = null;
  priceMax.value = null;

  filterStore.resetFilters(props.category);
  emit("update:filters", {});
}

function applyFilters(): void {
  const filterData = {
    selectedFilters: selectedFilters.value,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
  };

  filterStore.setFilters(props.category, filterData);
  const filtersForApi = convertFiltersToApiFormat(filterData);

  emit("update:filters", filtersForApi);

  if (props.isMobile && props.onClose) {
    props.onClose();
  }
}

async function loadAttributes(): Promise<void> {
  try {
    attributes.value = await getAttributes();
    productFilters.value = adaptAttributes(attributes.value);
  } catch (error) {
    console.error("Ошибка при загрузке атрибутов:", error);
  }
}

onMounted(async () => {
  await loadAttributes();
  initializeFiltersFromStore();
});
</script>

<template>
  <div class="container">
    <button v-if="isMobile" type="button" class="button-cross" @click="onClose">
      <img :src="IconCross" alt="cross" class="icon-cross" />
    </button>
    <div class="filter-price">
      <h3 class="title">Цена, ₽</h3>
      <div class="price-range">
        <input
          id="price-min"
          v-model="priceMin"
          name="priceMin"
          type="number"
          placeholder="от 4 500 ₽"
          class="price-input price-input-min"
          autocomplete="off"
        />
        <div class="price-separator"></div>
        <input
          id="price-max"
          v-model="priceMax"
          name="priceMax"
          type="number"
          placeholder="до 300 500 ₽"
          class="price-input price-input-max"
          autocomplete="off"
        />
      </div>
    </div>
    <div
      v-for="(filterGroup, groupName) in productFilters"
      :key="groupName"
      class="filter-checkbox"
    >
      <h3 class="title">{{ filterGroup.title }}</h3>
      <div
        v-for="option in filterGroup.options"
        :key="option.key"
        class="variant"
      >
        <BaseCheckbox
          :id="option.key"
          v-model="selectedFilters[groupName][option.key]"
          :name="option.key"
          :label="option.name"
        />
      </div>
    </div>
    <div class="button-control">
      <BaseButton
        text="Сбросить"
        size="xs"
        variant="primary"
        @click="resetFilters"
      />
      <BaseButton
        text="Применить"
        size="xs"
        variant="primary"
        @click="applyFilters"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  max-width: 276px;
  width: 100%;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.filter-checkbox {
  margin: 8px 0;
}

.title {
  font-size: 16px;
  margin: 5px 0;
}
.price-range {
  display: flex;
  align-items: center;
  margin: 12px 0 14px;
}

.price-input {
  padding: 12px 10px;
  border: none;
  border-radius: 8px;
  background-color: var(--blue-light);
  color: var(--grey-dark);
}

.price-input-min {
  max-width: 100px;
  width: 100%;
}

.price-input-max {
  max-width: 120px;
  width: 100%;
}

.price-separator {
  flex: 1;
  margin: 0 2px;
  border-top: 1px solid var(--grey-light);
}

.button-control {
  display: flex;
  justify-content: space-between;
}

.button-cross {
  border: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
}

.icon-cross {
  width: 36px;
}
</style>
