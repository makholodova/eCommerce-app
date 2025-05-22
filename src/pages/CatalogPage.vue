<script lang="ts" setup></script>

<template>
  <div>
    <h3>catalog page</h3>
    <router-link
      :to="{ name: 'CatalogCategory', params: { category: 'smartphones' } }"
      >Ссылка на смартфоны</router-link
    >
    <router-link
      :to="{ name: 'CatalogCategory', params: { category: 'laptops' } }"
      >Ссылка на ноутбуки</router-link
    >
    <router-link
      :to="{ name: 'CatalogCategory', params: { category: 'tablets' } }"
      >Ссылка на планшеты</router-link
    >
  </div>
</template>

<style scoped></style>
