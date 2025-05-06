import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegistrationPage from "../pages/RegistrationPage.vue";

const routes = [
  { path: "/", name: "Main", component: MainPage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/register", name: "Register", component: RegistrationPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
