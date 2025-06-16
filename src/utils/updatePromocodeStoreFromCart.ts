import type { Cart } from "@commercetools/platform-sdk";
import type { ExtendedLineItem } from "@/types/interfaces";
import { usePromocodeStore } from "@/store/usePromocodeStore";
import { checkProductInCategory } from "@/api/commercetools/cart/cart";
import { promocodeDictionary } from "@/types/interfaces";

const promocodeStore = usePromocodeStore();

export async function updatePromocodeStoreFromCart(
  cart: Cart,
  code?: string,
): Promise<void> {
  const total = cart.totalPrice.centAmount;

  const appliedCode = code ?? promocodeStore.code;
  if (!appliedCode) return;

  const promo = promocodeDictionary[appliedCode];
  if (!promo) return;

  const isGlobalDiscount = promo.appliesTo === "all";

  let discount: number | null = null;

  if (isGlobalDiscount) {
    discount = cart.discountOnTotalPrice?.discountedAmount.centAmount ?? null;
  } else {
    const lineItems: ExtendedLineItem[] = cart.lineItems;
    let totalCategoryDiscount = 0;

    for (const item of lineItems) {
      const isBelongsToCategory = await checkProductInCategory(item.productId);
      if (isBelongsToCategory) {
        const quantity = item.quantity ?? 1;
        const discounts = item.discountedPrice?.includedDiscounts ?? [];
        const sum = discounts.reduce(
          (acc, d) => acc + d.discountedAmount.centAmount * quantity,
          0,
        );
        totalCategoryDiscount += sum;
      }
    }

    discount = totalCategoryDiscount > 0 ? totalCategoryDiscount : null;
  }
  promocodeStore.applyPromocode(
    appliedCode,
    total,
    discount,
    discount ? promo.discountPercent : null,
    discount ? promo.description : null,
    promo.appliesTo,
  );
}
