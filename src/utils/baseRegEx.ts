export const onlyLettersRegExp = new RegExp(
  /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/,
);
export const whitespaceRegExp = new RegExp(/^[^\s]+$/);
export const uppercaseRegExp = new RegExp(/[A-ZА-ЯЁ]/);
export const lowercaseRegExp = new RegExp(/[a-zа-яё]/);
export const digitRegExp = new RegExp(/\d/);
export const specialCharRegExp = new RegExp(
  /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']+/,
);
export const postalCodeRegExp = new RegExp(/^\d{6}$/);
