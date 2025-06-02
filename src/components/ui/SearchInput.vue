<script lang="ts" setup>
import IconSearch from "@/assets/icons/icon-search.png";

const inputValue = defineModel<string>({ required: true });

const emit = defineEmits<{
  (e: "search", query: string): void;
}>();

function onSearchClick(): void {
  emit("search", inputValue.value);
}
</script>

<template>
  <div class="container">
    <div
      class="search"
      :class="{ 'search--disabled': !inputValue.trim() }"
      @click="onSearchClick"
    >
      <button type="button" class="button-search">
        <img :src="IconSearch" alt="search" class="icon-search" />
      </button>
    </div>
    <input
      id="search"
      v-model="inputValue"
      name="search"
      type="text"
      placeholder="Поиск..."
      class="input-search"
      autocomplete="off"
      @keydown.enter="onSearchClick"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 600px;
  height: 40px;
  background-color: var(--grey-lighter);
  border-radius: 8px;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100%;
  cursor: pointer;
  border-radius: 8px;
  background-color: var(--grey-light);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.search:hover {
  background-color: var(--grey-light-hover);
}

.button-search {
  border: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon-search {
  width: 18px;
  height: 18px;
}

.input-search {
  border: none;
  outline: none;
  background-color: var(--grey-lighter);
  font-size: 16px;
  color: #333;
  width: 100%;
  border-radius: 8px;
}

.search--disabled {
  pointer-events: none;
  cursor: not-allowed;
}

@media (max-width: 495px) {
  .search {
    width: 60px;
  }
}
</style>
