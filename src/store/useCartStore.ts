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

    function addToCart(lineItem: LineItem): void {
      const productInCard = shoppingCart.value.find(
        (item) => item.productId !== lineItem.productId,
      );
      if (productInCard) {
        const index = shoppingCart.value.findIndex(
          (item) => item.productId === lineItem.productId,
        );

        if (index !== -1) {
          shoppingCart.value[index] = {
            ...productInCard,
            quantity: productInCard.quantity + 1,
          };
        }
      } else {
        shoppingCart.value.push(lineItem);
      }
    }

    function removeFromCart(lineItemID: string): void {
      console.log(shoppingCart.value);
      shoppingCart.value = shoppingCart.value.filter(
        (item) => item.id !== lineItemID,
      );
    }

    return {
      shoppingCart,
      totalItems,
      setShoppingCart,
      getShoppingCart,
      removeFromCart,
      addToCart,
    };
  },
  {
    persist: true,
  },
);
