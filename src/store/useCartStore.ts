import { defineStore } from "pinia";
import { ref } from "vue";
import type { ShoppingCartItem } from "@/types/interfaces";

export const useCartStore = defineStore(
  "shopping-cart",
  () => {
    const shoppingCart = ref<ShoppingCartItem[]>([]);

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
      setShoppingCart,
      getShoppingCart,
      removeFromCart,
    };
  },
  {
    persist: true,
  },
);
