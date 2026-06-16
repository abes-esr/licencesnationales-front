<template>
  <DashboardInstitutionCard :institution="institution" :is-compact="isCompact" />
  <DashboardContactCard :contact="institution.contact" />
  <DashboardNotifications :is-admin="false" :loading="loading" :admin-items="notificationsAdmin"
    :user-items="notificationsUser" :on-institution-click="onInstitutionClick" />
</template>

<script setup lang="ts">
import Institution from "@/entity/Institution";
import { Notification } from "@/entity/Notification";
import DashboardContactCard from "./DashboardContactCard.vue";
import DashboardInstitutionCard from "./DashboardInstitutionCard.vue";
import DashboardNotifications from "./DashboardNotifications.vue";

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

defineProps<{
  institution: Institution;
  isCompact: boolean;
  loading: boolean;
  notificationsAdmin: Array<Notification>;
  notificationsUser: Array<NotificationUser>;
  onInstitutionClick: (siren: string) => void | Promise<void>;
}>();
</script>
