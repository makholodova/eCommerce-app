<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import BaseInputField from "@/components/ui/BaseInputField.vue";
import { useVuelidate } from "@vuelidate/core";
import BaseSelectField from "@/components/ui/BaseSelectField.vue";
import { registrationRules } from "@/utils/validation.ts";

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

const rules = computed(() => registrationRules);

const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

async function handleSubmit(): Promise<void> {
  await v$.value.$validate();
  if (v$.value.$invalid) return;
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

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <form class="registration-form" @submit.prevent="handleSubmit">
    <div class="form-section credentials-wrapper">
      <BaseInputField
        id="email"
        v-model="form.email"
        :vuelidate-rules="rules.email"
        label="E-mail"
        placeholder="user@example.com"
        show-error
        type="email"
      />
      <BaseInputField
        id="password"
        v-model="form.password"
        :vuelidate-rules="rules.password"
        label="Пароль"
        placeholder="**********"
        show-error
        type="password"
      />
    </div>
    <div class="form-section personal-data-wrapper">
      <h3 class="form-section-title">Личная информация</h3>
      <BaseInputField
        id="firstName"
        v-model="form.firstName"
        :vuelidate-rules="rules.firstName"
        label="Имя"
        placeholder="Иван"
        show-error
        type="text"
      />

      <BaseInputField
        id="lastName"
        v-model="form.lastName"
        :vuelidate-rules="rules.lastName"
        label="Фамилия"
        placeholder="Иванов"
        show-error
        type="text"
      />

      <BaseInputField
        id="birthDate"
        v-model="form.birthDate"
        :vuelidate-rules="rules.birthDate"
        label="Дата рождения"
        placeholder="01.01.2000"
        show-error
        type="date"
      />
    </div>

    <div class="form-section address-wrapper">
      <h3 class="form-section-title">Адрес доставки</h3>
      <BaseInputField
        id="street"
        v-model="form.street"
        :vuelidate-rules="rules.street"
        label="Улица"
        placeholder="ул. Ленина"
        show-error
        type="text"
      />

      <BaseInputField
        id="city"
        v-model="form.city"
        :vuelidate-rules="rules.city"
        label="Город"
        placeholder="Москва"
        show-error
        type="text"
      />

      <BaseSelectField
        id="country"
        v-model="form.country"
        :options="countries"
        :vuelidate-rules="rules.country"
        label="Страна"
        placeholder="Выберите страну"
        show-error
      />

      <BaseInputField
        id="postalCode"
        v-model="form.postalCode"
        :vuelidate-rules="rules.postalCode"
        label="Почтовый индекс"
        placeholder="123456"
        show-error
        type="text"
      />
    </div>

    <button :disabled="!isFormValid" class="button" type="submit">
      Зарегистрироваться
    </button>
    <p class="login-link">
      Уже есть учетная запись?
      <RouterLink to="/login" class="login-button">Войти</RouterLink>
    </p>
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

.button {
  cursor: pointer;
  border-radius: 8px;
  padding: 10px 17px;
  border: none;
  color: var(--white);

  background-color: var(--blue);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.button:hover {
  background-color: var(--blue-hover);
}

.button:disabled {
  pointer-events: none;
  opacity: 0.8;
  background-color: var(--blue-light);
}

.login-link {
  margin-top: 1rem;
  font-size: 1rem;
}

.login-button {
  color: var(--blue);
  text-decoration: none;
  margin-left: 0.3rem;
  transition:
    text-decoration 0.02s ease,
    color 0.02s ease;
}

.login-button:hover {
  text-decoration: underline;
  color: var(--blue-hover);
}
</style>
