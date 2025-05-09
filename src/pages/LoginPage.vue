<script lang="ts" setup>
import { ref, computed } from "vue";
import TheButton from "@/components/ui/TheButton.vue";

const email = ref("");
const password = ref("");

const isFromValid = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length > 0;
});

const handleForm = (): void => console.log("форма отправлена");
</script>

<template>
  <div class="container">
    <h1>Войти</h1>
    <div class="register-prompt">
      <span>Ещё нет аккаунта?</span>
      <router-link to="/register">Зарегистрироваться</router-link>
    </div>
    <form @submit.prevent="handleForm">
      <div class="form">
        <div class="form-email">
          <label for="email">Почта</label>
          <input id="email" v-model="email" type="email" />
        </div>
        <div class="form-password">
          <label for="password">Пароль</label>
          <input id="password" v-model="password" type="password" />
        </div>
      </div>
      <TheButton
        text="Войти"
        type="submit"
        size="xl"
        :variant="isFromValid ? 'primary' : 'disabled'"
      />
    </form>
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
}

.register-prompt a {
  color: var(--black);
  text-decoration: none;
  border-bottom: 1px solid var(--black);
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin: 40px 0;
}
</style>
