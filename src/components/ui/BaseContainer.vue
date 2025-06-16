<script lang="ts" setup></script>

<template>
  <main class="container">
    <slot></slot>
  </main>
</template>

<style scoped>
.container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(16px, 5vw, 80px);
}
</style>
