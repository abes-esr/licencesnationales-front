import { usePublisherService } from "@/composables/service/usePublisherService";
import Publisher from "@/entity/Publisher";
import { defineStore } from "pinia";
import { useAuthStore } from "./useAuthStore";

const publisherService = usePublisherService();

export const usePublisherStore = defineStore("publisher", {
  state: () => ({
    currentPublisher: new Publisher()
  }),

  getters: {},

  actions: {
    async setCurrentPublisher(value: Publisher): Promise<boolean> {
      const auth = useAuthStore();

      if (value.id === -999) {
        this.currentPublisher = value;
      } else {
        this.currentPublisher = await publisherService.getPublisher(value.id, auth.user.token);
      }

      return true;
    }
  },

  persist: true
});
