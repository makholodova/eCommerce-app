<script lang="ts" setup>
import RegistrationForm from "@/components/forms/RegistrationForm.vue";
</script>

<template>
  <div class="registration-page">
    <h1 class="registration-page-title">Регистрация</h1>
    <RegistrationForm />
    <div class="login-link">
      <span>Уже есть учетная запись?</span>
      <router-link :to="{ name: 'Login' }">Войти</router-link>
    </div>
  </div>
</template>

<style scoped>
.registration-page {
  max-width: 1200px;
  width: 100%;
  margin: 20px auto;
  padding: 40px;
  border-radius: 40px;
  background-color: var(--blue-lighter);

  /* background: var(--blue-lighter);;*/
  box-shadow: 0 2px 20px rgb(0 0 0 / 10%);
}

.registration-page-title {
  font-weight: 500;
  font-size: 28px;
  text-align: center;
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

@media (max-width: 470px) {
  .registration-page {
    padding: 10px;
  }

  .registration-page {
    padding: 20px;
  }
}
</style>
