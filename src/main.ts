import { createApp } from "vue";
import "@/assets/styles/normalize.css";
import "@/assets/styles/global.css";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import { useTokenStore } from "./store/useTokenStore";

const app = createApp(App);
app.use(pinia);
app.use(router);

app.mount("#app");

router.beforeEach((to, _, next): void => {
  const store = useTokenStore();

  if (to.meta.requires === "unAuth" && store.isAddedToLocalStorage()) {
    return next({ name: "Main" });
  }

  next();
});
