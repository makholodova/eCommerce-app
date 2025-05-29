import { createCustomerApiRoot } from "./createCustomer";
import type { UserLoginData } from "@/types/user-login.types";
import type { CustomerSignInResult } from "@commercetools/platform-sdk";
import { useAnonymousTokenStore } from "@/store/useAnonymousTokenStore";

export async function login(
  loginData: UserLoginData,
): Promise<CustomerSignInResult> {
  const apiRoot = createCustomerApiRoot(loginData.email, loginData.password);
  try {
    const response = await apiRoot
      .me()
      .login()
      .post({
        body: loginData,
      })
      .execute();

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
