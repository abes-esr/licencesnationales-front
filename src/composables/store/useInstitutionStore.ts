import { useInstitutionService } from "@/composables/service/useInstitutionService";
import Institution from "@/entity/Institution";
import InstitutionContact from "@/entity/InstitutionContact";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuthStore";

const institutionService = useInstitutionService();

export const useInstitutionStore = defineStore("institution", {
  state: () => ({
    currentInstitution: new Institution()
  }),

  getters: {
    getCurrentInstitution(state) {
      const et = new Institution();
      Object.assign(et, state.currentInstitution);
      et.dateCreation = new Date(et.dateCreation);

      const contact = new InstitutionContact();
      Object.assign(contact, et.contact);
      et.contact = contact;

      return et;
    }
  },

  actions: {
    async setCurrentInstitution(value: Institution): Promise<boolean> {
      const auth = useAuthStore();

      if (value.id === -999) {
        this.currentInstitution = value;
        return true;
      }

      try {
        const et = await institutionService.getInstitution(value.siren, auth.user.token);
        this.currentInstitution = et;
        return true;
      } catch (err) {
        throw err;
      }
    },

    updateCurrentInstitution(value: Institution) {
      this.currentInstitution = value;
    },

    async setConnectedInstitution(value: Institution): Promise<boolean> {
      const auth = useAuthStore();

      try {
        const et = await institutionService.getInstitution(value.siren, auth.user.token);
        this.currentInstitution = et;
        return true;
      } catch (err) {
        throw err;
      }
    }
  },

  persist: true
});

