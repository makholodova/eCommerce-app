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

const form = reactive({
  auth: {
    email: "",
    password: "",
  },
  personal: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  },
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

const rules = computed(() => ({
  auth: authRules,
  personal: personalInfoRules,
  shippingAddress: addressRules,
  billingAddress: form.useSameAddress ? {} : addressRules,
}));
const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

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

async function handleSubmit(): Promise<void> {
  await v$.value.$validate();
  if (v$.value.$invalid) return;

  isLoading.value = true;

  const dateCustomerRequest: UserRegistrationData = {
    email: form.auth.email,
    password: form.auth.password,
    firstName: form.personal.firstName,
    lastName: form.personal.lastName,
    dateOfBirth: form.personal.dateOfBirth,
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
    <AuthForm v-model="form.auth" :rules="rules.auth" />

    <PersonalInfoForm
      v-model="form.personal"
      :rules="rules.personal"
      title="Личная информация"
    />

    <AddressForm
      v-model="form.shippingAddress"
      :countries="countries"
      :rules="rules.shippingAddress"
      prefix="shipping"
      title="Адрес доставки"
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
      prefix="billing"
      title="Адрес для выставления счета"
    />

    <BaseCheckbox
      v-show="!form.useSameAddress"
      id="billingAddress"
      v-model="form.isDefaultBilling"
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
.button-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.registration-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
