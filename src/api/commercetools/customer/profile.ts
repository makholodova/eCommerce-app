import { createCustomerApiRoot } from "../createCustomer";
import type { UserLoginData } from "@/types/user-login.types";

export async function userProfile(loginData: UserLoginData): Promise<void> {
  const apiRoot = createCustomerApiRoot(loginData.email, loginData.password);
  try {
    const response = await apiRoot.me().get().execute();
    console.log("Профиль пользователя:", response.body);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ошибка при получении профиля пользователя");
    }
  }
}
