<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import ProductCard from "@/components/ui/ProductCard.vue";
import type { ProductProjection } from "@commercetools/platform-sdk";
import { productAdapter } from "@/adapters/product.adapter";
import { getCategoryByKey } from "@/api/commercetools/products/categories";
import { getProductsCategory } from "@/api/commercetools/products/products";
import { checkValidSession } from "@/utils/validSession";
import { useAuthStore } from "@/store/useAuthStore";

const categories = [
  { name: "smartphones", label: "Смартфоны", image: "smartphone.png" },
  { name: "laptops", label: "Ноутбуки", image: "laptop.png" },
  { name: "tablets", label: "Планшеты", image: "tablet.png" },
];

function getImage(file: string): string {
  return new URL(`../assets/images/${file}`, import.meta.url).href;
}

const popularProducts = ref<ProductProjection[]>([]);

onMounted(async () => {
  const auth = useAuthStore();
  await auth.updateTokenIfExpired();

  await checkValidSession();

  const category = await getCategoryByKey("popular");
  const productsResult = await getProductsCategory(category.id);
  popularProducts.value = productsResult.results;
});

const normalizedPopularProducts = computed(() =>
  popularProducts.value.map(productAdapter),
);
</script>

<template>
  <div class="container">
    <span class="breadcrumbs">Главная/Каталог</span>
    <div class="container-wrap">
      <h2 class="subtitle">Каталог</h2>
      <div class="catalog">
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
    <div class="container-wrap">
      <h2 class="subtitle">Популярное</h2>
      <div v-if="normalizedPopularProducts.length > 0">
        <div class="product-list">
          <ProductCard
            v-for="product in normalizedPopularProducts"
            :id="product.id"
            :key="product.id"
            :title="product.title"
            :image="product.image"
            :description="`${product.description} ${product.attributes.rom} ${product.attributes.color}`"
            :price="product.price ?? undefined"
            :discounted-price="product.discountedPrice ?? undefined"
            :discounted-percentage="product.discountedPercentage ?? undefined"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  gap: 32px;
}

.breadcrumbs {
  margin-top: 48px;
}
.container-wrap,
.container {
  display: flex;
  flex-direction: column;
}

.catalog {
  display: flex;
  gap: 16px;
}

.catalog:hover {
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

.product-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
