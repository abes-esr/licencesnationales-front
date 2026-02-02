<template>
  <v-card-title class="px-0 pb-2 d-flex align-center flex-wrap">
    <v-btn variant="text" class="bouton-simple" @click="onDownload" :loading="loading">
      <h2 class="mb-0">{{ $t("dashboard.accountInfo") }}</h2>
      <FontAwesomeIcon :icon="faDownload" size="lg" class="mx-2" />
    </v-btn>
  </v-card-title>
  <span class="pl-4">{{ $t("dashboard.accountCreatedOn") }} {{ createdAt }}</span>
</template>

<script setup lang="ts">
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useI18n } from "vue-i18n";

defineProps<{
  createdAt: string;
  loading: boolean;
  onDownload: () => void | Promise<void>;
}>();

useI18n();
</script>
