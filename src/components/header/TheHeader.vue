<script setup lang="ts">
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { computed } from "vue";
import BaseContainer from "@/components/ui/BaseContainer.vue";
import { useAuthStore } from "@/store/useAuthStore";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { checkValidSession } from "@/utils/validSession";
import { useCartStore } from "@/store/useCartStore";

const route = useRoute();
const authStore = useAuthStore();
const router = useRouter();
const cartStore = useCartStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isChecked = ref(false);
const headerRef = ref<HTMLElement | null>(null);

function updateHeaderHeightCSSVar(): void {
  if (headerRef.value) {
    const height = headerRef.value.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      "--dynamic-header-height",
      `${height}px`,
    );
  }
}

onMounted(async () => {
  await nextTick();
  updateHeaderHeightCSSVar();
  window.addEventListener("resize", updateHeaderHeightCSSVar);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeaderHeightCSSVar);
});

watch(
  () => route.fullPath,
  () => {
    isChecked.value = false;
  },
);

async function logout(): Promise<void> {
  authStore.logout();

  try {
    await checkValidSession();
  } catch (error) {
    console.error(error);
  }

  router.push({ name: "Main" });
}
</script>

<template>
  <header ref="headerRef">
    <BaseContainer class="header">
      <router-link :to="{ name: 'Main' }" class="logo">
        <img src="@/assets/icons/header-icons/logo.png" alt="logo" />
      </router-link>
      <div class="menu-wrapper">
        <router-link :to="{ name: 'Cart' }">
          <div class="link-wrapper">
            <div class="cart-icon-wrapper">
              <img
                src="@/assets/icons/header-icons/cart.png"
                alt="cart"
                class="icon"
              />
              <div v-if="cartStore.totalItems > 0" class="cart-total-counter">
                {{ cartStore.totalItems }}
              </div>
            </div>

            <p class="icon-description">Корзина</p>
          </div>
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
            <router-link :to="{ name: 'About' }">
              <div class="link-wrapper">
                <img
                  src="@/assets/icons/header-icons/about-us.png"
                  alt="about us"
                  class="icon"
                />
                <p class="icon-description">О нас</p>
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
      </div>
    </BaseContainer>
  </header>
</template>

<style scoped>
.menu-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}
.burger-checkbox {
  display: none;
}
.cart-icon-wrapper {
  position: relative;
  z-index: 100;
}
.cart-total-counter {
  position: absolute;
  top: -8px;
  right: -12px;
  display: flex;
  justify-content: center;
  background-color: var(--blue);
  align-items: center;
  padding: 2px;
  color: white;
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  padding: 5px;
  z-index: 1000;
  font-size: 8px;
  font-weight: bold;
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
  padding: 10px clamp(16px, 5vw, 80px);
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
  margin-bottom: 5px;
}
a {
  text-decoration: none;
  border-radius: 10px;
  display: block;
  text-transform: none;
}
@media (max-width: 650px) {
  .burger-checkbox {
    position: absolute;
    visibility: hidden;
  }
  .burger {
    position: relative;
    z-index: 1;
    cursor: pointer;
    display: block;
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
    position: absolute;
    right: 0;
    top: var(--dynamic-header-height);
    height: calc(100vh - var(--dynamic-header-height));
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--blue-light);
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
    transform: translateX(-100%);
  }

  .burger-checkbox:checked ~ .navigation {
    opacity: 1;
    transform: translateX(0);
  }
  .navigation a {
    padding: 8px;
    color: white;
    font-size: 18px;
    text-align: center;
    text-decoration: none;
  }

  .navigation a:hover {
    background: var(--blue-lighter);
  }
  .header {
    padding: 5px 8px;
    gap: 5px;
  }
}
</style>
