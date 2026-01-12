<template>
  <div>
    <ConfirmPopup ref="confirmRef" />

    <v-container class="pb-0">
      <h1>Liste des IP déclarées par {{ currentEtabNom }}</h1>
      <div class="d-flex flex-wrap align-center justify-space-between">
        <div class="my-2">
          <a v-if="isAdmin" @click="revenirInfosEtab">
            <FontAwesomeIcon :icon="faReply" />&nbsp;Revenir
            aux informations de l'établissement
          </a>
        </div>
        <v-btn id="addIpButton" class="my-2" @click="router.push({ path: '/ajouterAcces/' })">
          <span class="btnText">Ajouter une IP ou une plage IP</span>
          <FontAwesomeIcon :icon="faCirclePlus" style="font-size:1.1rem" />
        </v-btn>
      </div>
    </v-container>

    <v-card variant="flat" class="mt-2">
      <v-card-text class="fondGris">
        <v-alert dense v-if="error" type="error" v-html="error" />
        <v-alert dense v-if="notification" type="success">
          {{ notification }}
        </v-alert>

        <VDataTable id="mytable" :key="refreshKey" :headers="headers" :items="filteredAccesByStatut"
          :items-per-page="10" :items-per-page-options="[10, 25, 50, 75, { value: -1, title: 'Tous' }]"
          :item-class="RowClasses" :search="rechercher" :loading="dataLoading"
          no-data-text="Aucune IP déclarée pour l’instant. Déclarez une adresse ou une plage IP." class="row-height-50"
          density="comfortable">
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

                  <v-menu v-if="column.key === 'statut' || column.key === 'typeIp'" offset-y
                    :close-on-content-click="false">
                    <template #activator="{ props }">
                      <v-btn :aria-label="column.key" icon size="x-small" v-bind="props" variant="text"
                        class="pa-0 ma-0">
                        <v-icon :color="column.key === 'statut' ? (statut ? 'primary' : '') : (type ? 'primary' : '')"
                          size="small">
                          mdi-filter
                        </v-icon>
                      </v-btn>
                    </template>
                    <div v-if="column.key === 'statut'" style="background-color: white" class="pl-4 pr-8">
                      <ul>
                        <li v-for="item in selectStatut" :key="item" @click="eventStatutChoice(item)">
                          <a>{{ item }}</a>
                        </li>
                      </ul>
                    </div>
                    <div v-if="column.key === 'typeIp'" style="background-color: white;" class="pl-4 pr-8">
                      <ul>
                        <li v-for="item in selectType" :key="item" @click="eventTypeChoice(item)">
                          <a>{{ item }}</a>
                        </li>
                      </ul>
                    </div>
                  </v-menu>
                </div>
              </th>
            </tr>
          </template>

          <template #top>
            <v-row>
              <v-col cols="12" sm="6" class="px-0">
                <v-tooltip text="Le téléchargement correspond à la vue filtrée" location="top" open-delay="100"
                  theme="dark" content-class="text-white">
                  <template #activator="{ props }">
                    <v-btn variant="text" @click="downloadIPs" class="bouton-simple pl-0" v-bind="props"
                      :loading="isExportLoading">
                      <h2>Télécharger la liste des IP</h2>
                      <FontAwesomeIcon :icon="faDownload" class="mx-2" size="2x" />
                    </v-btn>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="0" sm="3"></v-col>
              <v-col cols="12" sm="3" class="px-0">
                <v-text-field v-model="rechercher" label="Chercher dans les colonnes" prepend-inner-icon="mdi-magnify"
                  variant="outlined" clearable />
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

          <template #item.action="{ item }">
            <v-btn v-if="isAdmin && getCurrentEtab.statut == 'Validé'" class="ma-0 pa-0 bouton-simple " variant="flat"
              title="Examiner" @click.stop="openDialog(item)">
              <FontAwesomeIcon :icon="faMagnifyingGlass" />
            </v-btn>
            <v-btn v-if="!isAdmin" class="ma-0 pa-0 bouton-simple " icon :loading="buttlonLoading" title="Supprimer"
              @click="supprimerIP(item.id, item.ip)">
              <FontAwesomeIcon :icon="faXmark" class="fa-orange" />
            </v-btn>
          </template>
        </VDataTable>

        <v-row>
          <v-col>
            <div style="float: right;" class="actions" v-if="isAdmin">
              <v-btn @click="clearActions" class="btn-6" variant="outlined">
                <span class="btnText">Annuler</span>
              </v-btn>
              <v-btn @click="dispatchAllAction" :loading="buttlonLoading" variant="elevated">
                <span class="btnText">Enregistrer mes actions</span>
                <FontAwesomeIcon :icon="faCircleArrowRight" />
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-col cols="12" style="padding: 24px;" v-if="!isAdmin">
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
          Analyse de l'adresse IP
        </v-card-title>
        <v-card-text>
          <h3>Commentaire</h3>
          <span>{{ currentIP.commentaires }}</span>
          <span v-if="currentIP.commentaires === null">Aucun commentaire</span>
          <br />
          <h3>Whois</h3>
          <v-expansion-panels focusable accordion>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <span v-if="checkIfWhoIsRenater(whoIs)">L'adresse <span v-if="whoIs2 !== ''">de début </span>fait
                  partie du réseau RENATER
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faCheck" />
                </span>
                <span v-else>L'adresse <span v-if="whoIs2 !== ''">de début </span> ne fait
                  pas partie du réseau RENATER<span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faXmark" />
                </span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p><span v-html="highlightRenater(whoIs)"></span></p>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-if="whoIs2 !== ''">
              <v-expansion-panel-title>
                <span v-if="checkIfWhoIsRenater(whoIs2)">L'adresse de fin fait partie du réseau RENATER
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faCheck" />
                </span>
                <span v-else>L'adresse de fin ne fait pas partie du réseau RENATER<span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="faXmark" />
                </span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p><span v-html="highlightRenater(whoIs2)"></span></p>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <br />
          <h3>Commentaire admin</h3>
          <v-textarea variant="outlined" auto-grow counter="4000" :rules="rulesForm.commentaireAdmin" rows="2"
            label="Raisons de la suppression" v-model="commentaires" clearable />
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <div style="float: right" class="actions ga-4 d-flex">
                <v-btn @click="
                  dialog = false;
                currentIPid = '';
                commentaires = '';
                " class="btn-6" variant="outlined">
                  Annuler
                </v-btn>
                <v-btn @click="addActionToBuffer('SUPPRIMER')" color="error" variant="flat">
                  Supprimer
                </v-btn>
                <v-btn @click="addActionToBuffer('REJETER')" color="primary" variant="tonal">
                  Rejeter
                </v-btn>
                <v-btn @click="addActionToBuffer('VALIDER')" color="success" variant="flat">
                  Valider
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import InfosIPs from "@/components/ip/InfosIPs.vue";
import { useIpService } from "@/composables/useIpService";
import { useSnackbar } from "@/composables/useSnackbar";
import { rulesForms } from "@/core/RulesForm";
import { useAuthStore } from "@/stores/authStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { Logger } from "@/utils/Logger";
import {
  faCheck,
  faCircleArrowRight,
  faCircleInfo,
  faCirclePlus,
  faDownload,
  faMagnifyingGlass,
  faReply,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { AxiosResponse } from "axios";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { VDataTable } from "vuetify/components";

const props = defineProps<{
  sirenEtabSiAdmin?: string;
}>();

const authStore = useAuthStore();
const snackbar = useSnackbar();
const etablissementStore = useEtablissementStore();
const router = useRouter();
const { mdAndDown } = useDisplay();
const iPService = useIpService();

const rulesForm = rulesForms;
const refreshKey = ref(0);
const statut = ref("");
const type = ref("");
const selectStatut = ref<Array<string>>([
  "En attente d'attestation",
  "IP Validée par l'Abes",
  "En attente d'examen par l'Abes",
  "Tous"
]);
const selectType = ref<Array<string>>([
  "IPV4",
  "IPV6",
  "Plage IPV4",
  "Plage IPV6",
  "Tous"
]);
const rechercher = ref("");
const acces = ref<Array<any>>([]);
const whoIs = ref("");
const whoIs2 = ref("");
const currentIP = ref<any>({});
const bufferActions = ref<Array<any>>([]);
const error = ref("");
const dialog = ref(false);
const isExportLoading = ref(false);
const buttlonLoading = ref(false);
const notification = ref("");
const commentaires = ref("");
const headers = ref<any[]>([]);
const dataLoading = ref(true);
const currentIPid = ref("");
const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);

