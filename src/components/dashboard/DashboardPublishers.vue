<template>
  <v-col cols="12" md="12" lg="12" xl="6">
    <div class="borderCol fondBlanc card-full card-relative">
      <v-card-title class="d-block titre-block title-tight">
        <FontAwesomeIcon :icon="faPaperPlane" class="fa-lg mx-2" />
        {{ $t("dashboard.publishers.title") }}
      </v-card-title>
      <v-card-text class="no-border dates">
        <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
          <div v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <ul class="datesList">
            <li style="margin-bottom: 0.5em" v-for="item in dates" :key="item">
              <span v-html="item"></span>
            </li>
          </ul>
        </div>
        <div class="w-100 d-flex justify-end">
          <v-btn @click="onSend" class="ma-4">{{ $t("dashboard.publishers.send") }}</v-btn>
        </div>
      </v-card-text>
    </div>
  </v-col>
</template>

<script setup lang="ts">
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useI18n } from "vue-i18n";

defineProps<{
  dates: string[];
  loading: boolean;
  onSend: () => void | Promise<void>;
}>();

useI18n();
</script>

<style scoped lang="scss" src="./dashboard.scss"></style>
