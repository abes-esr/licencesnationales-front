import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    darkTheme: false
  }),

  getters: {
    isDark: (state) => state.darkTheme
  },

  actions: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
    }
  },

  persist: true
});
