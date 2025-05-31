<script lang="ts" setup>
import { onMounted, ref, computed, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import { useRouter } from "vue-router";
import ProductCard from "@/components/ui/ProductCard.vue";
import { getCategoryByKey } from "@/api/commercetools/products/categories";
import {
  getProductsCategory,
  searchProductsInCategory,
  getFilteredProducts,
} from "@/api/commercetools/products/products";
import type { ProductProjection } from "@commercetools/platform-sdk";
import { productAdapter } from "@/adapters/product.adapter";
import { useAuthStore } from "@/store/useAuthStore";
import IconArrow from "@/assets/icons/icon-arrow.png";
import IconFilter from "@/assets/icons/icon-filter.png";
import SearchInput from "@/components/ui/SearchInput.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import { productErrorMessages } from "@/utils/errors/errorMessages";
import ProductFilter from "@/components/ui/ProductFilter.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useModal } from "@/composables/useModal";
import { MOBILE_FILTER_BREAKPOINT } from "@/utils/constants";
import { useFilterStore } from "@/store/useProductFilterStore";

const props = defineProps<{ category: string }>();
const products = ref<ProductProjection[]>([]);
const searchQuery = ref<string>("");
const isLoaded = ref(false);
const filters = ref<Record<string, string[] | number>>({});
const isMobile = ref(window.innerWidth <= MOBILE_FILTER_BREAKPOINT);

const { modalState, openModal, closeModal } = useModal();

const filterStore = useFilterStore();

function getFiltersForApi(
  category: string,
): Record<string, string[] | number> | null {
  const { selectedFilters, priceMin, priceMax } =
    filterStore.getFilters(category);

  const hasAnySelected = Object.keys(selectedFilters).some((group) =>
    Object.values(selectedFilters[group] ?? {}).includes(true),
  );

  const hasFilters = hasAnySelected || priceMin !== null || priceMax !== null;

  if (!hasFilters) return null;

  const filtersForApi: Record<string, string[] | number> = {};

  for (const [group, options] of Object.entries(selectedFilters)) {
    const selected = Object.entries(options)
      .filter(([, isChecked]) => isChecked)
      .map(([key]) => key);

    if (selected.length > 0) {
      filtersForApi[group] = selected;
    }
  }

  if (priceMin !== null) {
    filtersForApi.priceMin = priceMin;
  }
  if (priceMax !== null) {
    filtersForApi.priceMax = priceMax;
  }

  return filtersForApi;
}

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
): Promise<T | null> {
  try {
    await auth.updateTokenIfExpired();
    const category = await getCategoryByKey(props.category);
    return await fn(category.id);
  } catch (error) {
    if (error instanceof Error) {
      const message =
        productErrorMessages[error.message] || "Ошибка при загрузке товаров.";
      console.error(message, error);
    }
    return null;
  }
}

async function loadInitialProducts(): Promise<void> {
  isLoaded.value = false;

  const productsResult = await getCategoryId((categoryId) => {
    const filtersForApi = getFiltersForApi(props.category);

    if (filtersForApi) {
      return getFilteredProducts(categoryId, filtersForApi);
    } else {
      return getProductsCategory(categoryId);
    }
  });

  products.value = productsResult?.results ?? [];
  isLoaded.value = true;
}

async function handleSearchClick(query: string): Promise<void> {
  isLoaded.value = false;

  const productsResult = await getCategoryId((categoryId) =>
    searchProductsInCategory(categoryId, query),
  );
  if (productsResult) {
    //products.value = productsResult?.results ?? [];
    console.log("productsResult ", productsResult);
    products.value = productsResult.results;
    console.log("products.value ", products.value);
  } else {
    products.value = [];
  }
  isLoaded.value = true;
}

watch(searchQuery, async (newQuery) => {
  if (newQuery === "") await loadInitialProducts();
});

watch(filters, async (newFilters) => {
  isLoaded.value = false;
  const productsResult = await getCategoryId((categoryId) =>
    getFilteredProducts(categoryId, newFilters),
  );
  products.value = productsResult?.results ?? [];
  isLoaded.value = true;
});

const normalizedProducts = computed(() => products.value.map(productAdapter));

onMounted(() => {
  loadInitialProducts();
});

useEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 812;
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
    <div class="product">
      <ProductFilter
        v-if="!isMobile"
        :category="props.category"
        @update:filters="filters = $event"
      />
      <div v-if="isMobile" class="product-filter" @click="openModal('filter')">
        <img :src="IconFilter" alt="filter" class="filter-icon" />
        <span>Фильтры</span>
      </div>
      <BaseModal
        v-if="isMobile && modalState === 'filter'"
        title=""
        :is-open="true"
        @close="closeModal"
      >
        <ProductFilter
          :is-mobile="isMobile"
          :on-close="closeModal"
          :category="props.category"
          @update:filters="filters = $event"
        />
      </BaseModal>
      <BaseSpinner v-if="!isLoaded" />
      <div v-else-if="isSearchWord" class="product-list">
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
      <h2 v-else class="subtitle">Товары не найдены</h2>
    </div>
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

.product-filter {
  display: flex;
  gap: 6px;
  cursor: pointer;
  align-items: center;
  /*margin-left: auto;*/
}

.filter-icon {
  width: clamp(16px, 2.5vw, 24px);
}

.product {
  display: flex;
  gap: clamp(30px, 5vw, 75px);
  align-items: flex-start;
}

.product-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 862px) {
  .product {
    gap: clamp(10px, 1.2vw, 30px);
  }
}

@media (max-width: 812px) {
  .toolbar {
    display: flex;
    flex-direction: column;
    align-items: normal;
    gap: 10px;
    margin-right: 0;
  }

  .product {
    flex-direction: column;
  }
}
</style>
