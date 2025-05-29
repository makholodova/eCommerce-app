<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/ui/ProductCard.vue";
import { getCategoryByKey } from "@/api/commercetools/products/categories";
import {
  getProductsCategory,
  searchProductsInCategory,
} from "@/api/commercetools/products/products";
import type { ProductProjection } from "@commercetools/platform-sdk";
import { productAdapter } from "@/adapters/product.adapter";
import { useAuthStore } from "@/store/useAuthStore";
import IconArrow from "@/assets/icons/icon-arrow.png";
import SearchInput from "@/components/ui/SearchInput.vue";

const props = defineProps<{ category: string }>();
const products = ref<ProductProjection[]>([]);
const searchQuery = ref<string>("");
const isLoaded = ref(false);

const categoryTitles: Record<string, string> = {
  smartphones: "Смартфоны",
  laptops: "Ноутбуки",
  tablets: "Планшеты",
};

const title = computed(
  () => categoryTitles[props.category] || "Неизвестная категория",
);
const isSearchWord = computed(() => products.value.length > 0);

const auth = useAuthStore();

const router = useRouter();

function goBackToCatalogPage(): void {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: "Catalog" });
  }
}

async function getCategoryId<T>(
  fn: (categoryId: string) => Promise<T>,
): Promise<T> {
  await auth.updateTokenIfExpired();
  const category = await getCategoryByKey(props.category);
  return fn(category.id);
}

async function loadInitialProducts(): Promise<void> {
  const productsResult = await getCategoryId(getProductsCategory);
  products.value = productsResult.results;
  isLoaded.value = true;
}

async function handleSearchClick(query: string): Promise<void> {
  const productsResult = await getCategoryId((categoryId) =>
    searchProductsInCategory(categoryId, query),
  );
  console.log("productsResult ", productsResult);
  products.value = productsResult.results;
  console.log("products.value ", products.value);
}

const normalizedProducts = computed(() => products.value.map(productAdapter));

onMounted(() => {
  loadInitialProducts();
});
</script>

<template>
  <div>
    <span class="breadcrumbs">Главная/Каталог/Смартфоны</span>
    <div class="toolbar">
      <div class="toolbar-nav">
        <img
          :src="IconArrow"
          alt="arrow"
          class="arrow"
          @click="goBackToCatalogPage"
        />
        <h1 class="subtitle">{{ title }}</h1>
      </div>
      <SearchInput v-model="searchQuery" @search="handleSearchClick" />
    </div>
    <div v-if="!isLoaded">
      <h2 class="subtitle">Загрузка товаров...</h2>
    </div>
    <div v-else-if="isSearchWord">
      <div class="product-list">
        <ProductCard
          v-for="product in normalizedProducts"
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
    <h2 v-else class="subtitle">Товары не найдены</h2>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: clamp(40px, 9vw, 140px);
  margin: 32px 24px 29px 0;
  align-items: center;
}

.toolbar-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.arrow {
  cursor: pointer;
  width: clamp(8px, 2.5vw, 13px);
}

.product-list {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 748px) {
  .toolbar {
    display: flex;
    flex-direction: column;
    align-items: normal;
    gap: 10px;
    margin-right: 0;
  }
}
</style>
