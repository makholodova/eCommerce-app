import type { Validator } from "@/types/types.ts";
import { normalizeDate } from "@/utils/date.ts";

export const validateEmail: Validator = (email) => {
  if (!email) return "Email  is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  if (/\s/.test(email)) return "Email must not contain white spaces";
  return "";
};

export const validatePassword: Validator = (password) => {
  if (!password) return "Password  is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-ZА-Я]/.test(password))
    return "The password must contain at least one capital letter";
  if (!/[a-zа-яё]/.test(password))
    return "The password must contain at least one lowercase letter";
  if (!/\d/.test(password))
    return "The password must contain at least one digit";
  if (!/[^\dA-Za-zА-Яа-яёЁ]/.test(password))
    return "The password must contain at least one special character";
  if (/\s/.test(password)) return "Password must not contain white spaces";
  return "";
};

export const validateFirstName: Validator = (name) => {
  if (!name) return "First name is required";
  if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name)) return "Only letters are allowed";
  if (/\s/.test(name)) return "First name must not contain white spaces";
  return "";
};

export const validateLastName: Validator = (name) => {
  if (!name) return "Last name is required";
  if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name)) return "Only letters are allowed";
  if (/\s/.test(name)) return "Last name must not contain white spaces";
  return "";
};

export const validateBirthDate: Validator = (dateStr) => {
  if (!dateStr) return "Date of birth is required";
  if (/\s/.test(dateStr)) {
    return "Date of birth must not contain white spaces";
  }

  const birthDate = normalizeDate(new Date(dateStr));
  const today = normalizeDate(new Date());

  const minAllowedDate = new Date(
    today.getFullYear() - 14,
    today.getMonth(),
    today.getDate(),
  );
  if (birthDate > minAllowedDate) return "You must be at least 14 years old";
  return "";
};

export const validateStreet: Validator = (name) => {
  if (!name) return "Street is required";
  return "";
};

export const validateCity: Validator = (name) => {
  if (!name) return "City is required";
  if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name)) return "Only letters are allowed";
  return "";
};

export const validateCountry: Validator = (country) => {
  const allowedCountries = ["RU"];
  if (!country) return "Country is required";
  if (!allowedCountries.includes(country)) {
    return "Selected country is not allowed";
  }
  return "";
};

export const validatePostalCode: Validator = (code) => {
  if (!code) return "Postal code  is required";
  if (!/\d{6}$/.test(code) || code.length > 6)
    return `Postal code in Russia must be exactly 6 digits`;
  return "";
};
