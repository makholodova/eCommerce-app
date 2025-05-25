<script lang="ts" setup>
import BaseButton from "@/components/ui/BaseButton.vue";
import router from "@/router";
const props = defineProps<{
  id: string;
  title: string;
  image?: string;
  price: string;
  description?: string;
  discountedPrice?: string;
  discountedPercentage?: string;
}>();

const isDiscounted = !!props.discountedPrice;

function redirectToProductPage(): void {
  router.push({
    name: "Product",
    params: { productId: props.id },
  });
}
function addToCart(): void {
  console.log("cart");
}
</script>

<template>
  <div class="card" @click="redirectToProductPage">
    <div class="card-img-wrapper">
      <img :src="image" alt="card-image" class="card-img" />
      <div v-if="isDiscounted" class="card-img-discounted-icon">
        -{{ discountedPercentage }}%
      </div>
    </div>
    <div class="card-information">
      <div class="card-title">{{ title }}</div>
      <p class="card-description">
        {{ description }}
      </p>
      <div class="card-price">
        <div class="card-current-price">{{ price }} ₽</div>
        <div v-if="isDiscounted" class="card-discounted-price">
          {{ discountedPrice }} ₽
        </div>
      </div>
      <base-button
        size="sm"
        class="card-btn"
        text="В корзину"
        @click.prevent.stop="addToCart"
      ></base-button>
    </div>
  </div>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .card {
    transform: scale(1);
    transition:
      transform 0.3s ease-in,
      box-shadow 0.3s ease-in;
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
  border-radius: 8px;
  max-width: 217px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  transition: transform 0.4s ease-in;
  cursor: pointer;
  font-family: Roboto;
  font-size: 20px;
}
.card-information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
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
  max-width: 169px;
  min-width: 101px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.card-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.card-title {
  font-weight: 400;
  line-height: 32px;
}
.card-description {
  font-weight: 300;
  font-size: 14px;
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
  }
  .card-img-wrapper {
    align-self: flex-start;
    flex-shrink: 1;
    max-width: 101px;
    width: 100%;
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
}
</style>
