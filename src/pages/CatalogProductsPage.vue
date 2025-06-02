<script lang="ts" setup>
import { onMounted, ref, computed, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import type { ProductProjection } from "@commercetools/platform-sdk";
import ProductCard from "@/components/ui/ProductCard.vue";
import { getCategoryByKey } from "@/api/commercetools/products/categories";
import {
  getProductsCategory,
  searchProductsInCategory,
  getFilteredProducts,
} from "@/api/commercetools/products/products";
import { productAdapter } from "@/adapters/product.adapter";
import { useAuthStore } from "@/store/useAuthStore";
import IconFilter from "@/assets/icons/icon-filter.png";
import SearchInput from "@/components/ui/SearchInput.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import { productErrorMessages } from "@/utils/errors/errorMessages";
import ProductFilter from "@/components/ui/ProductFilter.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useModal } from "@/composables/useModal";
import { MOBILE_FILTER_BREAKPOINT } from "@/utils/constants";
import { useFilterStore } from "@/store/useProductFilterStore";
import { getDataFiltersForApi } from "@/utils/filters/filters";
import type { breadCrumbType } from "@/types/user-login.types";
import BaseBreadcrumbs from "@/components/ui/BaseBreadcrumbs.vue";
import ProductSort from "@/components/ui/ProductSort.vue";
import { sortApiMap } from "@/utils/filters/filters";

const props = defineProps<{ category: string }>();
const products = ref<ProductProjection[]>([]);
const searchQuery = ref<string>("");
const isLoaded = ref(false);
const filters = ref<Record<string, string[] | number>>({});
const sortType = ref<string>("");
const isMobile = ref(window.innerWidth <= MOBILE_FILTER_BREAKPOINT);

const { modalState, openModal, closeModal } = useModal();

const filterStore = useFilterStore();

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

async function loadProducts(query?: string): Promise<void> {
  isLoaded.value = false;

  const productsResult = await getCategoryId((categoryId) => {
    const filters = filterStore.getFilters(props.category);
    const filtersForApi = getDataFiltersForApi(filters);

    if (query) {
      return searchProductsInCategory(categoryId, query, filtersForApi ?? {});
    }
    return filtersForApi
      ? getFilteredProducts(categoryId, filtersForApi)
      : getProductsCategory(categoryId);
  });

  products.value = productsResult?.results ?? [];
  isLoaded.value = true;
}

async function loadInitialProducts(): Promise<void> {
  await loadProducts();
}

async function handleSearchClick(query: string): Promise<void> {
  await loadProducts(query);
}

watch(searchQuery, async (newQuery) => {
  if (newQuery === "") await loadInitialProducts();
});

watch([filters, sortType], async ([newFilters, newSort]) => {
  isLoaded.value = false;
  const sortParam = newSort ? sortApiMap[newSort] : "";
  const productsResult = await getCategoryId((categoryId) => {
    if (searchQuery.value.trim()) {
      return searchProductsInCategory(
        categoryId,
        searchQuery.value,
        newFilters,
        sortParam,
      );
    } else {
      return getFilteredProducts(categoryId, newFilters, sortParam);
    }
  });

  products.value = productsResult?.results ?? [];
  isLoaded.value = true;
});

useEventListener("resize", () => {
  isMobile.value = window.innerWidth <= MOBILE_FILTER_BREAKPOINT;
});

const normalizedProducts = computed(() => products.value.map(productAdapter));

onMounted(() => {
  loadInitialProducts();
});

const breadcrumbsRoutes: breadCrumbType[] = [
  {
    routeName: "Main",
    breadcrumbName: "Главная",
  },
  {
    routeName: "Catalog",
    breadcrumbName: "Каталог",
  },
];
if (title.value) {
  breadcrumbsRoutes.push({
    routeName: "CatalogCategory",
    breadcrumbName: title.value,
    params: {
      category: title.value,
    },
  });
}
</script>

<template>
  <div class="wrapper">
    <BaseBreadcrumbs :breadcrumbs="breadcrumbsRoutes" />
    <div class="toolbar">
      <SearchInput v-model="searchQuery" @search="handleSearchClick" />
    </div>
    <ProductSort
      v-if="!isMobile"
      class="sort"
      :sort-type="sortType"
      @update:sort-type="sortType = $event"
    />
    <div class="product">
      <ProductFilter
        v-if="!isMobile"
        :category="props.category"
        @update:filters="filters = $event"
      />
      <div v-if="isMobile" class="product-mobi">
        <div class="product-filter" @click="openModal('filter')">
          <img :src="IconFilter" alt="filter" class="filter-icon" />
          <span>Фильтры</span>
        </div>
        <ProductSort
          class="sort"
          :sort-type="sortType"
          @update:sort-type="sortType = $event"
        />
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
          :category="category"
          :title="product.title"
          :image="product.images[0]"
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
.wrapper {
  padding-top: clamp(8px, 3vw, 30px);
}
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

.sort {
  padding: 0 40px 16px 0;
  margin-left: auto;
}

.product-filter {
  display: flex;
  gap: 6px;
  cursor: pointer;
  align-items: center;
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

  .sort {
    padding: 0;
    margin: 0;
  }

  .product-mobi {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
