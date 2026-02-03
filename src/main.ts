import { i18n } from "@/i18n";
import router from "@/router";
import moment from "moment";
import "moment/locale/fr";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPersist);
moment.locale("fr");

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(i18n);

const recaptchaKey = import.meta.env.VITE_APP_RECAPTCHA_KEY_SITE;
app.use(VueReCaptcha, {
  siteKey: recaptchaKey,
  loaderOptions: { autoHideBadge: true }
});

app.mount("#app");
