<script lang="ts" setup>
import RegistrationForm from "@/components/forms/RegistrationForm.vue";
</script>

<template>
  <div class="registration-page">
    <h1 class="registration-page-title">Регистрация</h1>
    <RegistrationForm />
    <div class="login-link">
      <span>Уже есть учетная запись?</span>
      <router-link :to="{ name: 'Login' }">Войти </router-link>
    </div>
  </div>
</template>

<style scoped>
.registration-page-title {
  text-align: center;
}
.registration-page {
  padding: 1rem 2rem;
}

.login-link {
  display: flex;
  gap: clamp(8px, 2vw, 14px);
  align-items: baseline;
  justify-content: center;
  font-size: clamp(14px, 3.2vw, 16px);
}

.login-link a {
  color: var(--blue);
  text-decoration: none;
  transition:
    text-decoration 0.2s ease,
    color 0.2s ease;
}

.login-link a:hover {
  text-decoration: underline;
  color: var(--blue-hover);
}

.login-link {
  margin-top: 1rem;
  font-size: 1rem;
}
</style>
