import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LineItem } from "@commercetools/platform-sdk";

export const useCartStore = defineStore(
  "shopping-cart",
  () => {
    const shoppingCart = ref<LineItem[]>([]);

    const totalItems = computed(() =>
      shoppingCart.value.reduce((sum, item) => sum + item.quantity, 0),
    );

    function setShoppingCart(lineItems: LineItem[]): LineItem[] {
      return (shoppingCart.value = lineItems);
    }

    function getShoppingCart(): LineItem[] {
      return shoppingCart.value;
    }

    function removeFromCart(lineItemID: string): void {
      shoppingCart.value = shoppingCart.value.filter(
        (item) => item.id !== lineItemID,
      );
    }

    function cleanCart(): void {
      shoppingCart.value = [];
    }

    return {
      shoppingCart,
      totalItems,
      setShoppingCart,
      getShoppingCart,
      removeFromCart,
      cleanCart,
    };
  },
  {
    persist: true,
  },
);
