<script setup lang="ts">
import { useRoute } from "vue-router";
import { useTokenStore } from "@/store/useTokenStore";
import { computed } from "vue";

const route = useRoute();
const token = useTokenStore();

const isAuthenticated = computed(() => token.isAuthorized);

function logout(): void {
  token.logout();
}
</script>

<template>
  <header>
    <router-link :to="{ name: 'Main' }" class="logo">
      <img src="@/assets/icons/header-icons/logo.svg" alt="logo" />
    </router-link>
    <nav>
      <ul class="navigation">
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'Main' }"
          @click="logout"
        >
          <div class="link-wrapper">
            <img
              src="@/assets/icons/header-icons/logout.png"
              alt="login"
              class="icon"
            />
            <p class="icon-description">Выход</p>
          </div>
        </router-link>
        <router-link
          v-if="!isAuthenticated && route.name !== 'Login'"
          :to="{ name: 'Login' }"
        >
          <div class="link-wrapper">
            <img
              src="@/assets/icons/header-icons/login.png"
              alt="login"
              class="icon"
            />
            <p class="icon-description">Вход</p>
          </div>
        </router-link>
        <router-link
          v-if="!isAuthenticated && route.name !== 'Register'"
          :to="{ name: 'Register' }"
        >
          <div class="link-wrapper">
            <img
              src="@/assets/icons/header-icons/signup.png"
              alt="register"
              class="icon"
            />
            <p class="icon-description">Регистрация</p>
          </div>
        </router-link>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
header {
  padding: 10px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #c1c1c1;
  box-shadow: 0 2px 4px rgba(193, 193, 193, 0.6);
}
.logo {
  display: block;
  max-width: 150px;
  max-height: 50px;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
nav .navigation {
  display: flex;
  gap: 32px;
}
.link-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  border-radius: 10px;
}
.link-wrapper p {
  font-family: Roboto;
  font-weight: 300;
  font-size: 14px;
  color: #454545;
}

.link-wrapper img {
  width: 20px;
  height: 20px;
}
/* .router-link-active .link-wrapper,
a:active .link-wrapper {
  border: 1px solid #BCC5FF;
} */

a {
  text-decoration: none;
  border-radius: 10px;
  display: block;
}

a:not(.logo):hover {
  background-color: #bcc5ff;
}

@media (max-width: 600px) {
  header {
    padding: 5px 8px;
  }
}
</style>
