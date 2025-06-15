import type { Cart, CategoryReference } from "@commercetools/platform-sdk";
import api from "@/api/commercetools/axiosInstance.ts";
import { useCartStore } from "@/store/useCartStore";
import { usePromocodeStore } from "@/store/usePromocodeStore";
import { updatePromocodeStoreFromCart } from "@/utils/updatePromocodeStoreFromCart";
import { LAPTOP_CATEGORY_KEY } from "@/utils/constants";

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
    console.error(error);
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
    console.error(error);
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
      updatePromocodeStoreFromCart(response.data);
    }

    return response.data;
  } catch (error) {
    console.error(error);
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
      return response.data;
    }
  } catch (error) {
    console.error("не удалось удалить продукт", error);
    throw new Error("не удалось удалить продукт");
  }
}

export async function changeItemQuantity(
  lineItemId: string,
  quantity: number,
): Promise<Cart> {
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

  cartStore.setShoppingCart(response.data.lineItems);

  return response.data;
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
    const cartData: Cart = response.data;
    updatePromocodeStoreFromCart(cartData, code);
    return cartData;
  } catch {
    throw new Error("Ошибка применения промокода");
  }
}

export async function checkProductInCategory(
  productId: string,
): Promise<boolean> {
  try {
    const response = await api.get(
      `/product-projections/${productId}?expand=categories[*]`,
    );
    const product = response.data;

    if (!Array.isArray(product.categories)) return false;

    return product.categories.some(
      (cat: CategoryReference) => cat.obj?.key === LAPTOP_CATEGORY_KEY,
    );
  } catch (error) {
    console.error(
      "Ошибка при проверке категории у продукта:",
      productId,
      error,
    );
    return false;
  }
}
