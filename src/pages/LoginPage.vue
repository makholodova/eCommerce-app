<script lang="ts" setup>
import LoginForm from "@/components/forms/LoginForm.vue";
</script>

<template>
  <div class="container">
    <h1>Войти</h1>
    <div class="register-prompt">
      <span>Ещё нет аккаунта?</span>
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
  gap: 14px;
  align-items: baseline;
  justify-content: center;
  font-size: clamp(14px, 4vw, 16px);
}

.register-prompt a {
  color: var(--black);
  text-decoration: none;
  border-bottom: 1px solid var(--black);
  line-height: 1.5;
}

@media (max-width: 460px) {
  .container {
    padding: 40px clamp(12px, 5vw, 40px);
  }
}
</style>
