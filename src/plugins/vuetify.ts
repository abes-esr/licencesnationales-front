// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { fr } from "vuetify/locale";
import "vuetify/styles";

const lightTheme = {
  dark: false,
  colors: {
    background: "#f7f9fc",
    surface: "#ffffff",
    "surface-variant": "#e6ebf3",
    primary: "#5e86b1",
    "primary-darken-1": "#2c5c88",
    secondary: "#1f3f5f",
    "secondary-darken-1": "#1f3f5f",
    accent: "#193653",
    error: "#c1121f",
    info: "#1e88e5",
    success: "#2e7d32",
    warning: "#f59e0b",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    "on-surface": "#0f1c2a",
    "on-background": "#0f1c2a"
  },
  variables: {
    "border-color": "#1f3f5f",
    "border-opacity": 0.14,
    "high-emphasis-opacity": 0.9,
    "medium-emphasis-opacity": 0.7,
    "disabled-opacity": 0.42,
    "idle-opacity": 0.05,
    "hover-opacity": 0.06,
    "focus-opacity": 0.14,
    "selected-opacity": 0.1,
    "activated-opacity": 0.12,
    "pressed-opacity": 0.16,
    "dragged-opacity": 0.12,
    "theme-kbd": "#1f3f5f",
    "theme-on-kbd": "#ffffff",
    "theme-code": "#f0f4f9",
    "theme-on-code": "#0f1c2a"
  }
};

const darkTheme = {
  dark: true,
  colors: {
    background: "#0d1a28",
    surface: "#162435",
    "surface-variant": "#22354b",
    primary: "#2c5c88",
    "primary-darken-1": "#1f3f5f",
    secondary: "#1f3f5f",
    "secondary-darken-1": "#1f3f5f",
    accent: "#9fc6ff",
    error: "#ef4444",
    info: "#60a5fa",
    success: "#34d399",
    warning: "#fbbf24",
    "on-primary": "#0f1a28",
    "on-secondary": "#0f1a28",
    "on-surface": "#e5ecf5",
    "on-background": "#e5ecf5"
  },
  variables: {
    "border-color": "#7ca6d4",
    "border-opacity": 0.24,
    "high-emphasis-opacity": 0.92,
    "medium-emphasis-opacity": 0.74,
    "disabled-opacity": 0.5,
    "idle-opacity": 0.06,
    "hover-opacity": 0.1,
    "focus-opacity": 0.14,
    "selected-opacity": 0.16,
    "activated-opacity": 0.18,
    "pressed-opacity": 0.2,
    "dragged-opacity": 0.18,
    "theme-kbd": "#22354b",
    "theme-on-kbd": "#e5ecf5",
    "theme-code": "#0f1a28",
    "theme-on-code": "#e5ecf5"
  }
};

export default createVuetify({
  components,
  directives,
  locale: {
    locale: "fr",
    messages: { fr }
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
      dark: darkTheme
    }
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi }
  }
});
