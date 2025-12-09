import { defineStore } from "pinia";
import Etablissement from "@/core/Etablissement";
import ContactEtablissement from "@/core/ContactEtablissement";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { useAuthStore } from "./authStore";

export const useEtablissementStore = defineStore("etablissement", {
  state: () => ({
    currentEtablissement: new Etablissement()
  }),

  getters: {
    getCurrentEtablissement(state) {
      const et = new Etablissement();
      Object.assign(et, state.currentEtablissement);
      et.dateCreation = new Date(et.dateCreation);

      const contact = new ContactEtablissement();
      Object.assign(contact, et.contact);
      et.contact = contact;

      return et;
    }
  },

  actions: {
    async setCurrentEtablissement(value: Etablissement): Promise<boolean> {
      const auth = useAuthStore();

      if (value.id === -999) {
        this.currentEtablissement = value;
        return true;
      }

      try {
        const et = await etablissementService.getEtablissement(
          value.siren,
          auth.user.token
        );
        this.currentEtablissement = et;
        return true;
      } catch (err) {
        throw err;
      }
    },

    updateCurrentEtablissement(value: Etablissement) {
      this.currentEtablissement = value;
    },

    async setEtablissementConnecte(value: Etablissement): Promise<boolean> {
      const auth = useAuthStore();

      try {
        const et = await etablissementService.getEtablissement(
          value.siren,
          auth.user.token
        );
        this.currentEtablissement = et;
        return true;
      } catch (err) {
        throw err;
      }
    }
  },

  persist: true
});
