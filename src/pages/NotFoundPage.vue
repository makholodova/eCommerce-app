<script lang="ts" setup>
import BaseButton from "@/components/ui/BaseButton.vue";
</script>

<template>
  <h1>Ошибка 404</h1>
  <img
    src="@/assets/notFoundPage.png"
    alt="not found img"
    class="not-found-img"
  />
  <p class="not-found-text">
    Перезагрузите страницу или проверьете подключение к интернету
  </p>
  <router-link :to="{ name: 'Main' }">
    <BaseButton text="Вернуться на главную страницу"> </BaseButton>
  </router-link>
</template>

<style scoped>
h1 {
}
.not-found-img {
}
.not-found-text {
}
</style>
