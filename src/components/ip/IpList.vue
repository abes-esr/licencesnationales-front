<template>
  <v-container variant="flat">
    <ConfirmPopup ref="confirmRef" />

    <h1>{{ t("ip.list.title", { name: currentInstitutionName }) }}</h1>
    <div class="d-flex flex-wrap align-center justify-space-between">
      <div class="my-2">
        <a v-if="isAdmin" @click="goBackToInstitution">
          <FontAwesomeIcon :icon="faReply" />&nbsp;{{ t("ip.list.backToInstitution") }}
        </a>
      </div>
      <v-btn class="btn-1 mx-2 mr-0 my-2" :to="{ name: RouteName.IpCreate }">
        {{ t("ip.list.addIp") }}
        <FontAwesomeIcon :icon="faCirclePlus" class="mx-2" />
      </v-btn>
    </div>

    <v-card class="mt-3">
      <v-alert dense v-if="error" type="error" v-html="error" class="ma-3" />
      <v-alert dense v-if="notification" type="success" class="ma-3">
        {{ notification }}
      </v-alert>

      <VDataTable id="mytable" :key="refreshKey" :headers="headers" :header-props="{ class: 'bg-primary' }"
        :items="filteredAccessByStatus" :items-per-page="25"
        :items-per-page-options="[25, 50, 100, { value: -1, title: t('ip.list.all') }]"
        :item-class="RowClasses" :search="searchQuery" :loading="dataLoading" :no-data-text="t('ip.list.noData')"
        class="elevation-0 pa-0" density="compact">
          <template v-slot:headers="{ columns, toggleSort, isSorted, getSortIcon }">
            <tr>
              <th v-for="column in columns" :key="column.key" scope="col" class="text-left"
                @click="column.sortable ? toggleSort(column) : ''">
                <div style="display: flex; align-items: center; white-space: nowrap;">
                  <span>{{ column.title }}</span>

                  <v-icon v-if="column.sortable && !isSorted(column)" class="pl-2" size="small">
                    mdi-sort
                  </v-icon>
                  <v-icon v-else-if="column.sortable" class="pl-2" size="small">
                    {{ getSortIcon(column) }}
                  </v-icon>

                  <v-menu v-if="column.key === 'statut' || column.key === 'typeIp'"
                    :close-on-content-click="true" location="bottom end" transition="fade-transition">
                    <template #activator="{ props }">
                      <v-btn :aria-label="column.key" icon variant="text" size="small" density="compact" class="ml-1"
                        v-bind="props" @click.stop>
                        <v-icon size="small"
                          :color="column.key === 'statut' ? (statusFilter ? 'warning' : 'white') : (typeFilter ? 'warning' : 'white')">
                          mdi-filter
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-card v-if="column.key === 'statut'" class="filter-menu-card" elevation="6" rounded="lg"
                      min-width="280" max-width="380">
                      <div class="d-flex align-center justify-space-between px-4 py-2 border-b bg-grey-lighten-4">
                        <span class="text-caption font-weight-bold text-uppercase text-grey-darken-2">
                          {{ column.title }}
                        </span>
                        <v-btn v-if="statusFilter" variant="text" density="compact" size="x-small" color="primary"
                          class="text-caption px-2 font-weight-bold" @click.stop="onStatusSelect('Tous')">
                          {{ t("ip.list.all") }}
                        </v-btn>
                      </div>
                      <v-list density="compact" nav class="pa-2 filter-list" style="max-height: 320px; overflow-y: auto;">
                        <template v-for="item in statusOptions" :key="item.value">
                          <v-list-item :value="item.value"
                            :active="(item.value === 'Tous' && !statusFilter) || statusFilter === item.value" color="primary"
                            rounded="md" class="my-1 filter-list-item" @click="onStatusSelect(item.value)">
                            <template #prepend>
                              <v-icon size="small"
                                :color="(item.value === 'Tous' && !statusFilter) || statusFilter === item.value ? 'primary' : 'transparent'"
                                class="mr-2">
                                mdi-check
                              </v-icon>
                            </template>
                            <v-list-item-title class="text-body-2 font-weight-medium filter-item-text">
                              {{ item.title }}
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="item.value === 'Tous'" class="my-1"></v-divider>
                        </template>
                      </v-list>
                    </v-card>
                    <v-card v-if="column.key === 'typeIp'" class="filter-menu-card" elevation="6" rounded="lg"
                      min-width="240" max-width="320">
                      <div class="d-flex align-center justify-space-between px-4 py-2 border-b bg-grey-lighten-4">
                        <span class="text-caption font-weight-bold text-uppercase text-grey-darken-2">
                          {{ column.title }}
                        </span>
                        <v-btn v-if="typeFilter" variant="text" density="compact" size="x-small" color="primary"
                          class="text-caption px-2 font-weight-bold" @click.stop="onTypeSelect('Tous')">
                          {{ t("ip.list.all") }}
                        </v-btn>
                      </div>
                      <v-list density="compact" nav class="pa-2 filter-list" style="max-height: 320px; overflow-y: auto;">
                        <template v-for="item in typeOptions" :key="item.value">
                          <v-list-item :value="item.value"
                            :active="(item.value === 'Tous' && !typeFilter) || typeFilter === item.value" color="primary"
                            rounded="md" class="my-1 filter-list-item" @click="onTypeSelect(item.value)">
                            <template #prepend>
                              <v-icon size="small"
                                :color="(item.value === 'Tous' && !typeFilter) || typeFilter === item.value ? 'primary' : 'transparent'"
                                class="mr-2">
                                mdi-check
                              </v-icon>
                            </template>
                            <v-list-item-title class="text-body-2 font-weight-medium filter-item-text">
                              {{ item.title }}
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="item.value === 'Tous'" class="my-1"></v-divider>
                        </template>
                      </v-list>
                    </v-card>
                  </v-menu>
                </div>
              </th>
            </tr>
          </template>

          <template #top>
            <v-row class="ma-3">
              <v-col cols="12" sm="6" class="px-0">
                <v-tooltip :text="t('ip.list.downloadTooltip')" location="top" open-delay="100" theme="dark"
                  content-class="text-white">
                  <template #activator="{ props }">
                    <v-btn variant="text" @click="downloadIPs" class="bouton-simple" v-bind="props"
                      :loading="isExportLoading">
                      <h2>{{ t("ip.list.downloadTitle") }}</h2>
                      <FontAwesomeIcon :icon="faDownload" class="mx-2" size="lg" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="0" sm="3" class="px-0"></v-col>
              <v-col cols="12" sm="3" class="px-0">
                <div class="d-flex align-content-end justify-end">
                  <v-text-field v-model="searchQuery" :label="t('ip.list.searchLabel')" prepend-inner-icon="mdi-magnify"
                    variant="outlined" density="compact" clearable />
                </div>
              </v-col>
            </v-row>
          </template>

          <template #item.commentaires="{ item }">
            <v-tooltip location="bottom" theme="dark" content-class="text-white">
              <template #activator="{ props }">
                <span v-bind="props" class="text-truncate d-block" :style="{ width: '100px' }">{{ item.commentaires
                }}</span>
              </template>
              <span>{{ item.commentaires }}</span>
            </v-tooltip>
          </template>

          <template #item.statut="{ item }">
            <span class="pr-2">{{ item.statut }}</span>
            <v-tooltip location="bottom" theme="dark" content-class="text-white">
              <template #activator="{ props }">
                <span v-bind="props">
                  <FontAwesomeIcon :icon="faCircleInfo" />
                </span>
              </template>
              <span v-if="item.statut.includes('Validé')">{{ infobulleValid }}</span>
              <span v-if="item.statut.includes('Attestation')">{{ infobulleAttestation }}</span>
              <span v-if="item.statut.includes('attente')">{{ infobulleAttente }}</span>
            </v-tooltip>
          </template>

          <template #item.dateCreation="{ item }">
            <span>{{ item.dateCreationFormatted }}</span>
          </template>

          <template #item.dateModification="{ item }">
            <span>{{ item.dateModificationFormatted }}</span>
          </template>

          <template #item.action="{ item }">
            <v-btn v-if="isAdmin && currentInstitution.status == 'Validé'" class="ma-0 pa-0"
              variant="plain" :title="t('ip.list.review')" @click.stop="openDialog(item)">
              <FontAwesomeIcon color="#1f3f5f" :icon="faMagnifyingGlass" />
            </v-btn>
            <v-btn v-if="!isAdmin" class="ma-0 pa-0 bouton-simple" variant="plain" :loading="buttonLoading"
              :title="t('ip.list.delete')" @click="supprimerIP(item.id, item.ip)">
              <FontAwesomeIcon :icon="faXmark" color="red" />
            </v-btn>
          </template>
        </VDataTable>

      <v-row v-if="isAdmin" class="ma-3">
        <v-col>
          <div class="d-flex justify-end ga-2">
            <v-btn @click="clearActions" class="bouton-annuler" variant="outlined">
              {{ t("ip.list.cancel") }}
            </v-btn>
            <v-btn @click="dispatchAllAction" :loading="buttonLoading" class="btn-1" variant="elevated">
              {{ t("ip.list.saveActions") }}
              <FontAwesomeIcon :icon="faCircleArrowRight" class="ml-2" />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-col cols="12" class="px-0 mt-4" v-if="!isAdmin">
      <v-row>
        <v-col cols="1" xs="0" />
        <v-col cols="10" xs="12">
          <infos-i-ps :class="[breakpointMdAndDown ? 'compact-form' : '']"></infos-i-ps>
        </v-col>
      </v-row>
    </v-col>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          {{ t("ip.list.dialog.title") }}
        </v-card-title>
        <v-card-text>
          <h3>{{ t("ip.list.dialog.comment") }}</h3>
          <span>{{ currentIP.commentaires }}</span>
          <span v-if="currentIP.commentaires === null">{{ t("ip.list.dialog.noComment") }}</span>
          <br />
          <h3>{{ t("ip.list.dialog.whois") }}</h3>
          <v-expansion-panels focusable accordion>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <span v-if="checkIfWhoIsRenater(whoIs)">
                  {{ t("ip.list.dialog.whoisStartIn") }}
                  <span v-if="whoIs2 !== ''">{{ t("ip.list.dialog.rangeStart") }}</span>
                  {{ t("ip.list.dialog.renater") }}
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faCheck" />
                </span>
                <span v-else>
                  {{ t("ip.list.dialog.whoisStartNot") }}
                  <span v-if="whoIs2 !== ''">{{ t("ip.list.dialog.rangeStart") }}</span>
                  {{ t("ip.list.dialog.renaterNot") }}
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faXmark" />
                </span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p><span v-html="highlightRenater(whoIs)"></span></p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-if="whoIs2 !== ''">
              <v-expansion-panel-title>
                <span v-if="checkIfWhoIsRenater(whoIs2)">
                  {{ t("ip.list.dialog.whoisEndIn") }}
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faCheck" />
                </span>
                <span v-else>
                  {{ t("ip.list.dialog.whoisEndNot") }}
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faXmark" />
                </span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p><span v-html="highlightRenater(whoIs2)"></span></p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <br />
          <h3>{{ t("ip.list.dialog.adminComment") }}</h3>
          <v-textarea variant="outlined" auto-grow counter="4000" :rules="adminCommentRules" rows="2"
            :label="t('ip.list.dialog.deleteReason')" v-model="comments" clearable />
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <div class="d-flex justify-end ga-4">
                <v-btn @click="
                  dialog = false;
                  currentIPid = '';
                  comments = '';
                " class="bouton-annuler" variant="outlined">
                  {{ t("ip.list.cancel") }}
                </v-btn>
                <v-btn @click="addActionToBuffer('SUPPRIMER')" color="error" variant="flat">
                  {{ t("ip.list.delete") }}
                </v-btn>
                <v-btn @click="addActionToBuffer('REJETER')" color="primary" variant="tonal">
                  {{ t("ip.list.reject") }}
                </v-btn>
                <v-btn @click="addActionToBuffer('VALIDER')" color="success" variant="flat">
                  {{ t("ip.list.validate") }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { useIpService } from "@/composables/service/useIpService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import { LicencesNationalesApiError } from "@/exception/licencesnationales/LicencesNationalesApiError";
import { RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import {
  faCheck,
  faCircleArrowRight,
  faCircleInfo,
  faCirclePlus,
  faDownload,
  faMagnifyingGlass,
  faReply,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { DataTableHeader, useDisplay } from "vuetify";
import { VDataTable } from "vuetify/components";

const props = defineProps<{
  adminInstitutionSiren?: string;
}>();

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionStore = useInstitutionStore();
const router = useRouter();
const { mdAndDown } = useDisplay();
const ipService = useIpService();
const { t } = useI18n();

const { adminCommentRules } = useValidationRules();
const refreshKey = ref(0);
const statusFilter = ref("");
const typeFilter = ref("");
const statusOptions = computed(() => [
  { value: "Tous", title: t("ip.list.all") },
  { value: "En attente d'attestation", title: t("ip.list.status.attestationPending") },
  { value: "IP Validée par l'Abes", title: t("ip.list.status.validatedByAbes") },
  { value: "En attente d'examen par l'Abes", title: t("ip.list.status.reviewPending") },
]);
const typeOptions = computed(() => [
  { value: "Tous", title: t("ip.list.all") },
  { value: "IPV4", title: t("ip.list.types.ipv4") },
  { value: "IPV6", title: t("ip.list.types.ipv6") },
  { value: "Plage IPV4", title: t("ip.list.types.rangeIpv4") },
  { value: "Plage IPV6", title: t("ip.list.types.rangeIpv6") },
]);
const searchQuery = ref("");
const accessList = ref<Array<any>>([]);
const whoIs = ref("");
const whoIs2 = ref("");
const currentIP = ref<any>({});
const bufferActions = ref<Array<any>>([]);
const error = ref("");
const dialog = ref(false);
const isExportLoading = ref(false);
const buttonLoading = ref(false);
const notification = ref("");
const comments = ref("");
/**
 * Compare deux dates pour le tri chronologique dans le composant VDataTable.
 *
 * @param a - Première date à comparer
 * @param b - Deuxième date à comparer
 * @returns Nombre négatif si a < b, positif si a > b, ou 0 si égaux
 */
function sortDates(a: any, b: any): number {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  const timeA = new Date(a).getTime();
  const timeB = new Date(b).getTime();
  return timeA - timeB;
}

const headers = computed<DataTableHeader[]>(() => {
  if (isAdmin.value) {
    return [
      {
        title: t("ip.list.headers.createdAt"),
        align: "start",
        key: "dateCreation",
        sortable: true,
        sort: sortDates,
        width: "9%",
      },
      {
        title: t("ip.list.headers.type"),
        key: "typeIp",
        sortable: true,
        width: "9%",
      },
      { title: t("ip.list.headers.value"), key: "ip", sortable: true, width: "20%" },
      { title: t("ip.list.headers.status"), key: "statut", sortable: true, width: "13%" },
      { title: t("ip.list.headers.action"), key: "buffer", sortable: false, width: "13%" },
      {
        title: t("ip.list.headers.lastAction"),
        key: "dateModification",
        sortable: true,
        sort: sortDates,
        width: "10%",
      },
      {
        title: t("ip.list.headers.precision"),
        key: "commentaires",
        sortable: true,
        width: "17%",
      },
      { title: t("ip.list.headers.review"), key: "action", sortable: false, width: "9%" },
    ];
  }
  return [
    {
      title: t("ip.list.headers.createdAt"),
      align: "start",
      key: "dateCreation",
      sortable: true,
      sort: sortDates,
      width: "9%",
    },
    {
      title: t("ip.list.headers.type"),
      key: "typeIp",
      sortable: true,
      width: "20%",
    },
    { title: t("ip.list.headers.value"), key: "ip", sortable: true, width: "15%" },
    { title: t("ip.list.headers.status"), key: "statut", sortable: true, width: "15%" },
    {
      title: t("ip.list.headers.lastAction"),
      key: "dateModification",
      sortable: true,
      sort: sortDates,
      width: "15%",
    },
    {
      title: t("ip.list.headers.precision"),
      key: "commentaires",
      sortable: true,
      width: "17%",
    },
    { title: t("ip.list.headers.delete"), key: "action", sortable: false, width: "10%" },
  ];
});
const dataLoading = ref(true);
const currentIPid = ref("");
const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);

const infobulleAttente = t("ip.list.info.waiting");
const infobulleAttestation = t("ip.list.info.attestation");
const infobulleValid = t("ip.list.info.valid");

const currentInstitutionName = computed(() => institutionStore.currentInstitution.name);
const isAdmin = computed(() => authStore.isAdmin);
const breakpointMdAndDown = computed(() => mdAndDown.value);
const currentInstitution = computed(() => institutionStore.currentInstitution);

const filteredAccessByType = computed(() => {
  const conditions: Array<(value: any) => boolean> = [];
  if (typeFilter.value) {
    conditions.push(filterIpType);
  }
  if (conditions.length > 0) {
    return accessList.value.filter(accessItem => conditions.every(condition => condition(accessItem)));
  }
  return accessList.value;
});

const filteredAccessByStatus = computed(() => {
  const conditions: Array<(value: any) => boolean> = [];
  if (statusFilter.value) {
    conditions.push(filterStatus);
  }
  if (conditions.length > 0) {
    return filteredAccessByType.value.filter(accessItem => conditions.every(condition => condition(accessItem)));
  }
  return filteredAccessByType.value;
});

onMounted(() => {
  fetchAccessList();
});

function filterStatus(statusItem: any) {
  return statusItem.statut.toString().includes(statusFilter.value);
}

function filterIpType(typeSearch: any) {
  return typeSearch.typeIp.toString() === typeFilter.value;
}

function getAll() {
  if (isAdmin.value) {
    return ipService.getInstitutionIpList(
      authStore.token,
      institutionStore.currentInstitution.siren
    );
  }
  return ipService.getListIP(authStore.token, authStore.user.siren);
}

function fetchAccessList(): void {
  getAll()
    .then(response => {
      accessList.value = response.map(formatAccessEntry);
    })
    .catch((err: LicencesNationalesApiError) => {
      Logger.error(err.toString());
      error.value = err.message;
    })
    .finally(() => {
      dataLoading.value = false;
    });
}

/**
 * Formate un élément IP reçu de l'API pour l'affichage et le tri dans la VDataTable.
 * Conserve la Date brute pour le tri chronologique et produit la version localisée pour l'affichage.
 *
 * @param accessItem - Objet IP brut retourné par le service
 * @returns Objet formaté pour chaque ligne du tableau
 */
function formatAccessEntry(accessItem: any) {
  let accessType = "";
  if (accessItem.typeAcces === "range") accessType = t("ip.list.types.rangePrefix");
  return {
    id: accessItem.id,
    dateCreation: accessItem.createdAt ? new Date(accessItem.createdAt) : null,
    dateCreationFormatted: accessItem.createdAt ? dayjs(accessItem.createdAt).format("L") : "",
    dateModification: accessItem.updatedAt ? new Date(accessItem.updatedAt) : null,
    dateModificationFormatted: getDateModification(accessItem),
    typeIp: accessType + (accessItem.typeIp ?? ""),
    typeAcces: accessItem.typeAcces ?? "",
    ip: accessItem.ip,
    statut: accessItem.status ?? "",
    commentaires: accessItem.comments ?? [],
  };
}

/**
 * Retourne la date de modification formatée si elle existe.
 *
 * @param accessItem - Objet IP brut
 * @returns Date formatée au format localisé ou chaîne vide
 */
function getDateModification(accessItem: any): string {
  if (!accessItem.updatedAt) return "";
  return dayjs(accessItem.updatedAt).format("L");
}

function openDialog(item: any): void {
  clearAlerts();
  fetchwhoIs(item);
  dialog.value = true;
  currentIP.value = item;
}

function fetchwhoIs(item: any): void {
  whoIs.value = "";
  whoIs2.value = "";

  if (item.typeAcces === "ip") {
    ipService
      .getWhoIs(authStore.token, item.ip)
      .then(res => {
        whoIs.value = res.data;
      })
      .catch(() => {
        Logger.error(t("ip.list.whoisError"));
      });
  } else {
    const ips = splitRangeIntoIPs(item.typeIp, item.ip);
    ipService
      .getWhoIs(authStore.token, ips[0])
      .then(res => {
        whoIs.value = res.data;
      })
      .catch(() => {
        Logger.error(t("ip.list.whoisError"));
      });
    ipService
      .getWhoIs(authStore.token, ips[1])
      .then(res => {
        whoIs2.value = res.data;
      })
      .catch(() => {
        Logger.error(t("ip.list.whoisError"));
      });
  }
}

function splitRangeIntoIPs(typeIP: string, range: string): string[] {
  let ip1 = "";
  let ip2 = "";

  if (typeIP === "Plage IPV4") {
    range.split(".").forEach(element => {
      if (element.includes("-")) {
        const tabSplit = element.split("-");
        ip1 += "." + tabSplit[0];
        ip2 += "." + tabSplit[1];
      } else {
        ip1 += "." + element;
        ip2 += "." + element;
      }
    });
  } else {
    range.split(":").forEach(element => {
      if (element.includes("-")) {
        const tabSplit = element.split("-");
        ip1 += ":" + tabSplit[0];
        ip2 += ":" + tabSplit[1];
      } else {
        ip1 += ":" + element;
        ip2 += ":" + element;
      }
    });
  }

  ip1 = ip1.substring(1);
  ip2 = ip2.substring(1);
  return [ip1, ip2];
}

function checkIfWhoIsRenater(whoIsValue: string): boolean {
  return whoIsValue.toLowerCase().includes("renater");
}

function highlightRenater(whoIsValue: string) {
  return whoIsValue.replaceAll("renater", "<mark>renater</mark>").replaceAll("RENATER", "<mark>RENATER</mark>");
}

function dispatchAllAction(): void {
  updateIP()
    .then(() => {
      notification.value = t("ip.list.actionsDone");
    })
    .catch((err: LicencesNationalesApiError) => {
      Logger.debug(err.toString());
      error.value = err.message;
    })
    .finally(() => {
      fetchAccessList();
      clearActions();
      buttonLoading.value = false;
    });
}

function updateIP(): Promise<AxiosResponse> {
  buttonLoading.value = true;
  return ipService.updateIP(
    authStore.token,
    institutionStore.currentInstitution.siren,
    bufferActions.value
  );
}

function addActionToBuffer(action: string): void {
  bufferActions.value.push({
    idIp: currentIP.value.id,
    action: action,
    ip: currentIP.value.ip,
    commentaire: comments.value,
  });
  addActionToDatatable(action, currentIP.value.id);
  comments.value = "";
  dialog.value = false;
  refreshKey.value++;
}

function addActionToDatatable(action: string, id: number) {
  accessList.value.forEach(element => {
    if (element.id === id) {
      element.buffer = action;
    }
  });
}

async function supprimerIP(IDip: string, ip: string) {
  const confirmed = await confirmRef.value?.open(t("ip.list.deleteConfirm", { ip }));
  if (confirmed) {
    buttonLoading.value = true;
    clearAlerts();

    ipService
      .deleteIP(authStore.token, IDip)
      .then(() => {
        notification.value = t("ip.list.deleteSuccess");
      })
      .catch(err => {
        Logger.error(err);
        error.value = err.message;
      })
      .finally(() => {
        buttonLoading.value = false;
        fetchAccessList();
      });
  }
}

function RowClasses(item: any) {
  let action = "";
  bufferActions.value.forEach(element => {
    if (element.ip === item.ip) {
      action = element.action;
    }
  });
  return action + " pb-2 pt-2";
}

function clearActions() {
  bufferActions.value = [];
  refreshKey.value++;
  accessList.value.forEach(element => {
    if (element.buffer !== undefined) {
      delete element.buffer;
    }
  });
}

function clearAlerts() {
  notification.value = "";
  error.value = "";
}

function getSubjectInstitutionSiren() {
  if (isAdmin.value && props.adminInstitutionSiren) {
    return institutionStore.currentInstitution.siren;
  }
  return authStore.user.siren;
}

/**
 * Sélectionne ou désélectionne un statut d'adresse IP pour filtrer la liste.
 *
 * @param element - Statut sélectionné ("Tous" pour réinitialiser)
 */
function onStatusSelect(element: string): void {
  if (element === "Tous" || statusFilter.value === element) {
    statusFilter.value = "";
  } else {
    statusFilter.value = element;
  }
}

/**
 * Sélectionne ou désélectionne un type d'adresse IP pour filtrer la liste.
 *
 * @param element - Type d'adresse IP sélectionné ("Tous" pour réinitialiser)
 */
function onTypeSelect(element: string): void {
  if (element === "Tous" || typeFilter.value === element) {
    typeFilter.value = "";
  } else {
    typeFilter.value = element;
  }
}

function downloadIPs(): void {
  isExportLoading.value = true;
  const siren = getSubjectInstitutionSiren();
  ipService
    .downloadIPs(siren, authStore.user.token)
    .then(response => {
      const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/csv" }));
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

function goBackToInstitution(): void {
  router.push({ name: RouteName.InstitutionView });
}
</script>

<style src="./style.css"></style>

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

.filter-menu-card {
  white-space: normal;
}

.filter-item-text {
  white-space: normal !important;
  line-height: 1.35 !important;
  word-break: break-word;
}
</style>
