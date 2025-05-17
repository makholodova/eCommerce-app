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
      prefix="billing"
      title="Адрес для выставления счета"
      class="form-container"
    />

    <BaseCheckbox
      v-show="!useSameAddress"
      v-model="isDefaultBilling"
      label="Использовать по умолчанию для выставления счета"
    />

    <div class="button-wrapper">
      <BaseButton
        :disabled="!isFormValid || isLoading"
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
