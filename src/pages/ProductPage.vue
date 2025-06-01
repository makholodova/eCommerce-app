<script lang="ts" setup>
import BaseBreadcrumbs from "@/components/ui/BaseBreadcrumbs.vue";
import type { breadCrumbType } from "@/types/user-login.types";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { productAdapter } from "@/adapters/product.adapter";
import { useTokenStore } from "@/store/useTokenStore";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";

const projectKey = import.meta.env.VITE_PROJECT_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const route = useRoute();

const productUD = route.params.productId;
const isLoading = ref(false);

const token = useTokenStore().token || useAnonymousTokenStore().token;

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await fetch(
      `${apiUrl}/${projectKey}/product-projections/${productUD}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw new Error("не получилось отобразить продукт");
    const data = await response.json();
    console.log(productAdapter(data));
  } catch {
    console.log("ошибка в отображении продукта");
  } finally {
    isLoading.value = false;
  }
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
  <div class="product-page">
    <BaseSpinner v-if="isLoading" />
    <BaseBreadcrumbs :breadcrumbs="breadcrumbsRoutes" />

    <div class="product-card-wrapper">
      <div class="image-block">
        <img src="" alt="" />
        <div class="toggle-wrapper">
          <span class="toggle"></span>
        </div>
      </div>

      <div class="attributes-block">
        <h2>Характеристики</h2>
        <div class="attribute">
          <div class="attribute-name"></div>
          <div class="attribute-value"></div>
        </div>
      </div>

      <div class="price-block">
        <BaseButton />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  padding-top: clamp(8px, 5vw, 30px);
}
.product-card-wrapper {
  display: flex;
  gap: 110px;
}
</style>
