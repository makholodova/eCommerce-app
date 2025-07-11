﻿<script lang="ts" setup>
import { watch } from "vue";
import { useScrollLock } from "@vueuse/core";
import closeBtnIcon from "@/assets/icons/close-modal-btn.svg";

const props = defineProps<{
  title: string;
  isOpen: boolean;
  closeBtnNeeded?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const isScrollLocked = useScrollLock(document.body);

watch(
  () => props.isOpen,
  (val) => {
    isScrollLocked.value = val;
  },
  { immediate: true },
);
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-window">
        <div v-if="closeBtnNeeded" class="close-btn" @click="emit('close')">
          <closeBtnIcon alt="close button" class="close-btn-img" />
        </div>
        <h2 class="modal-title">{{ title }}</h2>
        <div class="modal-content">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 1;
}
.close-btn-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 320px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-title {
  font-weight: 500;
  text-align: center;
  font-size: 22px;
}
.modal-window::-webkit-scrollbar {
  width: 8px;
}
.modal-window::-webkit-scrollbar-track {
  background: transparent;
}
.modal-window::-webkit-scrollbar-thumb {
  background-color: var(--grey-light);
  border-radius: 4px;
}
</style>
