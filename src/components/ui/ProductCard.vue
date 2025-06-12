<script lang="ts" setup>
import BaseButton from "@/components/ui/BaseButton.vue";
import router from "@/router";
import { computed, ref } from "vue";
import {
  addProductToCard,
  isProductInCart,
} from "@/api/commercetools/cart/cart.ts";
import BaseSpinner from "./BaseSpinner.vue";

const props = defineProps<{
  id: string;
  title: string;
  image?: string;
  description?: string;
  price?: number;
  category?: string;
  discountedPrice?: number;
  discountedPercentage?: number;
}>();

const isDiscounted = computed(() => !!props.discountedPrice);
const isLoading = ref<boolean>(false);
const btnText = ref<string>("В корзину");
const isDisabled = ref<boolean>(false);

async function setBtnText(): Promise<void> {
  try {
    const result = await isProductInCart(props.id);
    if (result === true) {
      btnText.value = "Товар в корзине";
      isDisabled.value = true;
    } else {
      btnText.value = "В корзину";
      isDisabled.value = false;
    }
  } catch (error) {
    console.log("ошибка определения, в корзине ли товар" + error);
  }
}

setBtnText();
function redirectToProductPage(): void {
  router.push({
    name: "Product",
    params: { productId: props.id },
    state: { category: props.category || "" },
  });
}

async function addToCart(): Promise<void> {
  isLoading.value = true;
  try {
    await addProductToCard(props.id);
    btnText.value = "Товар в корзине";
    isDisabled.value = true;
  } catch (error) {
    console.log("не удалось добавить товар в корзину" + error);
  }
  isLoading.value = false;
}
</script>

<template>
  <div class="card" @click="redirectToProductPage">
    <BaseSpinner v-if="isLoading" class="spinner" />
    <div class="card-img-wrapper">
      <img :src="image" alt="card-image" class="card-img" loading="lazy" />
      <img :src="image" alt="card-image" class="card-img" loading="lazy" />
      <div v-if="isDiscounted" class="card-img-discounted-icon">
        -{{ discountedPercentage }}%
      </div>
    </div>
    <div class="card-information">
      <div class="card-title">{{ title }}</div>
      <p class="card-description">
        {{ description }}
      </p>
      <div v-if="isDiscounted" class="card-price">
        <div class="card-current-price">{{ discountedPrice }} ₽</div>
        <div class="card-discounted-price">{{ price }} ₽</div>
      </div>
      <div v-else class="card-price">
        <div class="card-current-price">{{ price }} ₽</div>
      </div>
    </div>
    <base-button
      size="sm"
      class="card-btn"
      :text="btnText"
      :disabled="isDisabled"
      @click.prevent.stop="addToCart"
    ></base-button>
  </div>
</template>

<style scoped>
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
@media (hover: hover) and (pointer: fine) {
  .card {
    transform: scale(1);
    transition: all 0.3s ease-in;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0);
  }
  .card:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
  }
}
.a:hover,
a {
  text-decoration: none;
  color: black;
}
.card {
  position: relative;
  z-index: 100;
  border-radius: 8px;
  width: 217px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  transition: transform 0.4s ease-in;
  cursor: pointer;
  font-size: 20px;
}
.card-information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex: 1 0 auto;
  flex: 1 0 auto;
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
.card-img-wrapper {
  width: 169px;
  height: 216px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex: 0 0 216px;
  flex: 0 0 216px;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.card-title {
  font-weight: 400;
  line-height: 32px;
}
.card-description {
  font-weight: 300;
  font-size: 18px;
  margin: 0;
  color: var(--grey-dark);
}
.card-price {
  display: flex;
  width: 100%;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
}
.card-current-price {
  font-weight: 500;
  text-align: left;
}
.card-discounted-price {
  font-weight: 300;
  font-size: 14px;
  text-decoration: line-through;
  color: var(--grey);
  align-self: flex-end;
  text-align: center;
}
@media (max-width: 495px) {
  .card {
    max-width: 375px;
    width: 100%;
    flex-direction: row;
    padding: 24px 16px;
    flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .card-img-wrapper {
    align-self: flex-start;
    /* flex-shrink: 1; */
    width: 101px;
    height: 139px;
    /* flex-shrink: 1; */
    width: 101px;
    height: 139px;
  }
  .card-information {
    flex: 1;
    align-items: flex-start;
    max-width: calc(100% - 100px);
    gap: 12px;
  }

  .card-title,
  .card-description,
  .card-price {
    width: 100%;
  }

  .card-description {
    width: 100%;
    max-width: 100%;
    text-align: left;
    white-space: normal;
    word-break: break-word;
  }

  .card-btn {
    width: 100%;
    align-self: center;
  }

  .card-img-discounted-icon {
    width: 48px;
    height: 33px;
  }
}
</style>
