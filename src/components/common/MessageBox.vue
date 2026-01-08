<template>
  <v-alert
    :color="getSnackbarColor"
    v-model="snackbarDisplayValue"
    :class="getSnackbarMultiline ? 'multi-line elevation-1 mt-4 mb-4' : 'elevation-1 mt-4 mb-4'"
    id="messageBox"
  >
    <div class="d-flex">

  <div class="d-flex align-center flex-grow-1">
    <FontAwesomeIcon
      v-if="getSnackbarType == MessageType.ERREUR"
      :icon="faBan"
      class="fa-lg mr-5 mb-1 mt-2 icone-erreur"
    />
    <FontAwesomeIcon
      v-if="getSnackbarType == MessageType.VALIDATION"
      :icon="faCircleCheck"
      class="fa-lg mr-5 mb-1 mt-2 icone-validation"
    />
    <FontAwesomeIcon
      v-if="getSnackbarType == MessageType.AVERTISSEMENT"
      :icon="faTriangleExclamation"
      class="fa-lg mr-5 mb-1 mt-2 icone-avertissement"
    />
    <FontAwesomeIcon
      v-if="getSnackbarType == MessageType.INFORMATION"
      :icon="faCircleInfo"
      class="fa-lg mr-5 mb-1 mt-2 icone-information"
    />
    <span v-for="m in getSnackbarText" v-bind:key="m" v-html="m"></span>
</div>
      <v-btn
        :color="getSnackbarColor"
        icon
        variant="text"
        @click="closeSnackBar()"
      >
        <FontAwesomeIcon
          :icon="faXmark"
          class="fa-lg mx-2 icone-fermer"
        />
      </v-btn>
    </div>

  </v-alert>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMessageStore } from "@/stores/messageStore"; // à adapter si ton store a un autre nom
import { MessageType } from "@/core/CommonDefinition";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBan,
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
  faXmark
} from "@fortawesome/free-solid-svg-icons";

// Store Pinia
const messageStore = useMessageStore();

// Accès centralisé au message affiché
const displayedMessage = computed(() => messageStore.getDisplayedMessage);

// Type local pour le template
const MessageTypeLocal = MessageType;

// Couleur du snackbar
const getSnackbarColor = computed(() => {
  const type = displayedMessage.value.type;

  switch (type) {
    case MessageType.ERREUR:
      return "erreur";
    case MessageType.AVERTISSEMENT:
      return "avertissement";
    case MessageType.INFORMATION:
      return "information";
    case MessageType.VALIDATION:
      return "validation";
    default:
      return "information";
  }
});

// Affichage + fermeture auto si non sticky
const snackbarDisplayValue = computed(() => {
  if (!displayedMessage.value.isSticky) {
    setTimeout(() => {
      closeSnackBar();
    }, 6000);
  }
  return displayedMessage.value.isDisplayed;
});

// Multi-ligne ?
const getSnackbarMultiline = computed(() => {
  return displayedMessage.value.isMultiline;
});

// Texte (split par retour à la ligne)
const getSnackbarText = computed(() => {
  return displayedMessage.value.texte.split("\n");
});

// Retourne le type
const getSnackbarType = computed(() => {
  return displayedMessage.value.type;
});

// Fermeture
function closeSnackBar() {
  messageStore.closeDisplayedMessage();
}
</script>


<style scoped>
.multi-line span {
  min-height: 1rem;
}

.v-alert {
  word-break: normal !important;
}
</style>
