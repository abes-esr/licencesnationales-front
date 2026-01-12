<template>
  <v-snackbar v-model="isOpen" :color="snackbarColor" :timeout="snackbarTimeout" :multi-line="isMultiline">
    <div class="d-flex">
      <div class="d-flex align-center flex-grow-1">
        <FontAwesomeIcon v-if="snackbarType === MessageType.ERREUR" :icon="faBan"
          class="fa-lg mr-5 mb-1 mt-2 icone-erreur" />
        <FontAwesomeIcon v-if="snackbarType === MessageType.VALIDATION" :icon="faCircleCheck"
          class="fa-lg mr-5 mb-1 mt-2 icone-validation" />
        <FontAwesomeIcon v-if="snackbarType === MessageType.AVERTISSEMENT" :icon="faTriangleExclamation"
          class="fa-lg mr-5 mb-1 mt-2 icone-avertissement" />
        <FontAwesomeIcon v-if="snackbarType === MessageType.INFORMATION" :icon="faCircleInfo"
          class="fa-lg mr-5 mb-1 mt-2 icone-information" />
        <span v-for="m in snackbarText" :key="m" v-html="m"></span>
      </div>
      <v-btn :color="snackbarColor" icon variant="text" @click="hide">
        <FontAwesomeIcon :icon="faXmark" class="fa-lg mx-2 icone-fermer" />
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { snackbarState, useSnackbar } from "@/composables/useSnackbar";
import { MessageType } from "@/core/CommonDefinition";
import {
  faBan,
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

const { hide } = useSnackbar();
const state = snackbarState;

const snackbarColor = computed(() => {
  const type = state.type;
  switch (type) {
    case MessageType.ERREUR:
      return "error";
    case MessageType.AVERTISSEMENT:
      return "warning";
    case MessageType.INFORMATION:
      return "info";
    case MessageType.VALIDATION:
      return "success";
    default:
      return "info";
  }
});

const isOpen = computed({
  get: () => state.isDisplayed,
  set: value => {
    if (!value) {
      hide();
    }
  }
});

const snackbarTimeout = computed(() => {
  return state.sticky ? -1 : 6000;
});

const isMultiline = computed(() => state.multiline);
const snackbarText = computed(() => state.text.split("\n"));
const snackbarType = computed(() => state.type);

</script>

<style scoped>
.multi-line span {
  min-height: 1rem;
}

.v-snackbar {
  word-break: normal !important;
}
</style>