const infobulleAttente =
  "IP transmise aux éditeurs et à l'Inist si validée par l'Abes";
const infobulleAttestation =
  "IP transmise aux éditeurs et à l'Inist après réception de l'attestation";
const infobulleValid =
  "IP transmise aux éditeurs et à l’Inist à chaque fin de mois";

const currentEtabNom = computed(
  () => etablissementStore.getCurrentEtablissement.nom
);
const isAdmin = computed(() => authStore.isAdmin);
const breakpointMdAndDown = computed(() => mdAndDown.value);
const getCurrentEtab = computed(() => etablissementStore.getCurrentEtablissement);

const filteredAccesByType = computed(() => {
  const conditions: Array<(value: any) => boolean> = [];
  if (type.value) {
    conditions.push(filterType);
  }
  if (conditions.length > 0) {
    return acces.value.filter(accesItem =>
      conditions.every(condition => condition(accesItem))
    );
  }
  return acces.value;
});

const filteredAccesByStatut = computed(() => {
  const conditions: Array<(value: any) => boolean> = [];
  if (statut.value) {
    conditions.push(filterStatut);
  }
  if (conditions.length > 0) {
    return filteredAccesByType.value.filter(accesItem =>
      conditions.every(condition => condition(accesItem))
    );
  }
  return filteredAccesByType.value;
});

