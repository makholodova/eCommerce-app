<script lang="ts" setup>
import BaseButton from "@/components/ui/BaseButton.vue";
</script>

<template>
  <section>
    <h1>Ошибка 404</h1>
    <img
      src="@/assets/notFoundPage.png"
      alt="not found img"
      class="not-found-img"
    />
    <h2 class="not-found-text">
      404 — здесь только пустые коробки. Похоже, вы свернули не туда. Давайте
      вернёмся на главную.
    </h2>
    <router-link :to="{ name: 'Main' }">
      <BaseButton
        text="Вернуться на главную страницу"
        size="xl"
        class="go-to-main-page-btn"
      >
      </BaseButton>
    </router-link>
  </section>
</template>

<style scoped>
section {
  padding: 32px 34px;
}
.go-to-main-page-btn {
  margin: 0 auto;
  margin-top: 20px;
  display: block;
}
a {
  text-decoration: none;
}
h1 {
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
}
.not-found-img {
  display: block;
  margin: 0 auto;
  max-width: 300px;
}
.not-found-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #454545;
}
</style>
