<script lang="ts" setup>
import LoginForm from "@/components/forms/LoginForm.vue";
</script>

<template>
  <div class="login-page">
    <h1>Войти</h1>
    <div class="register-prompt">
      <span>Ещё нет учетной записи?</span>
      <router-link :to="{ name: 'Register' }">Зарегистрироваться</router-link>
    </div>
    <LoginForm />
  </div>
</template>

<style scoped>
.login-page {
  max-width: 542px;
  width: 100%;
  margin: 30px auto;
  padding: clamp(12px, 8vw, 40px) clamp(10px, 7vw, 60px);
  border-radius: 40px;
  background-color: var(--blue-lighter);
}

h1 {
  font-weight: 500;
  font-size: 28px;
  text-align: center;
}

.register-prompt {
  display: flex;
  gap: clamp(8px, 2vw, 14px);
  align-items: baseline;
  justify-content: center;
  font-size: clamp(14px, 3.2vw, 16px);
}

.register-prompt a {
  color: var(--blue);
  text-decoration: none;
  transition:
    text-decoration 0.2s ease,
    color 0.2s ease;
}

.register-prompt a:hover {
  text-decoration: underline;
  color: var(--blue-hover);
}

@media (max-width: 470px) {
  .register-prompt {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }
}
</style>
