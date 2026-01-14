<template>
  <v-container variant="flat" :disabled="disableForm">
    <h1>{{ $t("institution.list.title") }}</h1>
    <div class="pr-0">
      <v-row class="d-flex flex-row-reverse ma-0">
        <v-btn @click="goToInstitutionSplit" class="btn-1 ml-2">
          {{ $t("institution.list.split") }}
          <FontAwesomeIcon :icon="faObjectUngroup" class="mx-2" />
        </v-btn>
        <v-btn @click="goToInstitutionMerge" class="btn-1 mx-2">
          {{ $t("institution.list.merge") }}
          <FontAwesomeIcon :icon="faObjectGroup" class="mx-2" />
        </v-btn>
        <v-btn @click="addInstitution" class="btn-1 mx-2">
          {{ $t("institution.list.create") }}
          <FontAwesomeIcon :icon="faPlus" class="mx-2" />
        </v-btn>
      </v-row>
    </div>
    <v-card class="mt-3 fondGris">
      <VDataTable density="compact" :headers="headers" :header-props="{ class: 'bg-primary' }"
        :items="filteredInstitutionsByStatus" :items-per-page="25"
        :items-per-page-options="[25, 50, 100, { value: -1, title: $t('institution.list.all') }]"
        class="elevation-0 pa-0" :search="searchQuery" :loading="dataLoading" id="mytable">
        <template #top>
          <v-row class="ma-3">
            <v-col cols="12" sm="6" class="px-0">
              <v-tooltip :text="$t('institution.list.downloadTooltip')" location="top" open-delay="100" theme="dark"
                content-class="text-white">
                <template #activator="{ props }">
                  <v-btn variant="text" @click="downloadInstitutions" class="pl-0 bouton-simple" v-bind="props"
                    :loading="isExportLoading">
                    <h2>{{ $t("institution.list.downloadTitle") }}</h2>
                    <FontAwesomeIcon :icon="faDownload" size="2x" class="mx-2" />
                  </v-btn>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="0" sm="3" class="px-0"></v-col>
            <v-col cols="12" sm="3" class="px-0">
              <div class="d-flex align-content-end justify-end">
                <v-text-field v-model="searchQuery" :label="$t('institution.list.searchLabel')"
                  prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable />
              </div>
            </v-col>
          </v-row>
        </template>

        <template v-slot:headers="{ columns, toggleSort, isSorted, getSortIcon }">
          <tr>
            <th v-for="column in columns" :key="column.key" class="text-left"
              @click="column.sortable ? toggleSort(column) : ''">
              <div style="display: flex; align-items: center; white-space: nowrap;">
                <span>{{ column.title }}</span>

                <v-icon v-if="column.sortable && !isSorted(column)" class="pl-2" size="small">
                  mdi-sort
                </v-icon>
                <v-icon v-else-if="column.sortable" class="pl-2" size="small">
                  {{ getSortIcon(column) }}
                </v-icon>

                <v-menu v-if="column.key === 'typeEtablissement' || column.key === 'statutIP'"
                  :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn :aria-label="column.key" icon variant="text" class="ml-1" v-bind="props">
                      <v-icon small
                        :color="column.key === 'typeEtablissement' ? (selectedType ? 'primary' : '') : (statusFilter ? 'primary' : '')">
                        mdi-filter
                      </v-icon>
                    </v-btn>
                  </template>
                  <div v-if="column.key === 'typeEtablissement'" style="background-color: white;" class="pl-4 pr-8">
                    <ul>
                      <li v-for="item in institutionTypes" :key="item" @click="onInstitutionTypeSelect(item)">
                        <a>{{ item }}</a>
                      </li>
                    </ul>
                  </div>
                  <div v-if="column.key === 'statutIP'" style="background-color: white;" class="pl-4 pr-8">
                    <ul>
                      <li v-for="item in statusOptions" :key="item.value" @click="onStatusSelect(item.value)">
                        <a>{{ item.title }}</a>
                      </li>
                    </ul>
                  </div>
                </v-menu>
              </div>
            </th>
          </tr>
        </template>

        <template #item.dateCreationFormattedInString="{ item }">
          <span>{{ item.dateCreation.toLocaleDateString() }}</span>
        </template>

        <template #item.nom="{ item }">
          <a class="bouton-simple" @click="goToInstitution(item)">
            <strong>{{ item.nom }}</strong>
          </a>
        </template>

        <template #item.action="{ item }">
          <v-icon large class="mr-2" @click="goToIps(item)">
            mdi-ip-network
          </v-icon>
        </template>
      </VDataTable>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { LicencesNationalesUnauthorizedApiError } from "@/exception/licencesnationales/LicencesNationalesUnauthorizedApiError";
