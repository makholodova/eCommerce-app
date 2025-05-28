import { createAnonymousApiRoot } from "./createAnonymousClient";

export async function loginAnonymous(): Promise<void> {
  const apiRoot = createAnonymousApiRoot();

  try {
    await apiRoot.categories().get().execute();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Не удалось авторизовать анонимного пользователя");
    }
  }
}
