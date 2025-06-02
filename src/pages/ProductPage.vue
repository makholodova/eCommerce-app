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
const category = computed(() => {
  return window.history.state?.category || "";
});
const productID = route.params.productId;

onMounted(async () => {
  try {
    const response = await api.get(`/product-projections/${productID}`);
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

const isDiscounted = computed(() => !!product.value?.discountedPrice);

const breadcrumbsRoutes: breadCrumbType[] = [
  {
    routeName: "Main",
    breadcrumbName: "Главная",
  },
  {
    routeName: "Catalog",
    breadcrumbName: "каталог",
  },
];

if (category.value) {
  breadcrumbsRoutes.push({
    routeName: "CatalogCategory",
    breadcrumbName: category.value,
    params: {
      category: category.value,
    },
  });
}

breadcrumbsRoutes.push({
  routeName: "Product",
  breadcrumbName: "Карточка товара",
  params: {
    productID: productID[0],
  },
});
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
            <div v-if="isDiscounted" class="card-img-discounted-icon">
              -{{ product.discountedPercentage }}%
            </div>
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
          <div v-if="isDiscounted" class="card-price">
            <div class="card-current-price">{{ product.price }} ₽</div>
            <div class="card-discounted-price">
              {{ product.discountedPrice }} ₽
            </div>
          </div>
          <div v-else class="card-price">
            <div class="card-current-price">{{ product.price }} ₽</div>
          </div>
          <base-button class="cart-btn" text="В корзину"></base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
@media (hover: hover) {
  .toggle:hover {
    background-color: var(--grey-dark);
    transform: background-color 0.4s;
  }
}
.price-block {
  width: 267px;
  padding: 40px;
  background-color: var(--grey-lighter);
  display: flex;
  gap: 28px;
  height: 185px;
  flex-direction: column;
  border-radius: 8px;
}
.card-img-discounted-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 65px;
  height: 45px;
  background-color: #ebba1a;
  font-weight: 400;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.cart-btn {
  padding: 15px 60px;
}
.card-current-price {
  font-weight: 500;
  text-align: left;
  font-size: 24px;
}
.card-discounted-price {
  font-weight: 300;
  font-size: 14px;
  text-decoration: line-through;
  color: var(--grey);
  align-self: flex-end;
  text-align: center;
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
  min-width: 267px;
  /* aspect-ratio: 4 / 3; */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 308px;
  background-color: white;
  position: relative;
  flex: 0 0 auto;
  border-radius: 8px;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}
.attributes-title {
  font-weight: 400;
  font-size: clamp(16px, 1vw, 32px);
  margin-top: 0;
}
.attributes-block {
  flex: 1 1 0;
  min-width: 300px;
  max-width: 360px;
}

.attribute-wrapper {
  display: flex;
  gap: 20px;
  flex-direction: column;
  font-weight: 300;
  font-size: clamp(14px, 3vw, 18px);
  color: var(--grey-dark);
  margin-top: 32px;
  max-width: 354px;
}
.attribute-item {
  display: flex;
  gap: 20px;
}
.product-page {
  padding-top: clamp(8px, 3vw, 30px);
}
.product-card-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.active {
  transition: background-color 0.4s;
  background-color: var(--grey-dark);
}
@media screen and (max-width: 350px) {
  .product-card-wrapper {
    flex-direction: column;
    align-items: center;
  }
  .price-block {
    padding: 0;
    background-color: transparent;
    flex-direction: row;
    justify-content: space-between;
    flex-grow: 1;
    width: 100%;
    height: auto;
    flex-wrap: wrap;
  }
  .card-current-price {
    font-size: 20px;
  }
  .card-price {
    flex-grow: 1;
  }
}
</style>