import { RouteName } from "@/router";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { Logger } from "@/utils/Logger";
import {
  faDownload,
  faObjectGroup,
  faObjectUngroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { DataTableHeader } from "vuetify";
import { VDataTable } from "vuetify/components";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionStore = useInstitutionStore();
const router = useRouter();
const institutionService = useInstitutionService();
const { t } = useI18n();

const disableForm = ref(false);
const statusFilter = ref("");
const dataLoading = ref(true);
const statusOptions = computed(() => [
  { value: "Tous", title: t("institution.list.status.all") },
  { value: "Sans IP", title: t("institution.list.status.noIp") },
  { value: "Examiner IP", title: t("institution.list.status.reviewIp") },
  { value: "Attestation � envoyer", title: t("institution.list.status.attestation") },
  { value: "IP Ok", title: t("institution.list.status.ipOk") },
]);
const searchQuery = ref("");
const institutions = ref<Array<Institution>>([]);
const filteredInstitutions = ref<Array<Institution>>([]);
const selectedType = ref("");
const institutionTypes = ref<Array<string>>([]);
const isExportLoading = ref(false);
const headers = computed<DataTableHeader[]>(() => [
  {
    title: t("institution.list.headers.createdAt"),
    align: "start",
    key: "dateCreationFormattedInString",
    sortable: true,
  },
  { title: t("institution.list.headers.idAbes"), key: "idAbes", sortable: true },
  { title: t("institution.list.headers.siren"), key: "siren", sortable: true },
  { title: t("institution.list.headers.name"), key: "nom", sortable: true },
  {
    title: t("institution.list.headers.type"),
    key: "typeEtablissement",
    sortable: true,
  },
  {
    title: t("institution.list.headers.ipLastUpdate"),
    key: "dateModificationDerniereIp",
    sortable: true,
  },
  { title: t("institution.list.headers.status"), key: "statutIP", sortable: true },
  { title: t("institution.list.headers.ipList"), key: "action", sortable: false },
]);

const isAdmin = computed(() => authStore.isAdmin);

onMounted(() => {
  if (isAdmin.value) {
    fetchInstitutions();
    fetchInstitutionTypes();
  } else {
    snackbar.error(t("institution.list.unauthorized"));
    router.push({ name: RouteName.Home });
  }
});

const filteredInstitutionsByStatus = computed((): Array<Institution> => {
  const conditions: Array<string> = [];
  if (statusFilter.value) {
    conditions.push(statusFilter.value);
  }
  if (selectedType.value) {
    conditions.push(selectedType.value);
  }

  if (conditions.length > 0) {
    filteredInstitutions.value = institutions.value.filter(access =>
      conditions.every(
        condition => access.typeEtablissement == condition || access.statutIP == condition
      )
    );
    return filteredInstitutions.value;
  }

  institutions.value.forEach(element => {
    element.dateCreationFormattedInString = moment(element.dateCreation).format("YYYY-MM-DD");
    if (element.dateModificationDerniereIp) {
      element.dateModificationDerniereIp = element.dateModificationDerniereIp.replace(/-/g, "/");
    }
  });
  overrideStatuts();
  filteredInstitutions.value = institutions.value;
  return filteredInstitutions.value;
});

function overrideStatuts(): void {
  institutions.value.forEach(element => {
    if (element.statut === "Nouveau") {
      element.statutIP = "Nouveau";
    }
  });
}

function onInstitutionTypeSelect(element: string): void {
  selectedType.value = element === "Tous" ? "" : element;
}

function onStatusSelect(element: string): void {
  statusFilter.value = element === "Tous" ? "" : element;
}

async function fetchInstitutionTypes() {
  await institutionService
    .listInstitutionTypes()
    .then(result => {
      institutionTypes.value = [...result, "Tous"].sort((n1, n2) =>
        n1 > n2 ? 1 : n1 < n2 ? -1 : 0
      );
      institutionTypes.value.unshift(
        institutionTypes.value.splice(
          institutionTypes.value.findIndex(item => item === "Tous"),
          1
        )[0]
      );
    })
    .catch(err => {
      snackbar.error(err);
    });
}

function addInstitution(): void {
  institutionStore
    .setCurrentInstitution(new Institution())
    .then(() => {
      router.push({ name: RouteName.InstitutionCreate }).catch(err => {
        Logger.error(err as any);
      });
    })
    .catch(err => {
      snackbar.error(err);
    });
}

function goToInstitutionMerge(): void {
  router.push({ name: RouteName.InstitutionMerge });
}

function goToInstitutionSplit(): void {
  router.push({ name: RouteName.InstitutionSplit });
}

function fetchInstitutions(): void {
  institutionService
    .getInstitutions(authStore.getToken)
    .then(response => {
      institutions.value = response;
    })
    .catch(err => {
      if (err instanceof LicencesNationalesUnauthorizedApiError) {
        disableForm.value = true;
        snackbar.error(t("institution.list.unauthorizedOperation"), {
          onHide: () => {
            router.push({ name: RouteName.Home });
          },
        });
      } else {
        snackbar.error(err);
      }
    })
    .finally(() => {
      dataLoading.value = false;
    });
}

function goToIps(item: Institution): void {
  institutionStore
    .setCurrentInstitution(item)
    .then(() => {
      router.push({ name: RouteName.IpList });
    })
    .catch(err => {
      snackbar.error(err);
    });
}

function downloadInstitutions(): void {
  isExportLoading.value = true;
  const sirens = new Array<string>();
  filteredInstitutions.value.forEach(element => {
    sirens.push(element.siren);
  });
  institutionService
    .downloadInstitutions(sirens, authStore.user.token)
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
}

function goToInstitution(item: Institution): void {
  institutionStore
    .setCurrentInstitution(item)
    .then(() => {
      router.push({ name: RouteName.InstitutionView });
    })
    .catch(err => {
      snackbar.error(err);
    });
}
</script>
<style>
.v-data-table {
  background-color: transparent !important;
}

.theme--light .v-data-footer__icons-before .v-btn,
.theme--light .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-before .v-btn {
  background-color: transparent !important;
}
</style>




