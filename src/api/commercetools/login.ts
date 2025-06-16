import { createCustomerApiRoot } from "./createCustomer";
import type { UserLoginData } from "@/types/user-login.types";
import type { CustomerSignInResult } from "@commercetools/platform-sdk";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import { getMyCart } from "./cart/cart";
import { usePromocodeStore } from "@/store/usePromocodeStore";
import { getActiveCart } from "./cart/cart";
import { updatePromocodeStoreFromCart } from "@/utils/updatePromocodeStoreFromCart";

const promocodeStore = usePromocodeStore();

export async function login(
  loginData: UserLoginData,
): Promise<CustomerSignInResult> {
  const {
    anonymousId,
    token: anonymousToken,
    reset,
  } = useAnonymousTokenStore();
  const body = {
    email: loginData.email,
    password: loginData.password,
    ...(anonymousId && {
      anonymousId,
      anonymousCartSignInMode: "MergeWithExistingCustomerCart",
    }),
  };

  try {
    const response = await fetch(
      "https://api.europe-west1.gcp.commercetools.com/ecommerce-app-team/me/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonymousToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Ошибка при входе");
    }

    const result: CustomerSignInResult = await response.json();

    reset();

    const apiRoot = createCustomerApiRoot(loginData.email, loginData.password);
    await apiRoot.me().get().execute();
    await getMyCart();

    if (promocodeStore.code) {
      const cart = await getActiveCart();
      if (cart) {
        await updatePromocodeStoreFromCart(cart, promocodeStore.code);
      }
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ошибка при входе");
    }
  }
}
