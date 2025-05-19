<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import router from "@/router";
import { signUp } from "@/api/commercetools/singUp.ts";
import { showError, showSuccess } from "@/utils/toast.ts";
import {
  addressRules,
  authRules,
  personalInfoRules,
} from "@/utils/validation.ts";
import type { UserRegistrationData } from "@/types/user-registration.types.ts";
import type { CountryOption } from "@/types/interfaces.ts";
import AuthForm from "@/components/forms/AuthForm.vue";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm.vue";
import AddressForm from "@/components/forms/AddressForm.vue";
import BaseCheckbox from "@/components/ui/BaseCheckbox.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { registrationErrorMessages } from "@/utils/errors/errorMessages.ts";
import { login } from "@/api/commercetools/login.ts";
import { getUserProfile } from "@/api/commercetools/customer/profile.ts";

const auth = reactive({
  email: "",
  password: "",
});
const personal = reactive({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
});

const shippingAddress = reactive({
  streetName: "",
  city: "",
  country: "",
  postalCode: "",
});

const billingAddress = reactive({
  streetName: "",
  city: "",
  country: "",
  postalCode: "",
});

const useSameAddress = ref(false);
const isDefaultShipping = ref(false);
const isDefaultBilling = ref(false);
const isLoading = ref(false);
const isRegistered = ref(false);

const countries = ref<CountryOption[]>([{ title: "RU", value: "Россия" }]);

const rules = computed(() => ({
  auth: authRules,
  personal: personalInfoRules,
  shippingAddress: addressRules,
  billingAddress: useSameAddress.value ? {} : addressRules,
}));
const v$ = useVuelidate(
  rules,
  { auth, personal, shippingAddress, billingAddress },
  { $lazy: true, $autoDirty: true },
);

watch(
  () => shippingAddress,
  (value) => {
    if (useSameAddress.value) {
      Object.assign(billingAddress, value);
    }
  },
  { deep: true },
);
async function handleSubmit(): Promise<void> {
  await v$.value.$validate();
  if (v$.value.$invalid) return;

  isLoading.value = true;

  const dateCustomerRequest: UserRegistrationData = {
    email: auth.email,
    password: auth.password,
    firstName: personal.firstName,
    lastName: personal.lastName,
    dateOfBirth: personal.dateOfBirth,
    addresses: useSameAddress.value
      ? [shippingAddress]
      : [shippingAddress, billingAddress],
    defaultShippingAddress: isDefaultShipping.value ? 0 : undefined,
    defaultBillingAddress: useSameAddress.value
      ? isDefaultShipping.value
        ? 0
        : undefined
      : isDefaultBilling.value
        ? 1
        : undefined,
    shippingAddresses: [0],
    billingAddresses: useSameAddress.value ? [0] : [1],
  };

  const loginData = {
    email: auth.email,
    password: auth.password,
  };

  try {
    await signUp(dateCustomerRequest);
    const loginResult = await login(loginData);
    console.log("Вход выполнен успешно:", loginResult.customer.firstName);

    isRegistered.value = true;
    isLoading.value = false;

    //временная проверка, выводит профиль созданного пользователя
    const userData = await getUserProfile();
    console.log("Профиль пользователя:", userData);

    showSuccess(
      `Аккаунт успешно создан! Добро пожаловать, ${loginResult.customer.firstName}!`,
      () => {
        router.push({ name: "Main" });
      },
    );
  } catch (error) {
    isLoading.value = false;

    if (error instanceof Error) {
      const message =
        registrationErrorMessages[error.message] ||
        "Произошла ошибка при регистрации. Пожалуйста, попробуйте ещё раз.";
      showError(message);
    } else {
      showError("Произошла неизвестная ошибка. Попробуйте позже.");
    }
  }
}

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <form class="registration-form" @submit.prevent="handleSubmit">
    <fieldset :disabled="isLoading || isRegistered" class="form-fieldset">
      <AuthForm v-model="auth" :rules="rules.auth" />

      <PersonalInfoForm
        v-model="personal"
        :rules="rules.personal"
        title="Личная информация"
        class="form-container"
      />

      <AddressForm
        v-model="shippingAddress"
        :countries="countries"
        :rules="rules.shippingAddress"
        prefix="shipping"
        title="Адрес доставки"
        class="form-container"
        :is-loading="isLoading || isRegistered"
      />
      <BaseCheckbox
        v-model="isDefaultShipping"
        label="Использовать по умолчанию для доставки"
      />

      <BaseCheckbox
        v-model="useSameAddress"
        label="Использовать адрес доставки для выставления счета"
      />

      <AddressForm
        v-show="!useSameAddress"
        v-model="billingAddress"
        :countries="countries"
        :rules="rules.billingAddress"
        :is-loading="isLoading || isRegistered"
        prefix="billing"
        title="Адрес для выставления счета"
        class="form-container"
      />

      <BaseCheckbox
        v-show="!useSameAddress"
        v-model="isDefaultBilling"
        label="Использовать по умолчанию для выставления счета"
      />
    </fieldset>
    <div class="button-wrapper">
      <BaseButton
        :disabled="!isFormValid || isLoading || isRegistered"
        :is-loading="isLoading"
        size="xl"
        text="Зарегистрироваться"
        type="submit"
      />
    </div>
  </form>
</template>

<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}
.form-container {
  border-top: 2px solid var(--blue-light);
  padding-top: 0.5rem;
  margin-top: 1rem;
}
.button-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}
</style>
