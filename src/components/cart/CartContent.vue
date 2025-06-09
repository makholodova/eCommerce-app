<script setup lang="ts">
import laptopImg from "@/assets/images/laptop.png";
import smartphoneImg from "@/assets/images/smartphone.png";
import CartProductItem from "@/components/cart/CartProductItem.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { onMounted } from "vue";
import { getMyCart } from "@/api/commercetools/cart/cart.ts";

//временное решение
const items = [
  {
    id: "1",
    name: { ru: "Смартфон Apple iPhone 12 64GB" },
    quantity: 1250,
    price: {
      value: {
        centAmount: 599999,
        currencyCode: "RUB",
      },
    },
    variant: {
      images: [{ url: laptopImg }],
    },
  },
  {
    id: "2",
    name: { ru: "Смартфон Apple iPhone 14 128GB" },
    quantity: 1,
    price: {
      value: {
        centAmount: 5999,
        currencyCode: "RUB",
      },
    },
    variant: {
      images: [{ url: smartphoneImg }],
    },
  },
];

//временное решение
onMounted(async () => {
  const cart = await getMyCart();
  console.log(cart.results);
});

function increaseQuantity(): void {
  console.log("Увеличиваем количество товара");
}

function decreaseQuantity(): void {
  console.log("Уменьшаем количество товара");
}

function removeItemFromCart(): void {
  console.log("Удалить товар из корзины ");
}
</script>

<template>
  <ul v-if="items.length">
    <CartProductItem
      v-for="item in items"
      :key="item.id"
      :title="item.name['ru']"
      :image="item.variant.images?.[0]?.url || ''"
      :unit-price="item.price.value.centAmount"
      :quantity="item.quantity"
      :total-price="item.price.value.centAmount * item.quantity"
      @increase="increaseQuantity"
      @decrease="decreaseQuantity"
      @remove="removeItemFromCart"
    />
  </ul>
  <div v-else class="cart-empty">
    <h2 class="cart-empty__title">Ваша корзина пуста</h2>
    <img
      src="@/assets/images/basket-is-empty.png"
      alt="basket is empty"
      class="cart-empty--img"
    />
    <p class="cart-empty__text">Добавьте товары из каталога</p>
    <router-link :to="{ name: 'Catalog' }">
      <BaseButton text="Перейти в каталог" size="xl" class="cart-empty__button">
      </BaseButton>
    </router-link>
  </div>
</template>
<style scoped>
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.cart-empty__title {
  font-size: 22px;
  font-weight: 500;
  color: var(--black);
}
.cart-empty--img {
  display: block;
  margin: 0 auto;
  max-width: 300px;
}
.cart-empty__text {
  font-size: 18px;
  font-weight: 400;
  color: var(--grey-dark);
}

.cart-empty__button {
  margin: 0 auto;
  margin-top: 20px;
  display: block;
}
</style>
