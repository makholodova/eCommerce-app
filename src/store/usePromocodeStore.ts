// stores/usePromocodeStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePromocodeStore = defineStore(
  "promocode",
  () => {
    const code = ref<string | null>(null);
    const discountAmount = ref<number | null>(null);
    const totalPrice = ref<number | null>(null);

    const discountPercent = computed(() => {
      if (discountAmount.value !== null && totalPrice.value !== null) {
        return Math.round(
          (discountAmount.value / (totalPrice.value + discountAmount.value)) *
            100,
        );
      }
      return null;
    });

    function applyPromocode(
      newCode: string,
      total: number,
      discount: number,
    ): void {
      code.value = newCode;
      totalPrice.value = total;
      discountAmount.value = discount;
    }

    function clearPromocode(): void {
      code.value = null;
      totalPrice.value = null;
      discountAmount.value = null;
    }

    return {
      code,
      discountAmount,
      totalPrice,
      discountPercent,
      applyPromocode,
      clearPromocode,
    };
  },
  {
    persist: true,
  },
);
