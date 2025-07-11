<script lang="ts" setup>
import { reactive, computed } from "vue";
import BaseInputField from "../ui/BaseInputField.vue";
import useVuelidate from "@vuelidate/core";
import { authRules } from "@/utils/validation";
import BaseButton from "@/components/ui/BaseButton.vue";
import { login } from "@/api/commercetools/login";
import { loginErrorMessages } from "@/utils/errors/errorMessages";
import { showError } from "@/utils/toast.ts";
import router from "@/router";
import { sharedCustomer } from "@/store/sharedCustomer.ts";

const form = reactive({
  email: "",
  password: "",
});

const rules = computed(() => ({
  email: authRules.email,
  password: authRules.password,
}));

const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

async function handleSubmit(): Promise<void> {
  await v$.value.$validate();
  if (v$.value.$invalid) return;
  const loginData = {
    email: form.email,
    password: form.password,
  };

  try {
    const result = await login(loginData);

    sharedCustomer.value = result.customer;

    await router.replace({ name: "Main" });
  } catch (error) {
    if (error instanceof Error) {
      const message =
        loginErrorMessages[error.message] ||
        "Произошла ошибка при входе. Пожалуйста, попробуйте ещё раз.";
      showError(message);
    } else {
      showError("Произошла неизвестная ошибка. Попробуйте позже.");
    }
  }
}

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="login-form">
      <BaseInputField
        id="email"
        v-model="form.email"
        name="email"
        :vuelidate-rules="rules.email"
        label="E-mail"
        placeholder="user@example.com"
        show-error
        type="email"
        autocomplete="email"
      />
      <BaseInputField
        id="password"
        v-model="form.password"
        name="password"
        :vuelidate-rules="rules.password"
        label="Пароль"
        placeholder="**********"
        show-error
        type="password"
        autocomplete="current-password"
      />
    </div>
    <div class="button-wrapper">
      <BaseButton
        text="Войти"
        type="submit"
        size="xl"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 3vw, 32px);
  margin: clamp(20px, 4vw, 40px) 0;
}

.button-wrapper {
  display: flex;
  justify-content: center;
}
</style>
