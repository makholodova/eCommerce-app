/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";

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
    props: true,
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/pages/UserPage.vue"),
    meta: { requires: "Auth" },
  },
  {
    path: "/catalog/:category",
    name: "CatalogCategory",
    component: () => import("@/pages/CatalogProductsPage.vue"),
    props: true,
  },
  {
    path: "/product/:productId",
    name: "Product",
    component: () => import("@/pages/ProductPage.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated && to.name === "Login") {
    return next({ name: "Main" });
  }
  next();
});

export default router;
