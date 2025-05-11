import { email, helpers, minLength, required } from "@vuelidate/validators";
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

export const registrationRules = {
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

  firstName: {
    required: helpers.withMessage("Имя обязательно", required),
    /*noWhitespace: helpers.withMessage(
			"Имя не должно содержать пробелы",
			helpers.regex(whitespaceRegEx)
		),*/
    onlyLetters: helpers.withMessage(
      "Имя может содержать только буквы, пробелы и дефисы",
      helpers.regex(onlyLettersRegExp),
    ),
  },

  lastName: {
    required: helpers.withMessage("Фамилия обязательна", required),
    /*noWhitespace: helpers.withMessage(
			"Фамилия не должна содержать пробелы",
			helpers.regex(whitespaceRegEx)
		),*/
    onlyLetters: helpers.withMessage(
      "Допустимы может содержать только буквы, пробелы и дефисы",
      helpers.regex(onlyLettersRegExp),
    ),
  },
  birthDate: {
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

  street: {
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
