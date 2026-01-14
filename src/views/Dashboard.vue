<template>
  <v-container>
    <h1>
      {{ $t("dashboard.title") }} <span v-if="!isAdmin">{{ institution.name }}</span>
    </h1>
    <ConfirmPopup ref="confirmRef"></ConfirmPopup>
    <v-card class="pt-0 elevation-0" :class="[display.lgAndDown.value ? 'large-container' : '']">
      <v-card-text class="fondGris pa-0 px-6 pb-6">
        <v-card-title class="px-0 pb-2">
          {{ $t("dashboard.accountInfo") }}
          <v-tooltip :text="$t('dashboard.exportAccountInfo')" location="top" open-delay="100" theme="dark"
            content-class="text-white">
            <template v-slot:activator="{ props }">
              <v-btn icon="icon" class="bouton-simple" @click="downloadInstitution()" v-bind="props"
                :loading="isExportLoading">
                <FontAwesomeIcon :icon="faDownload" class="mx-2 fa-lg" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-card-title>
        <span>{{ $t("dashboard.accountCreatedOn") }} {{ institution.createdAt.toLocaleDateString() }}</span>
        <v-row class="d-flex justify-space-between flex-wrap pt-3">
          <v-col cols="12" md="3" lg="3" xl="3" v-if="!isAdmin">
            <div style="height: 100%; position:relative;" class="borderCol fondBlanc"
              :class="[display.mdAndDown.value ? 'compact-form' : '']">
              <div class="d-flex">
                <h2 class="my-3 pl-4 mb-0">{{ $t("dashboard.institution.title") }}</h2>
                <v-tooltip :text="$t('dashboard.institution.readonly')" location="top" open-delay="100" theme="dark"
                  content-class="text-white" v-if="!isAdmin">
                  <template v-slot:activator="{ props }">
                    <FontAwesomeIcon v-bind="props" :icon="faLock" class="fa-2x mx-2"
                      style="margin-top: 10px; position: absolute; right: 0;" />
                  </template>
                </v-tooltip>
              </div>
              <v-card-text class="d-flex align-content-start flex-wrap pt-0 no-border">
                <div class="d-flex flex-column justify-start mx-3 mb-3 mt-0 bloc-info">
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.institution.siren") }}</h3>
                    {{ institution.siren }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.institution.idAbes") }}</h3>
                    {{ institution.abesId }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.institution.name") }}</h3>
                    {{ institution.name }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.institution.type") }}</h3>
                    {{ institution.institutionType }}
                  </div>
                </div>
              </v-card-text>
              <v-alert outlined class="ma-2 pt-1 pb-0" style="position: absolute; bottom: 0; font-size: 14px;">
                <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 icone-information" />
                <p class="mb-0 pl-12">
                  {{ $t("dashboard.institution.contactSupport") }}
                  <a href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank">ABESstp</a>
                </p>
              </v-alert>
            </div>
          </v-col>
          <v-col cols="12" md="3" lg="3" xl="3" v-if="!isAdmin">
            <div style="height: 100%; position: relative;" class="borderCol fondBlanc">
              <div class="d-flex justify-space-between align-center">
                <h2 class="my-3 pl-4 mb-0">{{ $t("dashboard.contact.title") }}</h2>
              </div>
              <v-card-text class="d-flex align-content-start flex-wrap pt-0 no-border">
                <div class="d-flex flex-column justify-start mx-3 mb-3 mt-0 bloc-info">
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.lastName") }}</h3>
                    {{ institution.contact.lastName }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.firstName") }}</h3>
                    {{ institution.contact.firstName }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.phone") }}</h3>
                    {{ institution.contact.phone }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.email") }}</h3>
                    {{ institution.contact.email }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.address") }}</h3>
                    {{ institution.contact.address }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.poBox") }}</h3>
                    {{ institution.contact.poBox }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.postalCode") }}</h3>
                    {{ institution.contact.postalCode }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.city") }}</h3>
                    {{ institution.contact.city }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">{{ $t("dashboard.contact.cedex") }}</h3>
                    {{ institution.contact.cedex }}
                  </div>
                </div>
                <v-row style="position: absolute; bottom: 0; right: 0;" class="text-right pb-4 pr-4">
                  <v-col cols="12">
                    <v-btn variant="tonal" @click="goToProfile()">
                      {{ $t("dashboard.contact.editContact") }}
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-btn variant="tonal" @click="goToPasswordUpdate()">
                      {{ $t("dashboard.contact.editPassword") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <div style="height: 100%" class="borderCol fondBlanc">
              <v-card-title class="d-block titre-block" style="margin-bottom:-4px;">
                <FontAwesomeIcon :icon="faBell" class="fa-lg mx-2 icone-standard" />
                <span v-if="isAdmin">{{ $t("dashboard.notifications.adminTitle") }}</span>
                <span v-else>{{ $t("dashboard.notifications.userTitle") }}</span>
              </v-card-title>
              <v-card-text class="d-flex align-content-start flex-wrap notifs no-border">
                <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
                  <div v-if="notificationsLoading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                  <ul>
                    <li style="margin-bottom: 1em" v-for="item in notificationsAdmin" :key="item.index">
                      {{ $t("dashboard.notifications.siren") }} {{ item.siren }}<br />
                      {{ $t("dashboard.notifications.institutionName") }}
                      <a @click="goToInstitutionPage(item.siren)">{{ item.institutionName }}</a><br />
                      {{ $t("dashboard.notifications.event") }} {{ item.notificationType }}<br />
                      {{ $t("dashboard.notifications.date") }} {{ dateFormatted(item.eventDate) }}
                    </li>
                    <li style="margin-bottom: 1em" v-for="item in notificationsUser" :key="item.index">
                      <span class="notifUserMsg" v-html="item.message"></span>
                      <br />
                      <span class="notifUserDesc" v-html="item.description"></span>
                    </li>
                  </ul>
                </div>
              </v-card-text>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6" v-if="isAdmin">
            <div class="borderCol fondBlanc" style="height: 100%; position: relative;">
              <v-card-title class="d-block titre-block" style="margin-bottom:-4px;">
                <FontAwesomeIcon :icon="faPaperPlane" class="fa-lg mx-2" />
                {{ $t("dashboard.publishers.title") }}
              </v-card-title>
              <v-card-text class="no-border dates">
                <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
                  <div v-if="datesLoading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                  <ul class="datesList">
                    <li style="margin-bottom: 0.5em" v-for="item in sendDates" :key="item">
                      <span v-html="item"></span>
                    </li>
                  </ul>
                </div>
                <div class="w-100 d-flex justify-end">
                  <v-btn @click="sendPublishers()" class="ma-4">{{ $t("dashboard.publishers.send") }}</v-btn>
                </div>
              </v-card-text>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { Notification } from "@/entity/Notification";
import { RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import {
  faBell,
  faCircleInfo,
  faDownload,
  faLock,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment/moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

const router = useRouter();
const display = useDisplay();
const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const snackbar = useSnackbar();
const publisherService = usePublisherService();
const institutionService = useInstitutionService();
const { t } = useI18n();

const institution = ref<Institution>(institutionStore.currentInstitution);
const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const isAdmin = computed(() => authStore.isAdmin);
const isExportLoading = ref(false);
const notificationsAdmin = ref<Array<Notification>>([]);
const notificationsUser = ref<Array<NotificationUser>>([]);
const sendDates = ref<Array<string>>([]);
const isSending = ref(false);
const notificationsLoading = ref(true);
const datesLoading = ref(true);

const metaInfo = () => ({
  meta: [
    {
      name: "description",
      content: t("dashboard.meta.description"),
    },
    { name: "keywords", content: t("dashboard.meta.keywords") },
  ],
  title: t("dashboard.meta.title"),
});

onMounted(() => {
});

const dateFormatted = (d: Date): string => moment(d).format("DD/MM/YYYY");

const goToProfile = (): void => {
  router.push({ name: RouteName.Profile });
};

const goToPasswordUpdate = (): void => {
  router.push({ name: RouteName.Password }).catch(err => {
    Logger.error(err);
  });
};

const downloadInstitution = (): void => {
  isExportLoading.value = true;
  const siren = new Array<string>();
  siren.push(authStore.user.siren);
  institutionService
    .downloadInstitutions(siren, authStore.user.token)
    .then(response => {
      const fileURL = URL.createObjectURL(
        new Blob([response.data], { type: "application/csv" })
      );
      const fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "export.csv");
      document.body.appendChild(fileLink);

      fileLink.click();
      isExportLoading.value = false;
    })
    .catch(err => {
      snackbar.error(err);
      isExportLoading.value = false;
    });
};

const goToInstitutionPage = (siren: string): void => {
  const targetInstitution = new Institution();
  targetInstitution.siren = siren;
  targetInstitution.id = 0;
  goToInstitutionDetails(targetInstitution);
};

const collectSendDates = (): void => {
  if (authStore.isAdmin) {
    publisherService
      .getPublisherSendDates(authStore.token)
      .then(result => {
        result.data.forEach(element => {
          sendDates.value.push(
            `${t("dashboard.publishers.sentOn")} ${moment(element).format("DD/MM/YYYY HH:MM")} ${t("dashboard.publishers.sentAgo")} ${moment(element).fromNow()}`
          );
        });
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        datesLoading.value = false;
      });
  }
};

const collectNotifications = (): void => {
  if (authStore.isAdmin) {
    institutionService
      .getAdminNotifications(authStore.token)
      .then(response => {
        notificationsAdmin.value = response;
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        notificationsLoading.value = false;
      });
  } else {
    institutionService
      .getInstitutionNotifications(authStore.userSiren, authStore.token)
      .then(response => {
        notificationsUser.value = response;
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        notificationsLoading.value = false;
      });
  }
};

const goToInstitutionDetails = (item: Institution): void => {
  institutionStore
    .setCurrentInstitution(item)
    .then(() => {
      router.push({ name: RouteName.InstitutionView });
    })
    .catch(err => {
      snackbar.error(err);
    });
};

const sendPublishers = async () => {
  const confirmed = await confirmRef.value?.open(t("dashboard.publishers.confirm"));
  if (confirmed) {
    isSending.value = true;
    publisherService
      .sendPublishers(authStore.token)
      .then(response => {
        snackbar.success(response.data.message);
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        isSending.value = false;
      });
  }
};

collectNotifications();
collectSendDates();
</script>
<style scoped lang="scss">
.container {
  width: auto !important;
  margin-left: 0;
  margin-right: 0;
}

.bloc-info div {
  margin-top: 1rem;
}

.titre-block {
  width: 100%;
  min-height: 60px;
}

.notifUserMsg {
  font-size: 1rem;
  font-weight: 400;
}

.notifUserDesc {
  font-size: 1rem;
  font-weight: 400;
}

ul {
  list-style: none;
  /* Remove default bullets */
}

ul li::before {
  content: "\2022";
  /* Add content: \2022 is the CSS Code/unicode for a bullet */
  color: #cf491f;
  /* Change the color */
  font-weight: bolder;
  /* If you want it to be bold */
  display: inline-block;
  /* Needed to add space between the bullet and the text */
  width: 1em;
  /* Also needed for space (tweak if needed) */
  margin-left: -1em;
  /* Also needed for space (tweak if needed) */
}

.borderCol {
  border: 1px solid #b8b8b9;
  border-radius: 5px;
  padding-top: 5px;
}

.v-card-text .no-border {
  border: none !important;
}

.notifs {
  max-height: 500px;
  overflow: auto;
}

.dates {
  max-height: 500px;
}

.datesList {
  max-height: 400px;
  overflow: auto;
}

.large-container {
  max-width: 150% !important;
}

h3 {
  font-size: 1rem !important;
}

.v-card-text {
  font-size: 1rem !important;
}

p {
  font-size: 1rem !important;
}
</style>
