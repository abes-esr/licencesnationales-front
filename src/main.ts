// import "./utils/hooks";
// import store from "./store";
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueMeta from "vue-meta";
import { Logger } from "@/utils/Logger";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { library } from "@fortawesome/fontawesome-svg-core";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { fas } from "@fortawesome/free-solid-svg-icons";
import App from './App.vue'
import router from '@/router'
import vuetify from './plugins/vuetify'
import { createApp } from "vue";
import { createPinia } from "pinia";
// Handle all Vue errors
/*Vue.config.errorHandler = error =>
  Logger.error(error.message, error.constructor.name);*/


// Création de l'app
const app = createApp(App)

// Création du store
app.use(createPinia())

// Router & plugins
app.use(router)
app.use(vuetify)

// Vue.config.productionTip = false;

// if (process.env.VUE_APP_RECAPTCHA_KEY_SITE == "") {
//   Logger.error("La clé ReCaptcha est vide");
// }

// Vue.use(VueReCaptcha, {
//   siteKey: process.env.VUE_APP_RECAPTCHA_KEY_SITE,
//   loaderOptions: {
//     autoHideBadge: true
//   }
// }).use(VueMeta);

// library.add(fas); // Import de toutes les icones
// Vue.component("font-awesome-icon", FontAwesomeIcon);

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount("#app");

// Monter l'application
app.mount('#app')