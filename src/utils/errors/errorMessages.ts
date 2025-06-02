export const registrationErrorMessages: Record<string, string> = {
  "There is already an existing customer with the provided email.":
    "Пользователь с таким email уже существует.",

  //дополнять по мере необходимости
};

export const loginErrorMessages: Record<string, string> = {
  "Customer account with the given credentials not found.":
    "Неверный email или пароль.",
};

export const passwordErrorMessages: Record<string, string> = {
  "Request failed with status code 400": "Текущий пароль указан неверно.",
};
export const productErrorMessages: Record<string, string> = {
  "Category with the given key not found": "Категория не найдена.",
  "Failed to fetch": "Проблема с соединением. Проверьте интернет.",
};
