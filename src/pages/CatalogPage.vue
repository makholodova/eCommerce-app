<script lang="ts" setup>
const categories = [
  { name: "smartphones", label: "Смартфоны", image: "smartphone.png" },
  { name: "laptops", label: "Ноутбуки", image: "laptop.png" },
  { name: "tablets", label: "Планшеты", image: "tablet.png" },
];

function getImage(file: string): string {
  return new URL(`../assets/images/${file}`, import.meta.url).href;
}
</script>

<template>
  <div class="container-main">
    <div class="catalog">
      <span>Главная/Каталог</span>
      <h2 class="subtitle">Каталог</h2>
      <div class="catalog-container">
        <router-link
          v-for="item in categories"
          :key="item.name"
          :to="{ name: 'CatalogCategory', params: { category: item.name } }"
          class="category-card"
        >
          <img
            :src="getImage(item.image)"
            :alt="item.label"
            class="category-image"
          />
          <span class="category-label">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-main {
  border: 1px solid red;
}

.catalog {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
}

.catalog-container {
  display: flex;
  gap: 16px;
}

.catalog-container:hover {
  cursor: pointer;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 200px;
  text-decoration: none;
  color: var(--black);
}

.category-image {
  width: 100%;
  background-color: var(--blue-lighter);
  border-radius: 8px;
}

.category-label {
  font-weight: 300;
  font-size: clamp(16px, 2.5vw, 20px);
}
</style>
