import type { Validator } from "@/types/types.ts";
import { normalizeDate } from "@/utils/date.ts";

export const validateEmail: Validator = (email) => {
  if (!email) return "Email обязателен";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Неверный формат email";
  if (/\s/.test(email)) return "Email не должен содержать пробелы";
  return "";
};

export const validatePassword: Validator = (password) => {
  if (!password) return "Пароль обязателен";
  if (password.length < 8) return "Пароль должен содержать не менее 8 символов";
  if (!/[A-ZА-Я]/.test(password))
    return "Пароль должен содержать хотя бы одну заглавную букву";
  if (!/[a-zа-яё]/.test(password))
    return "Пароль должен содержать хотя бы одну строчную букву";
  if (!/\d/.test(password)) return "Пароль должен содержать хотя бы одну цифру";
  if (!/[^\dA-Za-zА-Яа-яёЁ]/.test(password))
    return "ароль должен содержать хотя бы один специальный символ";
  if (/\s/.test(password)) return "Пароль не должен содержать пробелы";
  return "";
};

export const validateFirstName: Validator = (name) => {
  if (!name) return "Имя обязательно";
  if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name)) return "Допустимы только буквы";
  if (/\s/.test(name)) return "Имя не должно содержать пробелы";
  return "";
};

export const validateLastName: Validator = (name) => {
  if (!name) return "Фамилия обязательна";
  if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name)) return "Допустимы только буквы";
  if (/\s/.test(name)) return "Фамилия не должна содержать пробелы";
  return "";
};

export const validateBirthDate: Validator = (dateStr) => {
  if (!dateStr) return "Дата рождения обязательна";
  if (/\s/.test(dateStr)) {
    return "Дата рождения не должна содержать пробелы";
  }

  const birthDate = normalizeDate(new Date(dateStr));
  const today = normalizeDate(new Date());

  const minAllowedDate = new Date(
    today.getFullYear() - 14,
    today.getMonth(),
    today.getDate(),
  );
  if (birthDate > minAllowedDate) return "Вам должно быть не менее 14 лет";
  return "";
};

export const validateStreet: Validator = (name) => {
  if (!name) return "Улица обязательна";
  return "";
};

export const validateCity: Validator = (name) => {
  if (!name) return "Город обязателен";
  if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name)) return "Допустимы только буквы";
  return "";
};

export const validateCountry: Validator = (country) => {
  const allowedCountries = ["RU"];
  if (!country) return "Страна обязательна";
  if (!allowedCountries.includes(country)) {
    return "Выбранная страна недопустима";
  }
  return "";
};

export const validatePostalCode: Validator = (code) => {
  if (!code) return "Почтовый индекс обязателен";
  if (!/\d{6}$/.test(code) || code.length > 6)
    return `Почтовый индекс в России должен состоять ровно из 6 цифр`;
  return "";
};

export const fieldValidators: Record<string, Validator> = {
  email: validateEmail,
  password: validatePassword,
  firstName: validateFirstName,
  lastName: validateLastName,
  birthDate: validateBirthDate,
  street: validateStreet,
  city: validateCity,
  country: validateCountry,
  postalCode: validatePostalCode,
};
