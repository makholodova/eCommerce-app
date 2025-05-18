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
    meta: { requires: "unAuth" },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/RegistrationPage.vue"),
    meta: { requires: "unAuth" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFoundPage",
    component: () => import("@/pages/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
