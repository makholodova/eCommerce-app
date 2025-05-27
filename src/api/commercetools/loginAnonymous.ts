import { createAnonymousApiRoot } from "./createAnonymousClient";

export async function loginAsAnonymous(): Promise<void> {
  const apiRoot = createAnonymousApiRoot();

  try {
    await apiRoot.me().get().execute();

    console.log("Анонимный токен успешно получен и сохранён");
  } catch (error) {
    console.error("Ошибка при создании анонимного токена:", error);
    throw new Error("Не удалось авторизовать анонимного пользователя");
  }
}
