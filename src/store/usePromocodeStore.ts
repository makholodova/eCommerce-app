// stores/usePromocodeStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePromocodeStore = defineStore(
  "promocode",
  () => {
    const code = ref<string | null>(null);
    const discountAmount = ref<number | null>(null);
    const totalPrice = ref<number | null>(null);
    const discountPercent = ref<number | null>(null);
    const descriptionPromocode = ref<string | null>(null);
    const appliesTo = ref<"all" | "category" | null>(null);

    function applyPromocode(
      newCode: string,
      total: number,
      discount: number | null,
      percent: number | null,
      description: string | null,
      appliesToType: "all" | "category" | null,
    ): void {
      code.value = newCode;
      totalPrice.value = total;
      discountAmount.value = discount;
      discountPercent.value = percent;
      descriptionPromocode.value = description;
      appliesTo.value = appliesToType;
    }

    function clearPromocode(): void {
      code.value = null;
      totalPrice.value = null;
      discountAmount.value = null;
      discountPercent.value = null;
      descriptionPromocode.value = null;
      appliesTo.value = null;
    }

    return {
      code,
      discountAmount,
      totalPrice,
      discountPercent,
      descriptionPromocode,
      appliesTo,
      applyPromocode,
      clearPromocode,
    };
  },
  {
    persist: true,
  },
);
