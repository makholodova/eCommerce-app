<script setup lang="ts">
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useTokenStore } from "@/store/useTokenStore";
import { computed } from "vue";
import BaseContainer from "@/components/ui/BaseContainer.vue";

const route = useRoute();
const token = useTokenStore();
const router = useRouter();

const isAuthenticated = computed(() => token.isAuthenticated);

function logout(): void {
  token.logout();
  router.push({ name: "Main" });
}
</script>

<template>
  <header>
    <BaseContainer class="header">
      <router-link :to="{ name: 'Main' }" class="logo">
        <img src="@/assets/icons/header-icons/logo.png" alt="logo" />
      </router-link>
      <nav>
        <ul class="navigation">
          <router-link :to="{ name: 'User' }">
            <div class="link-wrapper">
              <img
                src="@/assets/icons/header-icons/profile.png"
                alt="user profile"
                class="icon"
              />
              <p class="icon-description">Профиль</p>
            </div>
          </router-link>
          <router-link :to="{ name: 'Catalog' }">
            <div class="link-wrapper">
              <img
                src="@/assets/icons/header-icons/catalog.png"
                alt="catalog"
                class="icon"
              />
              <p class="icon-description">Каталог</p>
            </div>
          </router-link>
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
    </BaseContainer>
  </header>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  a:not(.logo):hover {
    background-color: #bcc5ff;
  }
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
header {
  width: 100%;
  border-bottom: 1px solid #c1c1c1;
  box-shadow: 0 2px 4px rgba(193, 193, 193, 0.6);
}
.header {
  padding: 10px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: block;
  min-width: 150px;
  height: 50px;
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
a {
  text-decoration: none;
  border-radius: 10px;
  display: block;
}
@media (max-width: 600px) {
  .header {
    padding: 5px 8px;
    justify-content: center;
    gap: 5px;
  }
  nav .navigation {
    gap: 5px;
  }
}
</style>
