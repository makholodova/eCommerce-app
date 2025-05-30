<script setup lang="ts">
import { TabKey } from "@/types/enums.ts";

const tabs = [TabKey.Account, TabKey.Address];

const tabLabels = {
  Account: "Персональные данные",
  Address: "Адреса",
};

const modelValue = defineModel<TabKey>();
</script>

<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab"
      class="tab"
      :class="{ active: tab === modelValue }"
      @click="modelValue = tab"
    >
      {{ tabLabels[tab] }}
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  color: var(--blue);
  border-bottom: 1px solid var(--blue);
  margin-bottom: 1rem;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 400;
  border-bottom: 3px solid transparent;
  transition:
    background-color 0.2s ease,
    border-bottom 0.2s ease;
}

.tab:hover {
  background-color: var(--blue-lighter);
}

.tab.active {
  border-bottom: 2px solid var(--blue);
  font-weight: 500;
  color: var(--blue);
}
</style>
