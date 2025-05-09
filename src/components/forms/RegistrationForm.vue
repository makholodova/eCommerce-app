<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import BaseInputField from "@/components/ui/BaseInputField.vue";
import { fieldValidators } from "@/utils/validation.ts";

const fieldKeys = {
  email: "email",
  password: "password",
  firstName: "firstName",
  lastName: "lastName",
  birthDate: "birthDate",
  street: "street",
  city: "city",
  country: "country",
  postalCode: "postalCode",
} as const;

type FieldKey = (typeof fieldKeys)[keyof typeof fieldKeys];
const form = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  street: "",
  city: "",
  country: "",
  postalCode: "",
});

const countries = ref([{ title: "RU", value: "Россия" }]);

const errors = reactive<Record<string, string>>({});

function validateField(field: FieldKey): void {
  const validator = fieldValidators[field];
  if (!validator) return;

  const value = form[field];
  const error = validator(value);
  errors[field] = error;
}

function handleSubmit(): void {
  Object.values(fieldKeys).forEach(validateField);

  const hasErrors = Object.values(errors).some(Boolean);
  if (hasErrors) return;

  const dateCustomerRequest = {
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.lastName,
    dateOfBirth: form.birthDate,
    address: {
      streetName: form.street,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
    },
  };

  console.log("Форма валидна, отправляем данные:", dateCustomerRequest);
}
const isFormValid = computed(() => {
  const hasEmptyFields = Object.values(form).some((value) => !value);
  const hasErrors = Object.values(errors).some(Boolean);
  return !hasEmptyFields && !hasErrors;
});
</script>

<template>
  <form class="registration-form" @submit.prevent="handleSubmit">
    <div class="form-section credentials-wrapper">
      <BaseInputField
        id="email"
        v-model="form.email"
        :error="errors.email"
        label="E-mail"
        placeholder="user@example.com"
        type="email"
        @input="validateField(fieldKeys.email)"
      />
      <BaseInputField
        id="password"
        v-model="form.password"
        :error="errors.password"
        label="Пароль"
        placeholder="**********"
        type="password"
        @input="validateField(fieldKeys.password)"
      />
    </div>
    <div class="form-section personal-data-wrapper">
      <h3 class="form-section-title">Personal Info</h3>
      <BaseInputField
        id="firstName"
        v-model="form.firstName"
        :error="errors.firstName"
        label="Имя"
        placeholder="Иван"
        type="text"
        @input="validateField(fieldKeys.firstName)"
      />

      <BaseInputField
        id="lastName"
        v-model="form.lastName"
        :error="errors.lastName"
        label="Фамилия"
        placeholder="Иванов"
        type="text"
        @input="validateField(fieldKeys.lastName)"
      />

      <BaseInputField
        id="birthDate"
        v-model="form.birthDate"
        :error="errors.birthDate"
        label="Дата рождения"
        placeholder="01.01.2000"
        type="date"
        @input="validateField(fieldKeys.birthDate)"
      />
    </div>

    <div class="form-section address-wrapper">
      <h3 class="form-section-title">Адрес доставки</h3>
      <BaseInputField
        id="street"
        v-model="form.street"
        :error="errors.street"
        label="Улица"
        placeholder="ул. Ленина"
        type="text"
        @input="validateField(fieldKeys.street)"
      />

      <BaseInputField
        id="city"
        v-model="form.city"
        :error="errors.city"
        label="Город"
        placeholder="Москва"
        type="text"
        @input="validateField(fieldKeys.city)"
      />

      <label class="field">
        <span>Country</span>
        <select
          id="country"
          v-model="form.country"
          @change="validateField(fieldKeys.country)"
        >
          <option disabled value="">Выберите страну</option>
          <option
            v-for="country in countries"
            :key="country.title"
            :value="country.title"
          >
            {{ country.value }}
          </option>
        </select>
        <span v-if="errors.country" class="error-text">{{
          errors.country
        }}</span>
      </label>

      <BaseInputField
        id="postalCode"
        v-model="form.postalCode"
        :error="errors.postalCode"
        label="Postal Code"
        placeholder="123456"
        type="text"
        @input="validateField(fieldKeys.postalCode)"
      />
    </div>

    <button class="button" type="submit" :disabled="!isFormValid">
      Зарегистрироваться
    </button>
  </form>
</template>

<style scoped>
.form-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column: span 2;
  grid-row: 1;
  gap: 1rem;

  margin-bottom: 2rem;
}

.form-section-title {
  grid-column: span 2;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

select {
  border: 1px solid var(--grey-not-active);
  border-radius: 8px;
  padding: 11px 8px 11px 16px;

  font-size: 1rem;
  font-weight: 400;
  color: var(--grey-not-active);

  outline: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

select:not(:placeholder-shown):not(.error):not(:focus) {
  font-size: 1rem;
  color: var(--black);
}

/*select.valid {
  background-image: url("@/assets/icons/icon_valid.svg");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px 20px;
}*/

/*select.error {
  font-size: 1rem;
  border: 1px solid var(--red);
  color: var(--red);
}*/

select:focus:not(.error) {
  border: 1px solid var(--black);
  color: var(--black);
}

.error-text {
  color: var(--red);
  font-size: 0.7rem;
}

.button {
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 17px;
  border: none;
  color: var(--white);

  background-color: var(--blue);
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.button:hover {
  background-color: var(--blue-hover);
}

.button:disabled {
  pointer-events: none;
  opacity: 0.8;
  background-color: var(--blue-light);
}
</style>
