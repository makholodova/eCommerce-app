<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import ProductCard from "@/components/ui/ProductCard.vue";
import { getCategoryByKey } from "@/api/commercetools/products/categories";
import { getProductsCategory } from "@/api/commercetools/products/products";
import type { ProductProjection } from "@commercetools/platform-sdk";
import { useTokenStore } from "@/store/useTokenStore";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import { loginAnonymous } from "@/api/commercetools/loginAnonymous";
import { productAdapter } from "@/adapters/product.adapter";

const props = defineProps<{ category: string }>();

const categoryTitles: Record<string, string> = {
  smartphones: "Смартфоны",
  laptops: "Ноутбуки",
  tablets: "Планшеты",
};

const title = categoryTitles[props.category];
const products = ref<ProductProjection[]>([]);

onMounted(async () => {
  const tokenStore = useTokenStore();
  const anonymousStore = useAnonymousTokenStore();

  if (!tokenStore.token && !anonymousStore.token) {
    await loginAnonymous();
  }

  const category = await getCategoryByKey(props.category);
  console.log("Category ", category);

  const productsResult = await getProductsCategory(category.id);
  products.value = productsResult.results;
  console.log("products.value ", products.value);
});

const normalizedProducts = computed(() => products.value.map(productAdapter));
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div v-if="normalizedProducts.length > 0">
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
  </div>
</template>

<style scoped>
.product-list {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
