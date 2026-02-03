import { useInstitutionService } from "@/composables/service/useInstitutionService";
import Institution from "@/entity/Institution";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuthStore";

const institutionService = useInstitutionService();

export const useInstitutionStore = defineStore("institution", {
  state: () => ({
    currentInstitution: new Institution()
  }),

  getters: {},

  actions: {
    async setCurrentInstitution(value: Institution): Promise<boolean> {
      const auth = useAuthStore();

      if (value.id === -999) {
        this.currentInstitution = value;
      } else {
        this.currentInstitution = await institutionService.getInstitution(
          value.siren,
          auth.user.token
        );
      }

      return true;
    },

    updateCurrentInstitution(value: Institution) {
      this.currentInstitution = value;
    }
  },

  persist: true
});
