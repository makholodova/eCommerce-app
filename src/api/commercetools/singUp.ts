import type { UserRegistrationData } from "@/types/user-registration.types.ts";
import { apiRoot } from "@/api/commercetools/buildClient.ts";
import type { CustomerSignInResult } from "@commercetools/platform-sdk";

export async function signUp(
  customerData: UserRegistrationData,
): Promise<CustomerSignInResult> {
  try {
    const response = await apiRoot
      .customers()
      .post({
        body: customerData,
      })
      .execute();

    return response.body;
  } catch (error) {
    throw error || "Ошибка при регистрации";
  }
}
