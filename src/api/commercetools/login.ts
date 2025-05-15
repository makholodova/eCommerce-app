import { createCustomerApiRoot } from "./createCustomer";
import type { UserLoginData } from "@/types/user-login.types";
import type { CustomerSignInResult } from "@commercetools/platform-sdk";

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

    const userState = {
      firstName: response.body.customer.firstName,
      isAuthenticated: true,
    };

    localStorage.setItem("user", JSON.stringify(userState));

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ошибка при входе");
    }
  }
}
