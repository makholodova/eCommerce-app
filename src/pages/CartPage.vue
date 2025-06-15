<script setup lang="ts">
import type { Cart } from "@commercetools/platform-sdk";
import CartProductItem from "@/components/cart/CartProductItem.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { ref, computed } from "vue";
import { getMyCart } from "@/api/commercetools/cart/cart";
import { onMounted } from "vue";
import {
  removeProduct,
  changeItemQuantity,
  clearCard,
  applyDiscountCode,
  getActiveCart,
} from "@/api/commercetools/cart/cart";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import { useModal } from "@/composables/useModal";
import CartPromocode from "@/components/cart/CartPromocode.vue";
import { usePromocodeStore } from "@/store/usePromocodeStore";
import { showError } from "@/utils/toast.ts";

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
const isClearCardConfirmation = ref(false);
const { modalState, openModal, closeModal } = useModal();
const promocodeStore = usePromocodeStore();

function mapCartLineItems(lineItems: Cart["lineItems"]): MockLineItem[] {
  return lineItems.map((lineItem) => ({
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
      discountedPrice: lineItem.price.discounted?.value.centAmount ?? undefined,
    },
    totalPrice: lineItem.price.value.centAmount * lineItem.quantity,
    variant: {
      images: lineItem.variant.images || [],
    },
  }));
}

function updatePromocodeStoreFromCart(cart: Cart): void {
  promocodeStore.totalPrice = cart.totalPrice.centAmount;
  promocodeStore.discountAmount =
    cart.discountOnTotalPrice?.discountedAmount.centAmount ?? null;
}

onMounted(async () => {
  try {
    const cart = await getMyCart();
    if (cart) {
      items.value = mapCartLineItems(cart.lineItems);
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
  const updatedCart = await getActiveCart();
  if (updatedCart) {
    updatePromocodeStoreFromCart(updatedCart);
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
    const updatedCart = await removeProduct(lineItemId);
    if (updatedCart) {
      items.value = mapCartLineItems(updatedCart.lineItems);
      updatePromocodeStoreFromCart(updatedCart);
    }
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

function handleClearCartConfirmation(): void {
  openModal("clearCart");
  isClearCardConfirmation.value = true;
}

async function handleClearCart(): Promise<void> {
  isClearCardConfirmation.value = false;
  try {
    await clearCard();
    items.value = [];
    closeModal();
  } catch (error) {
    console.error("Ошибка при очистке корзины", error);
  }
}

async function handleApplyPromocode(code: string): Promise<void> {
  console.log("Пытаемся применить промокод:", code);

  try {
    const result = await applyDiscountCode(code);
    console.log("Промокод успешно применён. Обновлённая корзина:", result);
  } catch (error) {
    if (error instanceof Error) {
      const message = "Промокод не действителен";
      showError(message);
    } else {
      showError("Произошла неизвестная ошибка. Попробуйте позже.");
    }
  }
}
</script>

<template>
  <div class="cart-wrapper">
    <BaseSpinner v-if="!isLoaded" />
    <div v-else-if="items.length" class="cart">
      <h1 class="cart-title subtitle">Корзина</h1>
      <CartPromocode @apply="handleApplyPromocode" />
      <div class="cart-price">
        <BaseButton
          text="Очистить корзину"
          size="sm"
          class="cart-price-btn"
          @click="handleClearCartConfirmation"
        />
        <div
          v-if="promocodeStore.totalPrice && promocodeStore.discountAmount"
          class="card-total"
        >
          Итого по промокоду со скидкой {{ promocodeStore.discountPercent }}% :
          {{ promocodeStore.totalPrice.toFixed(2) }} ₽
          <span
            v-if="totalWithDiscount !== totalWithoutDiscount"
            class="card-total-discounted-price"
          >
            {{ totalWithDiscount.toFixed(2) }} ₽
          </span>
          <span v-else class="card-total-discounted-price">
            {{ totalWithoutDiscount.toFixed(2) }} ₽
          </span>
        </div>

        <div v-else class="card-total">
          <span v-if="totalWithDiscount !== totalWithoutDiscount">
            Итого: {{ totalWithDiscount.toFixed(2) }} ₽
          </span>
          <span v-else> Итого: {{ totalWithoutDiscount.toFixed(2) }} ₽ </span>
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
      <BaseModal
        v-if="isClearCardConfirmation && modalState === 'clearCart'"
        title="Подтверждение"
        :is-open="true"
        :close-btn-needed="true"
        @close="closeModal"
      >
        <div class="modal-confirm">
          <p>Вы уверены, что хотите очистить корзину?</p>
          <BaseButton text="Подтвердить" size="sm" @click="handleClearCart" />
        </div>
      </BaseModal>
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
        />
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
  font-size: clamp(20px, 5vw, 22px);
  font-weight: 500;
  margin-right: 40px;
}

.card-total-discounted-price {
  font-weight: 300;
  font-size: clamp(16px, 5vw, 18px);
  text-decoration: line-through;
  color: red;
  align-self: flex-end;
  text-align: center;
}

.cart-price {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-cross {
  border: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
}
.icon-cross {
  width: 36px;
  height: 36px;
}
.modal-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

@media (max-width: 980px) {
  .cart-price {
    padding: 0;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
  }
}

@media (max-width: 680px) {
  ul {
    padding: 0;
  }
  .cart-price-btn {
    width: 126px;
    font-size: 12px;
    height: 36px;
  }
}
</style>
