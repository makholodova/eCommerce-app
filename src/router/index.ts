import { createRouter, createWebHistory } from "vue-router";

import MainPage from "@/pages/MainPage.vue";

const routes = [
  { path: "/", name: "Main", component: MainPage },
  {
    path: "/login",
    name: "Login",
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import("@/pages/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import("@/pages/RegistrationPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
