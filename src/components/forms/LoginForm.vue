<script lang="ts" setup>
import { reactive, computed } from "vue";
import BaseInputField from "../ui/BaseInputField.vue";
import useVuelidate from "@vuelidate/core";
import { registrationRules } from "@/utils/validation";
import BaseButton from "@/components/ui/BaseButton.vue";

const form = reactive({
  email: "",
  password: "",
});

const rules = computed(() => ({
  email: registrationRules.email,
  password: registrationRules.password,
}));

const v$ = useVuelidate(rules, form, { $lazy: true, $autoDirty: true });

async function handleSubmit(): Promise<void> {
  await v$.value.$validate();
  if (v$.value.$invalid) return;
  const dateCustomerRequest = {
    username: form.email,
    password: form.password,
  };

  console.log("Вход выполнен успешно ", dateCustomerRequest);
}

const isFormValid = computed(() => !v$.value.$invalid);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="login-form">
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
