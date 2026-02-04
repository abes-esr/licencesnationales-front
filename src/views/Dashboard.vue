<template>
  <v-container>
    <h1>
      {{ $t("dashboard.title") }} <span v-if="!isAdmin">{{ connectedInstitution.name }}</span>
    </h1>
    <ConfirmPopup ref="confirmRef"></ConfirmPopup>
    <v-card class="pt-0 elevation-0" :class="[display.lgAndDown.value ? 'large-container' : '']">
      <v-card-text class="fondGris pa-0 px-6 pb-6">
        <DashboardAccountInfo :created-at="dayjs(connectedInstitution.createdAt).format('DD/MM/YYYY')"
          :loading="loading" :on-download="downloadInstitution" />
        <v-row class="d-flex justify-space-between flex-wrap pt-3">
          <InstitutionDashboard v-if="!isAdmin" :institution="connectedInstitution"
            :is-compact="display.mdAndDown.value" :loading="globalLoading" :notifications-admin="notificationsAdmin"
            :notifications-user="notificationsUser" :on-institution-click="goToInstitutionPage" />
          <AdminDashboard v-else :loading="globalLoading" :notifications-admin="notificationsAdmin"
            :notifications-user="notificationsUser" :send-dates="sendDates" :on-send-publishers="sendPublishers"
            :on-institution-click="goToInstitutionPage" />
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import AdminDashboard from "@/components/dashboard/AdminDashboard.vue";
import DashboardAccountInfo from "@/components/dashboard/DashboardAccountInfo.vue";
import InstitutionDashboard from "@/components/dashboard/InstitutionDashboard.vue";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useLoading } from "@/composables/useLoading";
import { usePageMeta } from "@/composables/usePageMeta";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { Notification } from "@/entity/Notification";
import { RouteName } from "@/router";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

const display = useDisplay();
const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const snackbar = useSnackbar();
const publisherService = usePublisherService();
const institutionService = useInstitutionService();
const { t } = useI18n();
const { isAdmin, user, token, userSiren, connectedInstitution } = storeToRefs(authStore);

usePageMeta({
  titleKey: "dashboard.meta.title",
  descriptionKey: "dashboard.meta.description"
});

const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const {
  loading,
  startLoading: startExportLoading,
  stopLoading: stopExportLoading
} = useLoading();
const notificationsAdmin = ref<Array<Notification>>([]);
const notificationsUser = ref<Array<NotificationUser>>([]);
const sendDates = ref<Array<string>>([]);
const router = useRouter();
const {
  loading: globalLoading,
  startLoading: startGlobalLoading,
  stopLoading: stopGlobalLoading
} = useLoading();

const downloadInstitution = async (): Promise<void> => {
  try {
    startExportLoading();
    const siren = [user.value.siren];
    const response = await institutionService.downloadInstitutions(siren, user.value.token);
    const fileURL = URL.createObjectURL(
      new Blob([response.data], { type: "application/csv" })
    );
    const fileLink = document.createElement("a");

    fileLink.href = fileURL;
    fileLink.setAttribute("download", "export.csv");
    document.body.appendChild(fileLink);

    fileLink.click();
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    stopExportLoading();
  }
};

const goToInstitutionPage = async (siren: string) => {
  const institution = new Institution();
  institution.siren = siren;
  institution.id = -999;
  await institutionStore.setCurrentInstitution(institution);
  router.push({ name: RouteName.InstitutionView });
};

const sendPublishers = async () => {
  const confirmed = await confirmRef.value?.open(t("dashboard.publishers.confirm"));
  if (confirmed) {
    try {
      const response = await publisherService.sendPublishers(token.value);
      snackbar.success(response.data.message);
    } catch (err: any) {
      snackbar.error(err);
    }
  }
};

onMounted(async () => {
  startGlobalLoading();
  try {
    const notificationsPromise = isAdmin.value
      ? institutionService.getAdminNotifications(token.value)
      : institutionService.getInstitutionNotifications(userSiren.value, token.value);

    const datesPromise = isAdmin.value
      ? publisherService.getPublisherSendDates(token.value)
      : Promise.resolve({ data: [] as Array<string> });

    const [notificationsResult, datesResult] = await Promise.all([
      notificationsPromise,
      datesPromise
    ]);

    if (isAdmin.value) {
      notificationsAdmin.value = notificationsResult as Array<Notification>;
      notificationsUser.value = [];
    } else {
      notificationsUser.value = notificationsResult as Array<NotificationUser>;
      notificationsAdmin.value = [];
    }

    sendDates.value = (datesResult as { data: Array<string> }).data.map(date =>
      `${t("dashboard.publishers.sentOn")} ${dayjs(date).format("DD/MM/YYYY HH:mm")} ${t("dashboard.publishers.sentAgo")} ${dayjs(date).fromNow()}`
    );
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    stopGlobalLoading();
  }
});
</script>
<style scoped lang="scss">
.large-container {
  max-width: 150% !important;
}
</style>
