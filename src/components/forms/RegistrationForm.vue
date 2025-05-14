<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import BaseInputField from "@/components/ui/BaseInputField.vue";
import { useVuelidate } from "@vuelidate/core";
import { addressRules, registrationRules } from "@/utils/validation.ts";
import { signUp } from "@/api/commercetools/singUp.ts";
import type { UserRegistrationData } from "@/types/user-registration.types.ts";
import { showError, showSuccess } from "@/utils/toast.ts";
import AddressForm from "@/components/forms/AddressForm.vue";
import type { CountryOption } from "@/types/interfaces.ts";
import BaseCheckbox from "@/components/ui/BaseCheckbox.vue";
import router from "@/router";

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
  useSameAddress: false,
});
const isLoading = ref(false);
const countries = ref<CountryOption[]>([{ title: "RU", value: "Россия" }]);

watch(
  () => form.shippingAddress,
  (value) => {
    console.log(value);
    if (form.useSameAddress) {
      console.log(form.useSameAddress);
      form.billingAddress = { ...value };
    }
  },
);

/*const rules = computed(() => registrationRules);*/
const addressValidationRules = computed(() => addressRules);
const rules = computed(() => ({
  ...registrationRules,
  shippingAddress: addressValidationRules.value,
  billingAddress: form.useSameAddress ? {} : addressValidationRules.value,
}));

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
    addresses: form.useSameAddress
      ? [form.shippingAddress]
      : [form.shippingAddress, form.billingAddress],
    defaultShippingAddress: form.isDefaultShipping ? 0 : undefined,
    defaultBillingAddress: form.useSameAddress
      ? form.isDefaultShipping
        ? 0
        : undefined
      : form.isDefaultBilling
        ? 1
        : undefined,
    shippingAddresses: [0],
    billingAddresses: form.useSameAddress ? [0] : [1],
  };
  try {
    const createdCustomer = await signUp(dateCustomerRequest);
    showSuccess(
      `Аккаунт успешно создан! Добро пожаловать, ${createdCustomer.customer.firstName}!`,
      () => {
        router.push({ name: "Main" });
      },
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
      :rules="rules.shippingAddress"
      title="Адрес доставки"
      prefix="shipping"
    />
    <BaseCheckbox
      id="shippingAddress"
      v-model="form.isDefaultShipping"
      label="Использовать по умолчанию для доставки"
    />

    <BaseCheckbox
      id="useSameAddress"
      v-model="form.useSameAddress"
      label="Использовать адрес доставки для выставления счета"
    />

    <AddressForm
      v-show="!form.useSameAddress"
      v-model="form.billingAddress"
      :countries="countries"
      :rules="rules.billingAddress"
      title="Адрес для выставления счета"
      prefix="billing"
    />

    <BaseCheckbox
      v-show="!form.useSameAddress"
      id="billingAddress"
      v-model="form.isDefaultBilling"
      label="Использовать по умолчанию для выставления счета"
    />

    <button :disabled="!isFormValid || isLoading" class="button" type="submit">
      <span v-if="isLoading" class="spinner" />
      <span v-else>Зарегистрироваться</span>
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
