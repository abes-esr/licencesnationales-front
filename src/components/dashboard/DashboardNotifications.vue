<template>
  <v-col cols="12" md="12" lg="12" xl="6">
    <div class="borderCol fondBlanc card-full">
      <v-card-title class="d-block titre-block title-tight">
        <FontAwesomeIcon :icon="faBell" class="fa-lg mx-2 icone-standard" />
        <span v-if="isAdmin">{{ $t("dashboard.notifications.adminTitle") }}</span>
        <span v-else>{{ $t("dashboard.notifications.userTitle") }}</span>
      </v-card-title>
      <v-card-text class="d-flex align-content-start flex-wrap notifs no-border">
        <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
          <div v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <ul v-if="isAdmin">
            <li style="margin-bottom: 1em" v-for="item in adminItems" :key="item.index">
              {{ $t("dashboard.notifications.siren") }} {{ item.siren }}<br />
              {{ $t("dashboard.notifications.institutionName") }}
              <a @click="onInstitutionClick(item.siren)">{{ item.institutionName }}</a><br />
              {{ $t("dashboard.notifications.event") }} {{ item.notificationType }}<br />
              {{ $t("dashboard.notifications.date") }} {{ moment(item.eventDate).format('DD/MM/YYYY') }}
            </li>
          </ul>
          <ul v-else>
            <li style="margin-bottom: 1em" v-for="item in userItems" :key="item.index">
              <span class="notifUserMsg" v-html="item.message"></span>
              <br />
              <span class="notifUserDesc" v-html="item.description"></span>
            </li>
          </ul>
        </div>
      </v-card-text>
    </div>
  </v-col>
</template>

<script setup lang="ts">
import { Notification } from "@/entity/Notification";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment";
import { useI18n } from "vue-i18n";

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

defineProps<{
  isAdmin: boolean;
  loading: boolean;
  adminItems: Array<Notification>;
  userItems: Array<NotificationUser>;
  onInstitutionClick: (siren: string) => void | Promise<void>;
}>();

useI18n();
</script>

<style scoped lang="scss" src="./dashboard.scss"></style>
