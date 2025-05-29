import { createApp } from "vue";
import "@/assets/styles/normalize.css";
import "@/assets/styles/global.css";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import { useAuthStore } from "./store/useAuthStore";

const app = createApp(App);
app.use(pinia);
app.use(router);

app.mount("#app");
