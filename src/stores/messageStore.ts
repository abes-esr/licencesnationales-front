import { defineStore } from "pinia";
import { Message } from "@/core/CommonDefinition";

export const useMessageStore = defineStore("message", {
  state: () => ({
    message: new Message()
  }),

  getters: {
    getDisplayedMessage: (state): Message => {
      const m = new Message();
      Object.assign(m, state.message);
      return m;
    }
  },

  actions: {
    openDisplayedMessage(value: Message) {
      this.message.isDisplayed = true;
      this.message.isSticky = value.isSticky;
      this.message.isMultiline = value.isMultiline;
      this.message.type = value.type;
      this.message.texte = value.texte;
    },

    closeDisplayedMessage() {
      this.message.isDisplayed = false;
    }
  },

  persist: true
});
