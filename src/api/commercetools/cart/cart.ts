import type { Cart } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import type { CartUpdateAction } from "@commercetools/platform-sdk";

const anonymousId = useAnonymousTokenStore().anonymousId;

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
      anonymousId,
    });
    return newCart.data;
  } catch (error) {
    console.log(error);
    throw new Error("не удалось создать корзину");
  }
}

export async function addProductToCard(productId: string): Promise<void> {
  let cart: Cart | null;
  cart = await getActiveCart();
  if (cart === null) {
    cart = await createCart();
  }
  const cartID = cart.id;
  const version = cart.version;
  console.log("корзина" + JSON.stringify(cart));
  try {
    await api.post(`me/carts/${cartID}`, {
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

export async function removeProduct(
  lineItemID: string,
): Promise<CartUpdateAction | null> {
  try {
    const cart: Cart | null = await getActiveCart();
    if (cart) {
      const cartID = cart.id;
      const version = cart.version;
      const response = await api.post(`/me/carts/${cartID}`, {
        version: version,
        actions: [
          {
            action: "removeLineItem",
            lineItemId: lineItemID,
          },
        ],
      });
      return response.data;
    }
  } catch (error) {
    console.log("не удалось удалить продукт" + error);
    throw new Error("не удалось удалить продукт");
  }
  return null;
}
