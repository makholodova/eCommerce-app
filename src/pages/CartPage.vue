<script setup lang="ts">
import CartProductItem from "@/components/cart/CartProductItem.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { ref } from "vue";
import { getMyCart } from "@/api/commercetools/cart/cart";
import { onMounted } from "vue";

interface MockLineItem {
  id: string;
  name: { ru: string };
  quantity: number;
  price: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
  };
  variant: {
    images: {
      url: string;
    }[];
  };
}
const items = ref<MockLineItem[]>();

onMounted(async () => {
  try {
    const cart = await getMyCart();
    if (cart) {
      items.value = items.value = cart.lineItems.map((lineItem) => ({
        id: lineItem.id,
        name: {
          ru: lineItem.name["ru"] ?? "Без названия",
        },
        quantity: lineItem.quantity,
        price: {
          value: {
            centAmount: lineItem.price.value.centAmount,
            currencyCode: lineItem.price.value.currencyCode,
          },
        },
        variant: {
          images: lineItem.variant.images || [],
        },
      }));
    }
  } catch (error) {
    console.error("Ошибка загрузки корзины", error);
  }
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
  <div class="cart-wrapper">
    <div v-if="items?.length" class="cart">
      <h1 class="cart-title">Корзина</h1>
      <ul>
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
    </div>
    <div v-else class="cart-empty">
      <h2 class="cart-empty__title">Ваша корзина пуста</h2>
      <img
        src="@/assets/images/basket-is-empty.png"
        alt="basket is empty"
        class="cart-empty--img"
      />
      <p class="cart-empty__text">Добавьте товары из каталога</p>
      <router-link :to="{ name: 'Catalog' }">
        <BaseButton
          text="Перейти в каталог"
          size="xl"
          class="cart-empty__button"
        >
        </BaseButton>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.cart-wrapper {
  padding: 24px;
}
.cart-title {
  font-weight: 400;
  font-size: 28px;
  margin: 0;
}
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
