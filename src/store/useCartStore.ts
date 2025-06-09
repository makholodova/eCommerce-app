import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ShoppingCartItem } from "@/types/interfaces";

export const useCartStore = defineStore(
  "shopping-cart",
  () => {
    const shoppingCart = ref<ShoppingCartItem[]>([]);

    const totalItems = computed(() =>
      shoppingCart.value.reduce((sum, item) => sum + item.quantity, 0),
    );

    function setShoppingCart(cartItem: ShoppingCartItem): void {
      const availableProduct = shoppingCart.value.find(
        (item) => item.productId === cartItem.productId,
      );

      if (availableProduct) {
        availableProduct.quantity += 1;
      } else {
        shoppingCart.value.push(cartItem);
      }
    }

    function getShoppingCart(): ShoppingCartItem[] {
      return shoppingCart.value;
    }

    function removeFromCart(productId: string): void {
      shoppingCart.value.filter((item) => item.productId !== productId);
    }

    return {
      shoppingCart,
      totalItems,
      setShoppingCart,
      getShoppingCart,
      removeFromCart,
    };
  },
  {
    persist: true,
  },
);
