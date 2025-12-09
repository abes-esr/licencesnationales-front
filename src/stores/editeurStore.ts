import { defineStore } from "pinia";
import Editeur from "@/core/Editeur";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import { useAuthStore } from "./authStore";

export const useEditeurStore = defineStore("editeur", {
  state: () => ({
    currentEditeur: new Editeur()
  }),

  getters: {
    getCurrentEditeur(state) {
      const e = new Editeur();
      Object.assign(e, state.currentEditeur);
      return e;
    }
  },

  actions: {
    async setCurrentEditeur(value: Editeur): Promise<boolean> {
      const auth = useAuthStore();

      if (value.id === -999) {
        this.currentEditeur = value;
        return true;
      }

      try {
        const ed = await editeurService.getEditeur(value.id, auth.user.token);
        this.currentEditeur = ed;
        return true;
      } catch (err) {
        throw err;
      }
    }
  },

  persist: true
});
