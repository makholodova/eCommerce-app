import type { Cart } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";

export async function getMyCart(): Promise<Cart | null> {
  const response = await api.get("/me/carts");
  const carts = response.data.results;
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

export async function addProductToCard(
  cartID: string,
  version: number,
  productId: string,
): Promise<void> {
  try {
    await api.post(`me/carts/${cartID}`, {
      version: version,
      actions: [
        {
          action: "addLineItem",
          productId: productId,
          variantId: 1,
          quantity: 1,
        },
      ],
    });
  } catch (error) {
    console.log(error);
    throw new Error("не удалось добавить товар в корзину");
  }
}

export async function isProductInCart(productId: string): Promise<boolean> {
  const cart = await getMyCart();
  return cart
    ? !!cart.lineItems.find((li) => li.productId === productId)
    : false;
}
