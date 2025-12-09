<template>
  <v-dialog
    v-model="dialog"
    class="elevation-0 popup"
    :max-width="options.width"
    @keydown.esc="cancel"
  >
    <v-card flat class="confirmPopup">
      <v-card-text class="pa-3 popup-texte">
        <FontAwesomeIcon
          :icon="faTriangleExclamation"
          class="mx-2 fa-2x icone-attention"
        />
        <div v-if="message" class="popup-message" v-html="message"></div>
      </v-card-text>
      <v-card-actions class="pt-0 ma-3">
        <v-spacer></v-spacer>
        <v-btn variant="text" class="bouton-annuler" @click="cancel">
          Annuler
        </v-btn>
        <v-btn
          variant="flat"
          class="bouton-valider"
          :color="options.color"
          @click="agree"
        >
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ConfirmPopupOptions } from "@/core/CommonDefinition";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

type Resolver = (value: boolean) => void;

const dialog = ref(false);
const message = ref("");
const options = reactive<ConfirmPopupOptions>({
  color: "error",
  width: "30vw"
});

const resolver = ref<Resolver | null>(null);
const rejecter = ref<Resolver | null>(null);

const open = (newMessage: string, newOptions?: Partial<ConfirmPopupOptions>) => {
  dialog.value = true;
  message.value = newMessage;
  Object.assign(options, { color: "error", width: "30vw" }, newOptions);

  return new Promise<boolean>((resolve, reject) => {
    resolver.value = resolve;
    rejecter.value = reject;
  });
};

const agree = () => {
  resolver.value?.(true);
  dialog.value = false;
};

const cancel = () => {
  resolver.value?.(false);
  dialog.value = false;
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.icone-attention {
  float: left;
}

.popup-texte {
  border: 0;
}

.popup-message {
  font-size: 1.3rem;
}

.popup-texte div {
  min-height: 1rem;
  white-space: pre-wrap;
}
</style>
