<script setup lang="ts">
import IconMinus from "@/assets/icons/icon-minus.svg";
import IconPlus from "@/assets/icons/icon-plus.svg";
import IconDelete from "@/assets/icons/icon-delete.svg";

defineProps<{
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  discountedPrice?: number;
  totalPrice: number;
  totalPriceDiscounted?: number;
}>();

const emit = defineEmits<{
  (e: "increase"): void;
  (e: "decrease"): void;
  (e: "remove"): void;
}>();
</script>

<template>
  <li class="cart-item">
    <div class="cart-item__image-wrapper">
      <img class="cart-item__image" :src="image" alt="Изображение товара" />
    </div>

    <h3 class="cart-item__title">{{ title }}</h3>

    <div v-if="discountedPrice" class="card-price">
      <div class="cart-item__unit-price">
        {{ discountedPrice.toFixed(2) }} ₽
      </div>
      <div class="card-discounted-price">{{ unitPrice.toFixed(2) }} ₽</div>
    </div>
    <div v-else class="card-price">
      <div class="cart-item__unit-price">{{ unitPrice.toFixed(2) }} ₽</div>
    </div>

    <div class="cart-item__quantity-control">
      <button
        class="cart-item__quantity-button"
        type="button"
        :disabled="quantity <= 1"
        @click="emit('decrease')"
      >
        <IconMinus class="icon-button" />
      </button>
      <p class="cart-item__quantity">{{ quantity }}</p>
      <button
        class="cart-item__quantity-button"
        type="button"
        @click="emit('increase')"
      >
        <IconPlus class="icon-button" />
      </button>
    </div>

    <div v-if="totalPriceDiscounted" class="card-price cart-item__total-price">
      <div class="cart-item__total-price">
        {{ totalPriceDiscounted.toFixed(2) }} ₽
      </div>
      <div class="card-discounted-price">{{ totalPrice.toFixed(2) }} ₽</div>
    </div>
    <div v-else class="card-price cart-item__total-price">
      <div class="cart-item__total-price">{{ totalPrice.toFixed(2) }} ₽</div>
    </div>

    <button
      class="cart-item__quantity-button"
      type="button"
      @click="emit('remove')"
    >
      <IconDelete class="icon-button-remove" />
    </button>
  </li>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr 140px 120px 170px 48px;
  grid-template-areas: "image title  price quantity total delete";
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid var(--blue-light);
  padding: 24px 16px;
}

.cart-item__image-wrapper {
  grid-area: image;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cart-item__image {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.cart-item__title {
  grid-area: title;
  font-weight: 400;
  font-size: 18px;
  line-height: 150%;
  margin: 0;
}

.cart-item__unit-price,
.cart-item__total-price {
  margin: 0;
  text-align: center;
  font-weight: 500;
  font-size: 20px;
}

.cart-item__unit-price {
  grid-area: price;
}

.cart-item__total-price {
  grid-area: total;
}

.cart-item__quantity-control {
  grid-area: quantity;
  display: flex;
  max-height: 40px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--purple);
  border-radius: 4px;
}

.cart-item__quantity {
  font-weight: 400;
  font-size: 20px;
}
.cart-item__quantity-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: transparent;
  padding: 8px;
}

.icon-button {
  color: var(--purple);
  transition: color 0.2s ease;
}
.icon-button:hover {
  color: var(--purple-light);
}
.cart-item__quantity-button:disabled .icon-button {
  cursor: default;
  color: var(--grey-light);
}

.icon-button-remove {
  grid-area: delete;
  color: var(--grey-dark);
  transition: color 0.2s ease;
}
.icon-button-remove:hover {
  color: var(--grey-light);
}

.card-price {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2px;
}
.card-discounted-price {
  font-weight: 300;
  font-size: 14px;
  text-decoration: line-through;
  color: var(--grey);
  text-align: center;
}

@media (max-width: 880px) {
  .cart-item {
    grid-template-columns: 80px 1fr auto;
    grid-template-areas:
      "image title title "
      "image price  price "
      "image  quantity delete"
      "image total delete ";
    align-items: start;
    justify-items: start;
    row-gap: 15px;
    column-gap: 25px;
  }
  .card-price {
    align-items: start;
  }
}
</style>
