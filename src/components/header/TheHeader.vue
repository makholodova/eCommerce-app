<script setup lang="ts">
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { computed } from "vue";
import BaseContainer from "@/components/ui/BaseContainer.vue";
import { useAuthStore } from "@/store/useAuthStore";
import { ref, watch } from "vue";

const route = useRoute();
const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const isChecked = ref(false);

watch(
  () => route.fullPath,
  () => {
    isChecked.value = false;
  },
);

function logout(): void {
  authStore.logout();
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
        <input
          id="burger-checkbox"
          v-model="isChecked"
          type="checkbox"
          class="burger-checkbox"
        />
        <label for="burger-checkbox" class="burger"></label>
        <ul class="navigation">
          <router-link v-if="isAuthenticated" :to="{ name: 'User' }">
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
.burger-checkbox {
  display: none;
}
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
  box-shadow: 0 2px 5px rgba(193, 193, 193, 0.6);
}
.header {
  position: relative;
  padding: 0 clamp(16px, 5vw, 80px);
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
.navigation {
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
  .burger-checkbox {
    position: absolute;
    visibility: hidden;
  }
  .burger {
    position: relative;
    z-index: 1;
    cursor: pointer;
    display: block;
    position: relative;
    border: none;
    background: transparent;

    width: 40px;
    height: 26px;
  }
  .burger::before,
  .burger::after {
    content: "";
    left: 0;
    position: absolute;
    display: block;
    width: 100%;
    height: 4px;
    border-radius: 10px;
    background: var(--blue);
  }
  .burger::before {
    top: 0;
    box-shadow: 0 11px 0 var(--blue);
    transition:
      box-shadow 0.3s 0.15s,
      top 0.3s 0.15s,
      transform 0.3s;
  }
  .burger::after {
    bottom: 0;
    transition:
      bottom 0.3s 0.15s,
      transform 0.3s;
  }
  .burger-checkbox:checked + .burger::before {
    top: 11px;
    transform: rotate(45deg);
    box-shadow: 0 6px 0 rgba(0, 0, 0, 0);
    transition:
      box-shadow 0.15s,
      top 0.3s,
      transform 0.3s 0.15s;
  }
  .burger-checkbox:checked + .burger::after {
    bottom: 11px;
    transform: rotate(-45deg);
    transition:
      bottom 0.3s,
      transform 0.3s 0.15s;
  }
  .navigation {
    top: 100%;
    right: 0;
    position: absolute;
    display: grid;
    gap: 12px;
    padding: 42px 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100000;
    background: var(--blue-light);
    list-style-type: none;
    transform: translateX(100%);
    display: none;
    transition: 0.3s;
  }
  .navigation a {
    display: block;
    padding: 8px;
    color: white;
    font-size: 18px;
    text-align: center;
    text-decoration: none;
  }
  .navigation a:hover {
    background: var(--blue-lighter);
  }
  .burger-checkbox:checked ~ .navigation {
    transform: translateX(0);
    display: flex;
    flex-direction: column;
  }
  .header {
    padding: 5px 8px;
    gap: 5px;
  }
}
</style>
