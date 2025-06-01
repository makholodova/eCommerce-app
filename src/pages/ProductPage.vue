<script lang="ts" setup>
import BaseBreadcrumbs from "@/components/ui/BaseBreadcrumbs.vue";
import type { breadCrumbType } from "@/types/user-login.types";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { productAdapter } from "@/adapters/product.adapter";
import type { ProductAdapter } from "@/types/interfaces";
import api from "@/api/commercetools/axiosInstance";
import { useRouter } from "vue-router";

enum DeviceFieldRu {
  brand = "Бренд",
  model = "Модель",
  color = "Цвет",
  screen = "Экран",
  ram = "Оперативная память",
  rom = "Встроенная память",
  cores = "Количество ядер",
  wattage = "Мощность",
  weight = "Вес",
}

const route = useRoute();
const router = useRouter();
const currentImageIndex = ref<number>(0);
const product = ref<ProductAdapter | null>(null);

onMounted(async () => {
  try {
    const productUD = route.params.productId;
    const response = await api.get(`/product-projections/${productUD}`);
    product.value = productAdapter(response.data);
  } catch {
    router.push({ name: "notFoundPage" });
  }
});

function setCurrentIndexImage(index: number): void {
  currentImageIndex.value = index;
}

const currentImage = computed(() => {
  return product.value?.images?.[currentImageIndex.value] ?? "";
});

const breadcrumbsRoutes: breadCrumbType[] = [
  {
    routeName: "Main",
    breadcrumbName: "Главная",
  },
  {
    routeName: "Catalog",
    breadcrumbName: "каталог",
  },
  {
    routeName: "Catalog",
    breadcrumbName: "Карточка товара",
  },
];
</script>

<template>
  <div>
    <BaseSpinner v-if="!product" />
    <div v-else class="product-page">
      <BaseBreadcrumbs :breadcrumbs="breadcrumbsRoutes" />
      <div class="product-card-wrapper">
        <div class="image-block">
          <div class="image-wrapper">
            <transition name="fade" mode="out-in">
              <img
                v-if="currentImage"
                :key="currentImage"
                :src="currentImage"
                alt="product image"
              />
            </transition>
          </div>
          <div v-if="product.images.length > 0" class="toggle-wrapper">
            <span
              v-for="(image, index) in product.images"
              :key="index"
              class="toggle"
              :class="{ active: currentImageIndex === index }"
              @click="setCurrentIndexImage(index)"
            ></span>
          </div>
        </div>

        <div class="attributes-block">
          <h1 class="title">{{ product.title }}</h1>
          <h2 class="attributes-title">Характеристики</h2>
          <div class="attribute-wrapper">
            <div v-for="(value, key) in product.attributes" :key="key">
              <div class="attribute-item">
                <div class="attribute-name">
                  {{ (DeviceFieldRu[key] || key) + `:` }}
                </div>
                <div class="attribute-value">{{ value }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="price-block">
          <BaseButton />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (hover: hover) {
  .toggle:hover {
    background-color: var(--grey-dark);
    transform: background-color 0.4s;
  }
}
.product-card-wrapper {
  padding: 30px 8px;
}
.toggle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--grey-dark);
  box-shadow: inset 0 0 6px var(--grey-dark);
  transition: background-color 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.38, 0, 0.33, 1);
}

.toggle-wrapper {
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;
}
.image-wrapper {
  max-width: 411px;
  width: 100%;
  min-width: 267px;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.attributes-title {
  font-weight: 400;
  font-size: 32px;
  margin-top: 0;
}
.attribute-wrapper {
  font-weight: 300;
  font-size: 18px;
  color: var(--grey-dark);
  flex-shrink: 1;
}

.attribute-wrapper {
  display: flex;
  gap: 20px;
  flex-direction: column;
}
.attribute-item {
  display: flex;
  gap: 20px;
}
.product-page {
  padding-top: clamp(8px, 5vw, 30px);
}
.product-card-wrapper {
  display: flex;
  gap: clamp(8px, 5vw, 110px);
}

.active {
  transition: background-color 0.4s;
  background-color: var(--grey-dark);
}

h1.title {
  margin-top: 0;
}
</style>
