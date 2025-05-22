<script lang="ts" setup></script>

<template>
  <div>
    <h3>catalog page</h3>
    <router-link :to="{ name: 'Smartphones' }">Ссылка на смартфоны</router-link>
    <router-link :to="{ name: 'Laptops' }">Ссылка на ноутбуки</router-link>
    <router-link :to="{ name: 'Tablets' }">Ссылка на планшеты</router-link>
  </div>
</template>

<style scoped></style>
