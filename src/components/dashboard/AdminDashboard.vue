<template>
  <DashboardNotifications :is-admin="true" :loading="loading" :admin-items="notificationsAdmin"
    :user-items="notificationsUser" :on-institution-click="onInstitutionClick" />
  <DashboardPublishers :dates="sendDates" :loading="loading" :on-send="onSendPublishers" />
</template>

<script setup lang="ts">
import { Notification } from "@/entity/Notification";
import DashboardNotifications from "./DashboardNotifications.vue";
import DashboardPublishers from "./DashboardPublishers.vue";

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

defineProps<{
  loading: boolean;
  notificationsAdmin: Array<Notification>;
  notificationsUser: Array<NotificationUser>;
  sendDates: string[];
  onSendPublishers: () => void | Promise<void>;
  onInstitutionClick: (siren: string) => void | Promise<void>;
}>();
</script>
