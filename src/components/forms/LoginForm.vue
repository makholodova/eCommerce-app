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
  <form @submit.prevent="handleForm">
    <div class="login-form">
      <div class="login-form__email">
        <label for="email">Почта</label>
        <input id="email" v-model="email" type="email" />
      </div>
      <div class="login-form__password">
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
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin: 40px 0;
}
</style>
