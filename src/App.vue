<script lang="ts" setup>
import TheHeader from "./components/header/TheHeader.vue";
import BaseContainer from "@/components/ui/BaseContainer.vue";
</script>

<template>
  <TheHeader />
  <BaseContainer>
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </BaseContainer>
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
