<template>
  <div>
    <v-container class="pb-0" :disabled="disableForm">
      <h1>Gestion des éditeurs</h1>
      <v-row class="ma-0">
        <v-col cols="12" md="6" lg="6" xl="6" class="pa-0">
          <MessageBox />
          <ConfirmPopup ref="confirmRef" />
        </v-col>
      </v-row>
      <div class="d-flex flex-row-reverse flex-wrap">
        <v-btn @click="ajouterEditeur" class="btn-1 mx-2 mr-0 my-2">
          Créer un éditeur
          <FontAwesomeIcon :icon="faCirclePlus" class="mx-2" />
        </v-btn>
      </div>
    </v-container>

    <v-card variant="flat" class="mt-2" :disabled="disableForm">
      <v-card-text class="fondGris">
      <VDataTable
        :headers="headers"
        :header-props="{class: 'bg-primary'}"
        :items="editeurs"
        :items-per-page="25"
        :items-per-page-options="[25, 50, 100, { value: -1, title: 'Tous' }]"
        class="elevation-0 ma-3"
        :search="rechercher"
        density="compact"
        :loading="dataLoading"
        id="mytable"
      >
        <template #top>
          <v-row class="ma-0">
            <v-col cols="12" sm="6" class="px-0">
              <v-tooltip
                text="Le téléchargement correspond à la vue filtrée"
                location="top"
                max-width="20vw"
                open-delay="100"
                theme="dark"
                content-class="text-white"
              >
                <template #activator="{ props }">
                  <v-btn
                    variant="text"
                    @click="downloadEditeurs"
                    class="bouton-simple pl-0"
                    v-bind="props"
                    :loading="isExportLoading"
                  >
                    <h2>Télécharger la liste des éditeurs</h2>
                    <FontAwesomeIcon
                      :icon="download"
                      class="mx-2"
                      size="2x"
                    />
                  </v-btn>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="0" sm="3" class="px-0"></v-col>
            <v-col cols="12" sm="3" class="px-0">
              <v-text-field
                v-model="rechercher"
                label="Chercher dans les colonnes"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
          </v-row>
        </template>

        <template #item.dateCreation="{ item }">
          <span>{{ item.dateCreation.toLocaleDateString() }}</span>
        </template>

        <template #item.action="{ item }">
          <v-btn
            class="ma-0 pa-0"
            variant="plain"
            @click="modifierEditeur(item)"
          >
            <FontAwesomeIcon color="#1f3f5f" :icon="faPenToSquare" />
          </v-btn>
          <v-btn
            class="ma-0 pa-0 bouton-simple"
            variant="plain"
            @click="supprimerEditeur(item)"
          >
            <FontAwesomeIcon :icon="faXmark" color="red" />
          </v-btn>
        </template>
      </VDataTable>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { VDataTable } from "vuetify/components";
import { Logger } from "@/utils/Logger";
import Editeur from "@/core/Editeur";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import MessageBox from "@/components/common/MessageBox.vue";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCirclePlus,
  faPenToSquare,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useEditeurStore } from "@/stores/editeurStore";
import { DataTableHeader } from "vuetify";

const authStore = useAuthStore();
const messageStore = useMessageStore();
const editeurStore = useEditeurStore();
const router = useRouter();

const disableForm = ref(false);
const isExportLoading = ref(false);
const rechercher = ref("");
const editeurs = ref<Array<Editeur>>([]);
const dataLoading = ref(true);
const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);

const headers: DataTableHeader[] = [
  {
    title: "Date de création du compte éditeur",
    align: "start",
    key: "dateCreation",
    sortable: true
  },
  { title: "Nom de l'éditeur", key: "nom", sortable: true },
  { title: "Action", key: "action", sortable: false }
];

const isAdmin = computed(() => authStore.isAdmin);

onMounted(() => {
  if (!isAdmin.value) {
    const message = new Message();
    message.type = MessageType.ERREUR;
    message.texte =
      "Vous n'êtes pas autorisé à exécuter l'action ListeEditeur";
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);
    router.push({ name: "Home" }).catch(err => Logger.error(err.toString()));
    return;
  }
  fetchEditeurs();
});

function fetchEditeurs() {
  editeurService
    .getEditeurs(authStore.getToken)
    .then(res => {
      editeurs.value = res;
    })
    .catch(err => {
      Logger.error(err.toString());
      const message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else if (err instanceof LicencesNationalesUnauthorizedApiError) {
        disableForm.value = true;
        message.texte =
          "Vous n'êtes pas autorisé à effectuer cette opération";
        setTimeout(() => {
          router.push({ name: "Home" }).catch(r => Logger.error(r.toString()));
        });
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;
      messageStore.openDisplayedMessage(message);
    })
    .finally(() => {
      dataLoading.value = false;
    });
}

async function ajouterEditeur() {
  messageStore.closeDisplayedMessage();
  try {
    await editeurStore.setCurrentEditeur(new Editeur());
    router.push({ name: "NouvelEditeur" });
  } catch (err: any) {
    Logger.error(err.toString());
    const message = new Message();
    message.type = MessageType.ERREUR;
    message.texte = buildErrorMessage(err);
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);
  }
}

async function modifierEditeur(item: Editeur) {
  messageStore.closeDisplayedMessage();
  try {
    await editeurStore.setCurrentEditeur(item);
    router.push({ name: "ModifierEditeur" });
  } catch (err: any) {
    Logger.error(err.toString());
    const message = new Message();
    message.type = MessageType.ERREUR;
    message.texte = buildErrorMessage(err);
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);
  }
}

function downloadEditeurs(): void {
  isExportLoading.value = true;
  messageStore.closeDisplayedMessage();
  const ids = editeurs.value.map(element => element.id);

  editeurService
    .downloadEditeurs(ids, authStore.user.token)
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
      const message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;

      messageStore.openDisplayedMessage(message);
      isExportLoading.value = false;
    });
}

async function supprimerEditeur(item: Editeur) {
  messageStore.closeDisplayedMessage();

  const confirmed = await confirmRef.value?.open(
    `Vous êtes sur le point de supprimer le compte de l'éditeur ${item.nom}

                Etes-vous sûr de vouloir continuer ?`
  );

  if (!confirmed) {
    return;
  }

  editeurService
    .deleteEditeur(item.id, authStore.getToken)
    .then(() => {
      const message = new Message();
      message.type = MessageType.VALIDATION;
      message.texte = `L'éditeur ${item.nom} a bien été supprimé`;
      message.isSticky = false;
      messageStore.openDisplayedMessage(message);

      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        window.scrollTo(0, messageBox.offsetTop);
      }
      fetchEditeurs();
    })
    .catch(err => {
      Logger.error(err.toString());
      const message = new Message();
      message.type = MessageType.ERREUR;
      if (err instanceof LicencesNationalesBadRequestApiError) {
        message.texte = err.message;
      } else {
        message.texte = "Impossible d'exécuter l'action : " + err.message;
      }
      message.isSticky = true;

      messageStore.openDisplayedMessage(message);
    });
}

function buildErrorMessage(err: any) {
  if (err instanceof LicencesNationalesBadRequestApiError) {
    return err.message;
  }
  return "Impossible d'exécuter l'action : " + err.message;
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
