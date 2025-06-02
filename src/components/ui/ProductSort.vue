<script lang="ts" setup>
import { ref } from "vue";
import IconSort from "@/assets/icons/icon-sort.png";
import BaseRadio from "./BaseRadio.vue";
import BaseButton from "./BaseButton.vue";

const sortTitles = [
  { name: "ascending", label: "По возрастанию" },
  { name: "descending", label: "По убыванию" },
  { name: "alphabetically", label: "По наименованию" },
];

const emit = defineEmits<{
  (e: "update:sortType", value: string): void;
}>();

const selectedSort = ref<string>("");
console.log("selectedSort ", selectedSort);
const isSortOpen = ref<boolean>(false);

const toggleSort = (): void => {
  isSortOpen.value = !isSortOpen.value;
};

function cancelSort(): void {
  console.log("Отменить");
}
function applySort(): void {
  emit("update:sortType", selectedSort.value);
}
</script>

<template>
  <div class="sort-container">
    <div class="sort-header" @click="toggleSort">
      <img :src="IconSort" alt="sort-icon" class="sort-icon" />
      <span>Сортировка</span>
    </div>
    <div v-show="isSortOpen" class="sort-window">
      <div v-for="sort in sortTitles" :key="sort.name">
        <BaseRadio
          :id="sort.name"
          v-model="selectedSort"
          :name="sort.name"
          :label="sort.label"
        />
      </div>
      <div class="sort-control">
        <BaseButton
          text="Отменить"
          size="xs-s"
          variant="primary"
          @click="cancelSort"
        />
        <BaseButton
          text="Применить"
          size="xs-s"
          variant="primary"
          @click="applySort"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sort-container {
  position: relative;
}

.sort-header {
  display: flex;
  gap: 10px;
  margin-left: auto;
  cursor: pointer;
}

.sort-window {
  position: absolute;
  top: 24px;
  right: 26px;
  z-index: 1000;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  min-width: 220px;
  max-width: 240px;
  white-space: nowrap;
}

.sort-control {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 812px) {
  .sort-window {
    right: 0;
  }
}
</style>
