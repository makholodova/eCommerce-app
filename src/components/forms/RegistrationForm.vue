<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import BaseInputField from "@/components/ui/BaseInputField.vue";
import { useVuelidate } from "@vuelidate/core";
import { registrationRules, addressRules } from "@/utils/validation.ts";
import { signUp } from "@/api/commercetools/singUp.ts";
import type { UserRegistrationData } from "@/types/user-registration.types.ts";
import { showError, showSuccess } from "@/utils/toast.ts";
import router from "@/router";
import AddressForm from "@/components/forms/AddressForm.vue";
import type { CountryOption } from "@/types/interfaces.ts";
import BaseCheckbox from "@/components/ui/BaseCheckbox.vue";

const form = reactive({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  shippingAddress: {
    streetName: "",
    city: "",
    country: "",
    postalCode: "",
  },
  billingAddress: {
    streetName: "",
    city: "",
    country: "",
    postalCode: "",
  },

  isDefaultShipping: false,
  isDefaultBilling: false,
});
const isLoading = ref(false);
const countries = ref<CountryOption[]>([{ title: "RU", value: "Россия" }]);

const rules = computed(() => registrationRules);
const addressValidationRules = computed(() => addressRules);

const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

async function handleSubmit(): Promise<void> {
  await v$.value.$validate();
  if (v$.value.$invalid) return;

  isLoading.value = true;

  const dateCustomerRequest: UserRegistrationData = {
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.lastName,
    dateOfBirth: form.dateOfBirth,
    defaultShippingAddress: form.isDefaultShipping ? 0 : undefined,
    defaultBillingAddress: form.isDefaultBilling ? 1 : undefined,
    addresses: [form.shippingAddress, form.billingAddress],
  };
  try {
    const createdCustomer = await signUp(dateCustomerRequest);
    showSuccess(
      `Аккаунт успешно создан! Добро пожаловать, ${createdCustomer.customer.firstName}!`,
      () => router.push({ name: "Main" }),
    );
  } catch (error) {
    showError(
      `Произошла ошибка при регистрации. Пожалуйста, попробуйте ещё раз. ${error}`,
    );
  } finally {
    isLoading.value = false;
  }
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
        v-model="form.dateOfBirth"
        :vuelidate-rules="rules.dateOfBirth"
        label="Дата рождения"
        placeholder="01.01.2000"
        show-error
        type="date"
      />
    </div>

    <AddressForm
      v-model="form.shippingAddress"
      :countries="countries"
      :rules="addressValidationRules"
      title="Адрес доставки"
    />
    <BaseCheckbox
      id="shippingAddress"
      v-model="form.isDefaultShipping"
      label="Использовать по умолчанию для доставки"
    />

    <AddressForm
      v-model="form.billingAddress"
      :countries="countries"
      :rules="addressValidationRules"
      title="Адрес для выставления счета"
    />
    <BaseCheckbox
      id="billingAddress"
      v-model="form.isDefaultBilling"
      label="Использовать по умолчанию для выставления счета"
    />

    <button :disabled="!isFormValid || isLoading" class="button" type="submit">
      <span v-if="isLoading" class="spinner" />
      <span v-else>Зарегистрироваться</span>
    </button>
    <p class="login-link">
      Уже есть учетная запись?
      <RouterLink :to="{ name: 'Login' }" class="login-button"
        >Войти
      </RouterLink>
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

  margin-bottom: 1rem;
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
    text-decoration 0.2s ease,
    color 0.2s ease;
}

.login-button:hover {
  text-decoration: underline;
  color: var(--blue-hover);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--white);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
