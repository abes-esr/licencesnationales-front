import { defineStore } from "pinia";
import Publisher from "@/entity/Publisher";
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useAuthStore } from "./useAuthStore";

const publisherService = usePublisherService();

export const usePublisherStore = defineStore("publisher", {
  state: () => ({
    currentPublisher: new Publisher()
  }),

  getters: {
    getCurrentPublisher(state) {
      const e = new Publisher();
      Object.assign(e, state.currentPublisher);
      return e;
    }
  },

  actions: {
    async setCurrentPublisher(value: Publisher): Promise<boolean> {
      const auth = useAuthStore();

      if (value.id === -999) {
        this.currentPublisher = value;
        return true;
      }

      try {
        const ed = await publisherService.getPublisher(value.id, auth.user.token);
        this.currentPublisher = ed;
        return true;
      } catch (err) {
        throw err;
      }
    }
  },

  persist: true
});


