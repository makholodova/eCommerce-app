import type { Cart } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";
import type { LineItem } from "@commercetools/platform-sdk";
import { useCartStore } from "@/store/useCartStore";
import { usePromocodeStore } from "@/store/usePromocodeStore";

const cartStore = useCartStore();
const promocodeStore = usePromocodeStore();

export async function getMyCart(): Promise<Cart | null> {
  const response = await api.get("/me/carts");
  const carts = response.data.results;
  if (carts) {
    const lineItems = response.data.results[0]?.lineItems || [];
    cartStore.setShoppingCart(lineItems);
  }
  return carts.length > 0 ? carts[0] : null;
}

export async function getActiveCart(): Promise<Cart | null> {
  try {
    const response = await api.get("/me/active-cart");
    if (response.status === 200) return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
}

export async function createCart(): Promise<Cart> {
  try {
    const newCart = await api.post("me/carts", {
      currency: "RUB",
    });
    return newCart.data;
  } catch (error) {
    console.log(error);
    throw new Error("не удалось создать корзину");
  }
}

export async function addProductToCard(productId: string): Promise<Cart> {
  let cart: Cart | null;
  cart = await getActiveCart();
  if (cart === null) {
    cart = await createCart();
  }
  const cartID = cart.id;
  const version = cart.version;
  try {
    const response = await api.post(`me/carts/${cartID}`, {
      version,
      actions: [
        {
          action: "addLineItem",
          productId: productId,
          variantId: 1,
          quantity: 1,
        },
      ],
    });
    cartStore.addToCart(response.data.lineItems[0]);

    if (promocodeStore.code) {
      promocodeStore.totalPrice = response.data.totalPrice.centAmount;
      promocodeStore.discountAmount =
        response.data.discountOnTotalPrice?.discountedAmount.centAmount ?? null;
    }

    return response.data.lineItems[0];
  } catch (error) {
    console.log(error);
    throw new Error("не удалось добавить товар в корзину");
  }
}

export async function isProductInCart(productId: string): Promise<boolean> {
  const cart = await getMyCart();
  return cart
    ? !!cart?.lineItems.find((li) => li.productId === productId)
    : false;
}

export async function removeProduct(lineItemID: string): Promise<Cart | null> {
  try {
    const cart: Cart | null = await getActiveCart();
    if (!cart) return null;

    const response = await api.post(`/me/carts/${cart.id}`, {
      version: cart.version,
      actions: [
        {
          action: "removeLineItem",
          lineItemId: lineItemID,
        },
      ],
    });

    const updatedCart: Cart = response.data;

    cartStore.setShoppingCart(updatedCart.lineItems);

    return updatedCart;
  } catch (error) {
    console.error("не удалось удалить продукт", error);
    throw new Error("не удалось удалить продукт");
  }
}

export async function changeItemQuantity(
  lineItemId: string,
  quantity: number,
): Promise<LineItem | undefined> {
  const cart = await getActiveCart();
  if (!cart) throw new Error("Нет активной корзины");

  const response = await api.post(`/me/carts/${cart.id}`, {
    version: cart.version,
    actions: [
      {
        action: "changeLineItemQuantity",
        lineItemId,
        quantity,
      },
    ],
  });

  const updatedItem = response.data.lineItems.find(
    (item: LineItem) => item.id === lineItemId,
  );

  cartStore.setShoppingCart(response.data.lineItems);

  return updatedItem;
}

export async function clearCard(): Promise<void> {
  const cart = await getActiveCart();
  if (!cart) throw new Error("Нет активной корзины");

  const cartID = cart.id;
  const version = cart.version;

  const actions = cart.lineItems.map((item) => ({
    action: "removeLineItem",
    lineItemId: item.id,
  }));

  if (actions.length === 0) return;
  try {
    await api.post(`/me/carts/${cartID}`, {
      version,
      actions,
    });
    cartStore.cleanCart();
  } catch (error) {
    console.error("Ошибка при очистке корзины", error);
    throw new Error("Ошибка при очистке корзины");
  }
}

export async function applyDiscountCode(code: string): Promise<Cart> {
  const cart = await getActiveCart();
  if (!cart) throw new Error("Нет активной корзины");
  try {
    const response = await api.post(`/me/carts/${cart.id}`, {
      version: cart.version,
      actions: [
        {
          action: "addDiscountCode",
          code: code,
        },
      ],
    });
    promocodeStore.applyPromocode(
      code,
      response.data.totalPrice.centAmount,
      response.data.discountOnTotalPrice?.discountedAmount.centAmount ?? 0,
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка применения промокода", error);
    throw new Error("Ошибка применения промокода");
  }
}
