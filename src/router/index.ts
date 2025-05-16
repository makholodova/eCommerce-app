/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Main",
    component: () => import("@/pages/MainPage.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/RegistrationPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (
    user?.isAuthenticated &&
    (to.name === "Login" || to.name === "Register")
  ) {
    return next({ name: "Main" });
  }
  next();
});

export default router;
