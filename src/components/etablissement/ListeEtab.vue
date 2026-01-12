<template>
  <v-container variant="flat" :disabled="disableForm">
    <h1>Gestion des comptes établissements</h1>
    <v-container-title class="pr-0">
      <v-row class="d-flex flex-row-reverse ma-0">
        <v-btn @click="allerAScionnerEtab" class="btn-1 ml-2">
          Scission
          <FontAwesomeIcon :icon="faObjectUngroup" class="mx-2" />
        </v-btn>
        <v-btn @click="allerAFusionnerEtab" class="btn-1 mx-2">
          Fusion
          <FontAwesomeIcon :icon="faObjectGroup" class="mx-2" />
        </v-btn>
        <v-btn @click="ajouterEtablissement" class="btn-1 mx-2">
          Créer un établissement
          <FontAwesomeIcon :icon="faPlus" class="mx-2" />
        </v-btn>
      </v-row>
    </v-container-title>
    <v-card class="mt-3 fondGris">
      <VDataTable
        density="compact"
        :headers="headers"
        :header-props="{class: 'bg-primary'}"
        :items="filteredEtabByStatut"
        :items-per-page="25"
        :items-per-page-options="[25, 50, 100, { value: -1, title: 'Tous' }]"
        class="elevation-0 pa-0"
        :search="rechercher"
        :loading="dataLoading"
        id="mytable"
      >
        <template #top>
          <v-row class="ma-3">
            <v-col cols="12" sm="6" class="px-0">
              <v-tooltip
                text="Le téléchargement correspond à la vue filtrée"
                location="top"
                open-delay="100"
                theme="dark"
                content-class="text-white"
              >
                <template #activator="{ props }">
                  <v-btn
                    variant="text"
                    @click="downloadEtablissements"
                    class="pl-0 bouton-simple"
                    v-bind="props"
                    :loading="isExportLoading"
                  >
                    <h2>Télécharger la liste des établissements</h2>
                    <FontAwesomeIcon
                      :icon="faDownload"
                      size="2x"
                      class="mx-2"
                    />
                  </v-btn>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="0" sm="3" class="px-0"></v-col>
            <v-col cols="12" sm="3" class="px-0">
              <div class="d-flex align-content-end justify-end">
                <v-text-field
                  v-model="rechercher"
                  label="Chercher dans les colonnes"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                />
              </div>
            </v-col>
          </v-row>
        </template>

        <template v-slot:headers="{ columns, toggleSort, isSorted, getSortIcon }">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="text-left"
              @click="column.sortable ? toggleSort(column) : ''"
            >
              <div style="display: flex; align-items: center; white-space: nowrap;">
                <span>{{ column.title }}</span>

                <v-icon
                  v-if="column.sortable && !isSorted(column)"
                  class="pl-2"
                  size="small"
                >
                  mdi-sort
                </v-icon>
                <v-icon
                  v-else-if="column.sortable"
                  class="pl-2"
                  size="small"
                >
                  {{ getSortIcon(column) }}
                </v-icon>

                <v-menu
                  v-if="column.key === 'typeEtablissement' || column.key === 'statutIP'"
                  :close-on-content-click="false"
                >
                  <template #activator="{ props }">
                    <v-btn
                      :aria-label="column.key"
                      icon
                      variant="text"
                      class="ml-1"
                      v-bind="props"
                    >
                      <v-icon
                        small
                        :color="column.key === 'typeEtablissement' ? (selectedType ? 'primary' : '') : (statut ? 'primary' : '')"
                      >
                        mdi-filter
                      </v-icon>
                    </v-btn>
                  </template>
                  <div
                    v-if="column.key === 'typeEtablissement'"
                    style="background-color: white;"
                    class="pl-4 pr-8"
                  >
                    <ul>
                      <li
                        v-for="item in typesEtab"
                        :key="item"
                        @click="eventTypeEtabChoice(item)"
                      >
                        <a>{{ item }}</a>
                      </li>
                    </ul>
                  </div>
                  <div
                    v-if="column.key === 'statutIP'"
                    style="background-color: white;"
                    class="pl-4 pr-8"
                  >
                    <ul>
                      <li
                        v-for="item in selectStatut"
                        :key="item"
                        @click="eventStatutChoice(item)"
                      >
                        <a>{{ item }}</a>
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
          <a class="bouton-simple" @click="allerAAfficherEtab(item)">
            <strong>{{ item.nom }}</strong>
          </a>
        </template>

        <template #item.action="{ item }">
          <v-icon large class="mr-2" @click="allerAIPs(item)">
            mdi-ip-network
          </v-icon>
        </template>
      </VDataTable>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { VDataTable } from "vuetify/components";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import Etablissement from "@/core/Etablissement";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/authStore";
