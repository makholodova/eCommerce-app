import { createApp } from "vue";
import "@/assets/styles/normalize.css";
import "@/assets/styles/global.css";
import App from "./App.vue";
import pinia from "./store";
import router from "./router";
import { checkValidSession } from "./utils/validSession";
import { apiRoot } from "./api/commercetools/buildClient";

(async (): Promise<void> => {
  const app = createApp(App);
  app.use(pinia);
  app.use(router);

  try {
    await checkValidSession();
    await apiRoot.categories().get().execute();
  } catch (error) {
    console.error("Ошибка при инициализации сессии", error);
  }

  app.mount("#app");
})();
