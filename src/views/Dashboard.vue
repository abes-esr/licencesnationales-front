<template>
  <v-container>
    <h1>
      Tableau de bord <span v-if="!isAdmin">{{ etablissement.nom }}</span>
    </h1>
    <ConfirmPopup ref="confirmRef"></ConfirmPopup>
    <v-card class="pt-0 elevation-0" :class="[display.lgAndDown.value ? 'large-container' : '']">
      <v-card-text class="fondGris pa-0 px-6 pb-6">
        <v-card-title class="px-0 pb-2">Information du compte
          <v-tooltip text="Exporter les infos du compte" location="top" open-delay="100" theme="dark"
            content-class="text-white">
            <template v-slot:activator="{ props }">
              <v-btn icon="icon" class="bouton-simple" @click="downloadEtablissement()" v-bind="props"
                :loading="isExportLoading">
                <FontAwesomeIcon :icon="faDownload" class="mx-2 fa-lg" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-card-title>
        <span>Compte créé le :
          {{ etablissement.dateCreation.toLocaleDateString() }}</span>
        <v-row class="d-flex justify-space-between flex-wrap pt-3">
          <v-col cols="12" md="3" lg="3" xl="3" v-if="!isAdmin">
            <div style="height: 100%; position:relative;" class="borderCol fondBlanc"
              :class="[display.mdAndDown.value ? 'compact-form' : '']">
              <div class="d-flex">
                <h2 class="my-3 pl-4 mb-0">Etablissement</h2>
                <v-tooltip text="Non modifiable par l'utilisateur" location="top" open-delay="100" theme="dark"
                  content-class="text-white" v-if="!isAdmin">
                  <template v-slot:activator="{ props }">
                    <FontAwesomeIcon v-bind="props" :icon="faLock" class="fa-2x mx-2"
                      style="margin-top: 10px; position: absolute; right: 0;" />
                  </template>
                </v-tooltip>
              </div>
              <v-card-text class="d-flex align-content-start flex-wrap pt-0 no-border">
                <div class="d-flex flex-column justify-start mx-3  mb-3 mt-0 bloc-info">
                  <div class="mt-2">
                    <h3 class="d-inline">Siren :</h3>
                    {{ etablissement.siren }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">ID Abes :</h3>
                    {{ etablissement.idAbes }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Nom :</h3>
                    {{ etablissement.nom }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Type :</h3>
                    {{ etablissement.typeEtablissement }}
                  </div>
                </div>
              </v-card-text>
              <v-alert outlined class="ma-2 pt-1 pb-0" style="position: absolute; bottom: 0; font-size: 14px;">
                <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 icone-information" />
                <p class="mb-0 pl-12">
                  Pour toute demande de modification des infos de
                  l'établissement, nous contacter via le guichet d'assistance
                  <a href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank">ABESstp
                  </a>
                </p>
              </v-alert>
            </div>
          </v-col>
          <v-col cols="12" md="3" lg="3" xl="3" v-if="!isAdmin">
            <div style="height: 100%; position: relative;" class="borderCol fondBlanc">
              <div class="d-flex justify-space-between align-center">
                <h2 class="my-3 pl-4 mb-0">
                  Contact
                </h2>
              </div>
              <v-card-text class="d-flex align-content-start flex-wrap pt-0 no-border">
                <div class="d-flex flex-column justify-start mx-3 mb-3 mt-0 bloc-info">
                  <div class="mt-2">
                    <h3 class="d-inline">Nom :</h3>
                    {{ etablissement.contact.nom }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Prénom :</h3>
                    {{ etablissement.contact.prenom }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Tél :</h3>
                    {{ etablissement.contact.telephone }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Email :</h3>
                    {{ etablissement.contact.mail }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Adresse :</h3>
                    {{ etablissement.contact.adresse }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">BP :</h3>
                    {{ etablissement.contact.boitePostale }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Code postal :</h3>
                    {{ etablissement.contact.codePostal }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Ville :</h3>
                    {{ etablissement.contact.ville }}
                  </div>
                  <div class="mt-2">
                    <h3 class="d-inline">Cedex :</h3>
                    {{ etablissement.contact.cedex }}
                  </div>
                </div>
                <v-row style="position: absolute; bottom: 0; right: 0;" class="text-right pb-4 pr-4">
                  <v-col cols="12">
                    <v-btn variant="tonal" @click="allerAMonProfil()">Modifier contact</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-btn variant="tonal" @click="allerAModifierMotDePasse()">Modifier mot de passe</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <div style="height: 100%" class="borderCol fondBlanc">
              <v-card-title class="d-block titre-block" style="margin-bottom:-4px;">
                <FontAwesomeIcon :icon="faBell" class="fa-lg mx-2 icone-standard" />
                <span v-if="isAdmin">Dernières actions des utilisateurs</span>
                <span v-else>Actions à faire</span>
              </v-card-title>
              <v-card-text class="d-flex align-content-start flex-wrap notifs no-border">
                <div class="d-flex flex-column justify-start mx-3 my-3  bloc-info">
                  <div v-if="notifsLoading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                  <ul>
                    <li style="margin-bottom: 1em" v-for="item in notificationsAdmin" :key="item.index">
                      Siren: {{ item.siren }}<br />Nom établissement:
                      <a @click="allerPageEtablissement(item.siren)">{{
                        item.nomEtab
                      }}</a><br />Evenement: {{ item.typeNotif }}<br />Date:
                      {{ dateFormatted(item.dateEvent) }}
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
                Envoi aux éditeurs
              </v-card-title>
              <v-card-text class="no-border">
                <div class="d-flex flex-column justify-start mx-3 my-3  bloc-info">
                  <div v-if="datesLoading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                  <ul>
                    <li style="margin-bottom: 0.5em" v-for="item in datesEnvoi" :key="item">
                      <span v-html="item"></span>
                    </li>
                  </ul>
                </div>
                <div class="w-100 d-flex justify-end">
                  <v-btn @click="envoiEditeurs()" class="ma-4">Envoi aux éditeurs</v-btn>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment/moment";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import Etablissement from "@/core/Etablissement";
import { Notification } from "@/core/Notification";

import { useSnackbar } from "@/composables/useSnackbar";
import { useAuthStore } from "@/stores/authStore";
import { useEtablissementStore } from "@/stores/etablissementStore";

import { useEditeurService } from "@/composables/useEditeurService";
import { useEtablissementService } from "@/composables/useEtablissementService";
import { RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import { faBell, faCircleInfo, faDownload, faLock, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

// Composables
const router = useRouter();
const display = useDisplay();
const authStore = useAuthStore();
const etablissementStore = useEtablissementStore();
const snackbar = useSnackbar();
const editeurService = useEditeurService();
const etablissementService = useEtablissementService();

const etablissement = ref<Etablissement>(etablissementStore.getCurrentEtablissement);
const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const isAdmin = computed(() => authStore.isAdmin);
const isExportLoading = ref(false);
const notificationsAdmin = ref<Array<Notification>>([]);
const notificationsUser = ref<Array<NotificationUser>>([]);
const datesEnvoi = ref<Array<string>>([]);
const buttonLoading = ref(false);
const notifsLoading = ref(true);
const datesLoading = ref(true);

const metaInfo = () => ({
  meta: [
    {
      name: "description",
      content:
        "Tableau de bord utilisateur de l'application des Licences Nationales",

    },
    { name: "keywords", content: "tableau de bord licences nationales" }
  ],
  title: "Tableau de bord - Licences Nationales"
});

onMounted(() => {
  snackbar.hide();
});

const dateFormatted = (d: Date): string => {
  return moment(d).format("DD/MM/YYYY");
};

const allerAMonProfil = (): void => {
  router.push({ name: RouteName.Profile });
};

const allerAModifierMotDePasse = (): void => {
  router.push({ name: RouteName.Password }).catch(err => {
    Logger.error(err);
  });
};

const downloadEtablissement = (): void => {
  isExportLoading.value = true;
  snackbar.hide();
  const siren = new Array<string>();
  siren.push(authStore.user.siren);
  etablissementService
    .downloadEtablissements(siren, authStore.user.token)
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
      snackbar.error(err)
      isExportLoading.value = false;
    });
};

const allerPageEtablissement = (siren: string): void => {
  const etablissementCible = new Etablissement();
  etablissementCible.siren = siren;
  etablissementCible.id = 0;
  allerAAfficherEtab(etablissementCible);
};

const collecterDates = (): void => {
  if (authStore.isAdmin) {
    editeurService
      .getDatesEnvoiEditeurs(authStore.getToken)
      .then(result => {
        result.data.forEach(element => {
          datesEnvoi.value.push(
            "<strong>Envoyé le " +
            moment(element).format("DD/MM/YYYY HH:MM") +
            "</strong> - " +
            moment(element).fromNow()
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

const collecterNotifs = (): void => {
  if (authStore.isAdmin) {
    etablissementService
      .getNotificationsAdmin(authStore.getToken)
      .then(response => {
        notificationsAdmin.value = response;
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        notifsLoading.value = false;
      });
  } else {
    etablissementService
      .getNotificationsEtab(
        authStore.userSiren,
        authStore.getToken
      )
      .then(response => {
        notificationsUser.value = response;
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        notifsLoading.value = false;
      });
  }
};

const allerAAfficherEtab = (item: Etablissement): void => {
  snackbar.hide();
  etablissementStore
    .setCurrentEtablissement(item)
    .then(() => {
      router.push({ name: RouteName.InstitutionView });
    })
    .catch(err => {
      snackbar.error(err);
    });
};

const envoiEditeurs = async () => {
  const confirmed = await confirmRef.value?.open(
    `Vous êtes sur le point de lancer le traitement d'envoi aux éditeurs.

                Etes-vous sûr de vouloir continuer ?`
  );
  if (confirmed) {
    buttonLoading.value = true;
    editeurService
      .envoiEditeurs(authStore.getToken)
      .then(response => {
        snackbar.success(response.data.message);
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  }
};

collecterNotifs();
collecterDates();
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