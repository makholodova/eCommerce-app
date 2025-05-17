<script lang="ts" setup>
import TheHeader from "./components/header/TheHeader.vue";
</script>

<template>
  <TheHeader />
  <transition name="fade" mode="out-in">
    <router-view />
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
