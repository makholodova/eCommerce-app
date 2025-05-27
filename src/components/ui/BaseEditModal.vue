<script lang="ts" setup>
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
  title: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-window">
      <h2 class="modal-title">{{ title }}</h2>
      <div class="modal-content">
        <slot />
      </div>
      <div class="modal-actions">
        <BaseButton size="sm" text="Сохранить" type="submit" />
        <BaseButton
          size="sm"
          text="Отмена"
          type="button"
          @click="emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 500px;
}

.modal-title {
  font-size: 18px;
  margin-bottom: 16px;
}

.modal-content {
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
