import {
  email,
  helpers,
  minLength,
  required,
  sameAs,
} from "@vuelidate/validators";
import {
  digitRegExp,
  lowercaseRegExp,
  onlyLettersRegExp,
  postalCodeRegExp,
  specialCharRegExp,
  uppercaseRegExp,
  whitespaceRegExp,
} from "@/utils/baseRegEx.ts";
import { normalizeDate } from "@/utils/date.ts";
import type { ValidationRule } from "@vuelidate/core";

const allowedCountries = ["RU"];

const isAtLeastAge =
  (minAge: number) =>
  (value: string): boolean => {
    const birthDate = normalizeDate(new Date(value));
    const today = normalizeDate(new Date());
    const minAllowedDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate(),
    );
    return birthDate <= minAllowedDate;
  };

export const authRules = {
  email: {
    required: helpers.withMessage("Email обязателен", required),
    email: helpers.withMessage("Неверный формат e-mail", email),
  },
  password: {
    required: helpers.withMessage("Пароль обязателен", required),
    minLength: helpers.withMessage(
      "Пароль должен содержать не менее 8 символов",
      minLength(8),
    ),
    hasUppercase: helpers.withMessage(
      "Пароль должен содержать хотя бы одну заглавную букву",
      helpers.regex(uppercaseRegExp),
    ),
    hasLowercase: helpers.withMessage(
      "Пароль должен содержать хотя бы одну строчную букву",
      helpers.regex(lowercaseRegExp),
    ),
    hasDigit: helpers.withMessage(
      "Пароль должен содержать хотя бы одну цифру",
      helpers.regex(digitRegExp),
    ),
    hasSpecialChar: helpers.withMessage(
      "Пароль должен содержать хотя бы один специальный символ",
      helpers.regex(specialCharRegExp),
    ),

    noWhitespace: helpers.withMessage(
      "Пароль не должен содержать пробелы",
      helpers.regex(whitespaceRegExp),
    ),
  },
  sameAsPassword: (getNewPassword: () => string): ValidationRule =>
    helpers.withMessage("Пароли не совпадают", sameAs(getNewPassword())),
};

export const personalInfoRules = {
  firstName: {
    required: helpers.withMessage("Имя обязательно", required),
    onlyLetters: helpers.withMessage(
      "Имя может содержать только буквы, пробелы и дефисы",
      helpers.regex(onlyLettersRegExp),
    ),
  },

  lastName: {
    required: helpers.withMessage("Фамилия обязательна", required),
    onlyLetters: helpers.withMessage(
      "Фамилия может содержать только буквы, пробелы и дефисы",
      helpers.regex(onlyLettersRegExp),
    ),
  },
  dateOfBirth: {
    required: helpers.withMessage("Дата рождения обязательна", required),
    noWhitespace: helpers.withMessage(
      "Дата рождения не должна содержать пробелы",
      helpers.regex(whitespaceRegExp),
    ),
    isAtLeast14: helpers.withMessage(
      "Вам должно быть не менее 14 лет",
      isAtLeastAge(14),
    ),
  },
};
export const addressRules = {
  streetName: {
    required: helpers.withMessage("Улица обязательна", required),
  },
  city: {
    required: helpers.withMessage("Город обязателен", required),
    onlyLetters: helpers.withMessage(
      "Город  может содержать только буквы, пробелы и дефисы",
      helpers.regex(onlyLettersRegExp),
    ),
  },
  country: {
    required: helpers.withMessage("Страна обязательна", required),
    allowed: helpers.withMessage(
      "Выбранная страна недопустима",
      (value: string) => allowedCountries.includes(value),
    ),
  },
  postalCode: {
    required: helpers.withMessage("Почтовый индекс обязателен", required),
    hasDigit: helpers.withMessage(
      "Почтовый индекс в России должен состоять ровно из 6 цифр",
      helpers.regex(postalCodeRegExp),
    ),
  },
};
