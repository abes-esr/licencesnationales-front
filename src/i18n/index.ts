import dayjs from "dayjs";
import { createI18n } from "vue-i18n";

export const i18n = createI18n({
  legacy: false,
  locale: "fr",
  fallbackLocale: "fr",
  messages: {},
  globalInjection: true
});

export async function loadLocaleMessages(locale = "fr") {
  if (i18n.global.availableLocales.includes(locale)) {
    i18n.global.locale.value = locale;
    dayjs.locale(locale);
    return;
  }

  if (locale === "fr") {
    const { fr } = await import("./fr");
    await import("dayjs/locale/fr");
    i18n.global.setLocaleMessage("fr", fr);
    i18n.global.locale.value = "fr";
    dayjs.locale("fr");
    return;
  }

  i18n.global.locale.value = "fr";
  dayjs.locale("fr");
}
