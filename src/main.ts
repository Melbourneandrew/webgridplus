import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import router from "./router";
const app = createApp(App);

app.use(PrimeVue, {
  theme: "none",
});

app.use(router);

app.mount("#app");
