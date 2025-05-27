<script lang="ts" setup>
defineProps<{
  title: string;
  isOpen: boolean;
}>();
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-window">
      <h2 class="modal-title">{{ title }}</h2>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
body.modal-overlay {
  overflow: hidden;
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
}

.modal-title {
  font-weight: 500;
  text-align: center;
  font-size: 22px;
  /* margin-bottom: 1rem;*/
}
</style>