import { useSnackbar } from "@/composables/useSnackbar";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { faDownload, faObjectGroup, faObjectUngroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import { DataTableHeader } from "vuetify";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const etablissementStore = useEtablissementStore();
const router = useRouter();

const disableForm = ref(false);
const statut = ref("");
const dataLoading = ref(true);
const selectStatut = ref<Array<string>>([
  "Tous",
  "Sans IP",
  "Examiner IP",
  "Attestation à envoyer",
  "IP Ok"
]);
const rechercher = ref("");
const etabs = ref<Array<Etablissement>>([]);
const etabsFiltered = ref<Array<Etablissement>>([]);
const selectedType = ref("");
const typesEtab = ref<Array<string>>([]);
const isDisableForm = ref(false);
const isExportLoading = ref(false);
const headers: DataTableHeader[] = [
  {
    title: "Date de création",
    align: "start",
    key: "dateCreationFormattedInString",
    sortable: true,
    
  },
  { title: "Identifiant Abes", key: "idAbes", sortable: true },
  { title: "SIREN", key: "siren", sortable: true },
  { title: "Nom de l'établissement", key: "nom", sortable: true },
  {
    title: "Type d'établissement",
    key: "typeEtablissement",
    sortable: true
  },
  {
    title: "Dernière date de modification des IPs",
    key: "dateModificationDerniereIp",
    sortable: true
  },
  { title: "Statut", key: "statutIP", sortable: true },
  { title: "Liste des IPs", key: "action", sortable: false }
];

const isAdmin = computed(() => authStore.isAdmin);

onMounted(() => {
  if (!isAdmin.value) {
    const message = new Message();
    message.type = MessageType.ERREUR;
    message.texte =
      "Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissemnts";
    message.isSticky = true;
    snackbar.show(message.text ?? message.texte ?? "");
    router.push({ name: "Home" }).catch(err => {
      Logger.error(err as any);
    });
    return;
  }

  collecterEtab();
  fetchListeType();
});

const filteredEtabByStatut = computed((): Array<Etablissement> => {
  const conditions: Array<string> = [];
  if (statut.value) {
    conditions.push(statut.value);
  }
  if (selectedType.value) {
    conditions.push(selectedType.value);
  }

  if (conditions.length > 0) {
    etabsFiltered.value = etabs.value.filter(acces =>
      conditions.every(
        condition =>
          acces.typeEtablissement == condition || acces.statutIP == condition
      )
    );
    return etabsFiltered.value;
  }

  etabs.value.forEach(element => {
    element.dateCreationFormattedInString = moment(
      element.dateCreation
    ).format("YYYY-MM-DD");
    if (element.dateModificationDerniereIp) {
      element.dateModificationDerniereIp = element.dateModificationDerniereIp.replace(
        /-/g,
        "/"
      );
    }
  });
  overrideStatuts();
  etabsFiltered.value = etabs.value;
  return etabsFiltered.value;
});

function overrideStatuts(): void {
  etabs.value.forEach(element => {
    if (element.statut === "Nouveau") {
      element.statutIP = "Nouveau";
    }
  });
}

function eventTypeEtabChoice(element: string): void {
  selectedType.value = element === "Tous" ? "" : element;
}

function eventStatutChoice(element: string): void {
  statut.value = element === "Tous" ? "" : element;
}

async function fetchListeType() {
  snackbar.hide();
  await etablissementService
    .listeType()
    .then(result => {
      isDisableForm.value = false;
      typesEtab.value = [...result, "Tous"].sort((n1, n2) =>
        n1 > n2 ? 1 : n1 < n2 ? -1 : 0
      );
      typesEtab.value.unshift(
        typesEtab.value.splice(
          typesEtab.value.findIndex(item => item === "Tous"),
          1
        )[0]
      );
    })
    .catch(err => {
      Logger.error(err.toString());
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesApiError) {
        isDisableForm.value = true;
        message.texte =
          "Fonctionnalité momentanement indisponible pour le moment. Réessayer plus tard";
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;
      snackbar.show(message.text ?? message.texte ?? "");
    });
}

function ajouterEtablissement(): void {
  snackbar.hide();
  etablissementStore
    .setCurrentEtablissement(new Etablissement())
    .then(() => {
      router.push({ name: "CreationEtablissement" }).catch(err => {
        Logger.error(err as any);
      });
    })
    .catch(err => {
      Logger.error(err.toString());
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;

      snackbar.show(message.text ?? message.texte ?? "");
      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        window.scrollTo(0, messageBox.offsetTop);
      }
    });
}

function allerAFusionnerEtab(): void {
  snackbar.hide();
  router.push({ name: "FusionEtablissement" }).catch(err => {
    Logger.error(err as any);
  });
}

function allerAScionnerEtab(): void {
  snackbar.hide();
  router.push({ name: "ScissionEtablissement" }).catch(err => {
    Logger.error(err as any);
  });
}

function collecterEtab(): void {
  snackbar.hide();
  etablissementService
    .getEtablissements(authStore.getToken)
    .then(response => {
      etabs.value = response;
    })
    .catch(err => {
      Logger.error(err.toString());
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else if (err instanceof LicencesNationalesUnauthorizedApiError) {
        disableForm.value = true;
        message.texte =
          "Vous n'êtes pas autorisé à effectuer cette opération";
        setTimeout(() => {
          router.push({ name: "Home" });
        });
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;
      snackbar.show(message.text ?? message.texte ?? "");
    })
    .finally(() => {
      dataLoading.value = false;
    });
}

function allerAIPs(item: Etablissement): void {
  snackbar.hide();
  etablissementStore
    .setCurrentEtablissement(item)
    .then(() => {
      router.push({ name: "ListeIP" });
    })
    .catch(err => {
      Logger.error(err.toString());
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;

      snackbar.show(message.text ?? message.texte ?? "");
      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        window.scrollTo(0, messageBox.offsetTop);
      }
    });
}

function downloadEtablissements(): void {
  isExportLoading.value = true;
  snackbar.hide();
  const sirens = new Array<string>();
  etabsFiltered.value.forEach(element => {
    sirens.push(element.siren);
  });
  etablissementService
    .downloadEtablissements(sirens, authStore.user.token)
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
      Logger.error(err.toString());
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;

      snackbar.show(message.text ?? message.texte ?? "");

      isExportLoading.value = false;
    });
}

function allerAAfficherEtab(item: Etablissement): void {
  snackbar.hide();
  etablissementStore
    .setCurrentEtablissement(item)
    .then(() => {
      router.push({ name: "AfficherEtablissement" });
    })
    .catch(err => {
      Logger.error(err.toString());
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;

      snackbar.show(message.text ?? message.texte ?? "");
      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        window.scrollTo(0, messageBox.offsetTop);
      }
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
