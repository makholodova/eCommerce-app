import { createApp } from "vue";
import "@/assets/styles/normalize.css";
import "@/assets/styles/global.css";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import { useAuthStore } from "./store/useAuthStore";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
app.use(pinia);
app.use(router);
pinia.use(piniaPluginPersistedstate);

app.mount("#app");

router.beforeEach(async (to, _, next): Promise<void> => {
  const authStore = useAuthStore();

  if (to.meta.requires === "unAuth" && authStore.isAuthenticated) {
    return next({ name: "Main" });
  }

  next();
});
