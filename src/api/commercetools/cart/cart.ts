import type { Cart } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";
import type { CartUpdateAction, LineItem } from "@commercetools/platform-sdk";
import { useCartStore } from "@/store/useCartStore";

const cartStore = useCartStore();

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

export async function addProductToCard(productId: string): Promise<void> {
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
    console.log("элемент добавлен" + cartStore.totalItems);
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
      cartStore.removeFromCart(lineItemID);
      console.log("элемент удален" + cartStore.totalItems);
      return response.data;
    }
  } catch (error) {
    console.log("не удалось удалить продукт" + error);
    throw new Error("не удалось удалить продукт");
  }
  return null;
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

  console.log("response ", response.data.lineItems);
  cartStore.setShoppingCart(response.data.lineItems);

  return updatedItem;
}