onMounted(() => {
  moment.locale("fr");
  collecterAcces();
  setHeaders();
});

function setHeaders() {
  if (isAdmin.value) {
    headers.value = [
      {
        title: "Date de saisie",
        align: "start",
        key: "dateCreation",
        sortable: true,
        width: "9%"
      },
      {
        title: "Type d'IP",
        key: "typeIp",
        sortable: true,
        width: "9%"
      },
      { title: "Valeur", key: "ip", sortable: true, width: "20%" },
      { title: "Statut", key: "statut", sortable: true, width: "13%" },
      { title: "Action", key: "buffer", sortable: false, width: "13%" },
      {
        title: "Dernière action de l’Abes",
        key: "dateModification",
        sortable: true,
        width: "10%"
      },
      {
        title: "Précision sur l’IP",
        key: "commentaires",
        sortable: true,
        width: "17%",

      },
      { title: "Examiner", key: "action", sortable: false, width: "9%" }
    ];
  } else {
    headers.value = [
      {
        title: "Date de saisie",
        align: "start",
        key: "dateCreation",
        sortable: true,
        width: "9%"
      },
      {
        title: "Type d'IP",
        key: "typeIp",
        sortable: true,
        width: "20%"
      },
      { title: "Valeur", key: "ip", sortable: true, width: "15%" },
      { title: "Statut", key: "statut", sortable: true, width: "15%" },
      {
        title: "Dernière action de l’Abes",
        key: "dateModification",
        sortable: true,
        width: "15%"
      },
      {
        title: "Précision sur l’IP",
        key: "commentaires",
        sortable: true,
        width: "17%"
      },
      { title: "Supprimer", key: "action", sortable: false, width: "10%" }
    ];
  }
}

function filterStatut(statutRecherche: any) {
  return statutRecherche.statut.toString().includes(statut.value);
}

function filterType(typeRecherche: any) {
  return typeRecherche.typeIp.toString() === type.value;
}

function getAll() {
  if (isAdmin.value) {
    return iPService.getListIPEtab(
      authStore.getToken,
      etablissementStore.getCurrentEtablissement.siren
    );
  }
  return iPService.getListIP(authStore.getToken, authStore.user.siren);
}

function collecterAcces(): void {
  getAll()
    .then(response => {
      acces.value = response.data.map(affichageAcces);
    })
    .catch(err => {
      Logger.error(err);
      error.value = err.response?.data?.message ?? err.message;
    })
    .finally(() => {
      dataLoading.value = false;
    });
}

