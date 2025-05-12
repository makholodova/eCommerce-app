import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Main",
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import("@/pages/MainPage.vue"),
  },
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
