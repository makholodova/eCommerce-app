<script setup lang="ts">
import CartProductItem from "@/components/cart/CartProductItem.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { ref, computed } from "vue";
import { getMyCart } from "@/api/commercetools/cart/cart";
import { onMounted } from "vue";
import {
  removeProduct,
  changeItemQuantity,
} from "@/api/commercetools/cart/cart";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";

interface MockLineItem {
  id: string;
  name: { ru: string };
  quantity: number;
  price: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
    discountedPrice?: number;
  };
  totalPrice: number;
  variant: {
    images: {
      url: string;
    }[];
  };
}
const items = ref<MockLineItem[]>([]);
const isLoaded = ref(false);

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
          discountedPrice:
            lineItem.price.discounted?.value.centAmount ?? undefined,
        },
        totalPrice: lineItem.price.value.centAmount * lineItem.quantity,
        variant: {
          images: lineItem.variant.images || [],
        },
      }));
    }
  } catch (error) {
    console.error("Ошибка загрузки корзины", error);
  } finally {
    isLoaded.value = true;
  }
});

async function updateLocalQuantity(
  lineItemId: string,
  newQuantity: number,
): Promise<void> {
  const updatedItem = await changeItemQuantity(lineItemId, newQuantity);
  const item = items.value?.find((item) => item.id === lineItemId);
  if (item && typeof updatedItem?.quantity === "number") {
    item.quantity = updatedItem.quantity;
  }
}

async function increaseQuantity(
  lineItemId: string,
  quantity: number,
): Promise<void> {
  try {
    await updateLocalQuantity(lineItemId, quantity + 1);
  } catch (error) {
    console.error("Ошибка при увеличении товара в корзине", error);
  }
}

async function decreaseQuantity(
  lineItemId: string,
  quantity: number,
): Promise<void> {
  try {
    if (quantity > 1) {
      await updateLocalQuantity(lineItemId, quantity - 1);
    }
  } catch (error) {
    console.error("Ошибка при увеличении товара в корзине", error);
  }
}

async function removeItemFromCart(lineItemId: string): Promise<void> {
  try {
    const result = await removeProduct(lineItemId);
    items.value = items.value?.filter((item) => item.id !== lineItemId);
    console.log(result);
  } catch (error) {
    console.error("Ошибка при удалении товара из корзины", error);
  }
}

const totalWithDiscount = computed(() => {
  return items.value.reduce((sum, item) => {
    const price = item.price.discountedPrice ?? item.price.value.centAmount;
    return sum + price * item.quantity;
  }, 0);
});

const totalWithoutDiscount = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + item.price.value.centAmount * item.quantity;
  }, 0);
});
</script>

<template>
  <div class="cart-wrapper">
    <BaseSpinner v-if="!isLoaded" />
    <div v-else-if="items.length" class="cart">
      <h1 class="cart-title subtitle">Корзина</h1>
      <div class="cart-footer">
        <BaseButton text="Очистить корзину" size="sm"> </BaseButton>
        <div
          v-if="totalWithDiscount !== totalWithoutDiscount"
          class="card-total"
        >
          Итого: {{ totalWithDiscount.toFixed(2) }} ₽
          <span class="card-total-discounted-price">
            {{ totalWithoutDiscount.toFixed(2) }} ₽
          </span>
        </div>
        <div v-else class="card-total">
          Итого: {{ totalWithDiscount.toFixed(2) }} ₽
        </div>
      </div>
      <ul>
        <CartProductItem
          v-for="item in items"
          :key="item.id"
          :title="item.name['ru']"
          :image="item.variant.images?.[0]?.url || ''"
          :unit-price="item.price.value.centAmount"
          :quantity="item.quantity"
          :discounted-price="item.price.discountedPrice"
          :total-price="item.price.value.centAmount * item.quantity"
          :total-price-discounted="
            item.price.discountedPrice
              ? item.price.discountedPrice * item.quantity
              : undefined
          "
          @increase="increaseQuantity(item.id, item.quantity)"
          @decrease="decreaseQuantity(item.id, item.quantity)"
          @remove="removeItemFromCart(item.id)"
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

.card-total {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
}
.card-total-discounted-price {
  font-weight: 300;
  font-size: 18px;
  text-decoration: line-through;
  color: var(--grey);
  align-self: flex-end;
  text-align: center;
}

.cart-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 680px) {
  ul {
    padding: 0;
  }
  .cart-footer {
    padding: 0;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
  }
}
</style>
