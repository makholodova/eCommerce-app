import { createCustomerApiRoot } from "./createCustomer";
import type { UserLoginData } from "@/types/user-login.types";
import type { CustomerSignInResult } from "@commercetools/platform-sdk";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";
import type { MyCustomerSignin } from "@commercetools/platform-sdk";

type ExtendedCustomerSignin = MyCustomerSignin & {
  anonymousId?: string;
  anonymousCartSignInMode?:
    | "MergeWithExistingCustomerCart"
    | "UseAsNewActiveCustomerCart";
};

const anonymousId = useAnonymousTokenStore().anonymousId;

export async function login(
  loginData: UserLoginData,
): Promise<CustomerSignInResult> {
  const apiRoot = createCustomerApiRoot(loginData.email, loginData.password);
  try {
    const extendedBody: ExtendedCustomerSignin = {
      ...loginData,
      anonymousId,
      anonymousCartSignInMode: "MergeWithExistingCustomerCart",
    };
    const response = await apiRoot
      .me()
      .login()
      .post({
        body: extendedBody,
      })
      .execute();

    const mergedCart = await apiRoot.me().activeCart().get().execute();
    console.log("После логина — корзина:", mergedCart.body);

    const anonymousTokenStore = useAnonymousTokenStore();
    if (anonymousTokenStore.token) anonymousTokenStore.reset();

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ошибка при входе");
    }
  }
}
