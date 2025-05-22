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
  {
    path: "/catalog",
    name: "Catalog",
    component: () => import("@/pages/CatalogPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user?.isAuthenticated && to.name === "Login") {
    return next({ name: "Main" });
  }
  next();
});

export default router;
