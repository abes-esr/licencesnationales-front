import { i18n, loadLocaleMessages } from "@/i18n";
import router from "@/router";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPersist);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

await loadLocaleMessages("fr");

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
