<script lang="ts" setup>
import LoginForm from "@/components/forms/LoginForm.vue";
</script>

<template>
  <div class="container">
    <h1>Войти</h1>
    <div class="register-prompt">
      <span>Ещё нет учетной записи?</span>
      <router-link to="/register">Зарегистрироваться</router-link>
    </div>
    <LoginForm />
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 542px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 96px 40px 40px;
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
  .container {
    padding: 40px clamp(12px, 5vw, 40px);
  }
}
</style>
