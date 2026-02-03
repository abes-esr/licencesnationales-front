<template>
  <v-dialog v-model="isOpen" class="elevation-0 popup" :max-width="popupOptions.width" @keydown.esc="cancel">
    <v-card flat class="confirmPopup">
      <v-card-text class="pa-4 popup-texte">
        <FontAwesomeIcon :icon="faTriangleExclamation" class="mx-2 fa-2x icone-attention" />
        <div v-if="htmlMessage" class="popup-message" v-html="htmlMessage"></div>
      </v-card-text>
      <v-card-actions class="pt-0 ma-3">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" class="bouton-annuler" @click="cancel">
          {{ $t("common.confirm.cancel") }}
        </v-btn>
        <v-btn variant="flat" class="bouton-valider" :color="popupOptions.color" @click="agree">
          {{ $t("common.confirm.confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { reactive, ref } from "vue";

interface ConfirmPopupOptions {
  color: string;
  width: string;
}

type Resolver = (value: boolean) => void;

const isOpen = ref(false);
const htmlMessage = ref("");
const popupOptions = reactive<ConfirmPopupOptions>({
  color: "success",
  width: "40vw"
});

const resolveRef = ref<Resolver | null>(null);

const open = (message: string, options?: Partial<ConfirmPopupOptions>) => {
  isOpen.value = true;
  htmlMessage.value = message;
  Object.assign(popupOptions, { color: "success", width: "40vw" }, options);

  return new Promise<boolean>(resolve => {
    resolveRef.value = resolve;
  });
};

const agree = () => {
  resolveRef.value?.(true);
  isOpen.value = false;
};

const cancel = () => {
  resolveRef.value?.(false);
  isOpen.value = false;
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.icone-attention {
  float: left;
  color: #f28c28;
}

.popup-texte {
  border: 0;
}

.confirmPopup {
  border: 1px solid #cfd3d7;
  border-radius: 12px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
}

.popup-message {
  font-size: 1.3rem;
  line-height: 1.5;
}

.popup-texte div {
  min-height: 1rem;
  white-space: pre-wrap;
}
</style>
