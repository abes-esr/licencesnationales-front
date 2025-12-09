import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    darkTheme: false,
    creationCompteEffectuee: false
  }),

  getters: {
    isDark: (state) => state.darkTheme,
    creationCompteEffectueeValue: (state) => state.creationCompteEffectuee
  },

  actions: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
    },

    setCreationCompteTrue() {
      this.creationCompteEffectuee = true;
    },

    setCreationCompteFalse() {
      this.creationCompteEffectuee = false;
    }
  },

  persist: true
});