function affichageAcces(accesItem: any) {
  let typeAcces = "";
  if (accesItem.typeAcces === "range") typeAcces = "Plage ";
  return {
    id: accesItem.id,
    dateCreation: moment(accesItem.dateCreation).format("L"),
    dateModification: getDateModification(accesItem),
    typeIp: typeAcces + accesItem.typeIp,
    typeAcces: accesItem.typeAcces,
    ip: accesItem.ip,
    statut: accesItem.statut,
    commentaires: accesItem.commentaires
  };
}

function getDateModification(accesItem: any) {
  if (accesItem.dateModification === null) return accesItem.dateModification;
  return moment(accesItem.dateModification).format("L");
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
    iPService
      .getWhoIs(authStore.getToken, item.ip)
      .then(res => {
        whoIs.value = res.data;
      })
      .catch(() => {
        Logger.error("Impossible d'exécuter le WhoIS");
      });
  } else {
    const ips = splitRangeIntoIPs(item.typeIp, item.ip);
    iPService
      .getWhoIs(authStore.getToken, ips[0])
      .then(res => {
        whoIs.value = res.data;
      })
      .catch(() => {
        Logger.error("Impossible d'exécuter le WhoIS");
      });
    iPService
      .getWhoIs(authStore.getToken, ips[1])
      .then(res => {
        whoIs2.value = res.data;
      })
      .catch(() => {
        Logger.error("Impossible d'exécuter le WhoIS");
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
  return whoIsValue
    .replaceAll("renater", "<mark>renater</mark>")
    .replaceAll("RENATER", "<mark>RENATER</mark>");
}

function dispatchAllAction(): void {
  updateIP()
    .then(() => {
      notification.value = "Actions effectuées";
    })
    .catch(err => {
      Logger.debug(err);
      error.value = err.response?.data?.message ?? err.message;
    })
    .finally(() => {
      collecterAcces();
      clearActions();
      buttlonLoading.value = false;
    });
}

function updateIP(): Promise<AxiosResponse> {
  buttlonLoading.value = true;
  return iPService.updateIP(
    authStore.getToken,
    etablissementStore.getCurrentEtablissement.siren,
    bufferActions.value
  );
}

function addActionToBuffer(action: string): void {
  bufferActions.value.push({
    idIp: currentIP.value.id,
    action: action,
    ip: currentIP.value.ip,
    commentaire: commentaires.value
  });
  addActionToDatatable(action, currentIP.value.id);
  commentaires.value = "";
  dialog.value = false;
  refreshKey.value++;
}

function addActionToDatatable(action: string, id: number) {
  acces.value.forEach(element => {
    if (element.id === id) {
      element.buffer = action;
    }
  });
}

async function supprimerIP(IDip: string, ip: string) {
  const confirmed = await confirmRef.value?.open(
    `Vous êtes sur le point de supprimer définitivement l'adresse IP ou plage d'adresses IP ${ip}

                Etes-vous sûr de vouloir effectuer cette action ?`
  );
  if (confirmed) {
    buttlonLoading.value = true;
    clearAlerts();

    iPService
      .deleteIP(authStore.getToken, IDip)
      .then(() => {
        notification.value = "IP supprimée.";
      })
      .catch(err => {
        Logger.error(err);
        error.value = err.message;
      })
      .finally(() => {
        buttlonLoading.value = false;
        collecterAcces();
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
  acces.value.forEach(element => {
    if (element.buffer !== undefined) {
      delete element.buffer;
    }
  });
}

function clearAlerts() {
  notification.value = "";
  error.value = "";
}

function getSirenEtabSujet() {
  if (isAdmin.value && props.sirenEtabSiAdmin) {
    return etablissementStore.getCurrentEtablissement.siren;
  }
  return authStore.user.siren;
}

function eventStatutChoice(element: string): void {
  statut.value = element === "Tous" ? "" : element;
}

function eventTypeChoice(element: string): void {
  type.value = element === "Tous" ? "" : element;
}

function downloadIPs(): void {
  isExportLoading.value = true;
  const ids = acces.value.map(element => element.id);
  iPService
    .downloadIps(ids, authStore.user.token)
    .then(response => {
      const fileURL = window.URL.createObjectURL(
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

function revenirInfosEtab(): void {
  router.push({ name: "AfficherEtablissement" });
}
</script>

<style src="./style.css"></style>
