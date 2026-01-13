<template>
  <v-container variant="flat">
    <h1>Etablissement {{ etablissement.nom }}</h1>
    <v-col cols="12" md="6" lg="6" xl="6" class="pa-1">
      <ConfirmPopup ref="confirmRef" />
    </v-col>
    <v-container class=" elevation-0 pt-0">
      <v-col cols="12" class="d-flex align-content-start justify-space-between flex-wrap mx-0 px-0 py-0">
        <v-card-title class="px-0">
          Information du compte
          <v-tooltip text="Exporter les infos du compte" location="top" open-delay="100" theme="dark"
            content-class="text-white">
            <template v-slot:activator="{ props }">
              <v-btn icon @click="downloadEtablissement" class="bouton-simple" v-bind="props"
                :loading="isExportLoading">
                <FontAwesomeIcon :icon="faDownload" class="mx-2 fa-lg" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-card-title>

        <v-btn variant="tonal" class="mt-3" @click="allerAIPs">
          Voir la liste des IPs
          <v-icon class="ml-2">mdi-ip-network</v-icon>
        </v-btn>
      </v-col>
      <span class="d-block">
        Compte créé le :
        {{ etablissement.dateCreation.toLocaleDateString() }}
      </span>
      <v-btn v-if="modificationModeDisabled" class="mt-3" variant="tonal" style="margin-right: 1em"
        @click="entrerEnModification">
        Modifier le compte
      </v-btn>
      <v-btn v-if="!modificationModeDisabled" class="mt-3" variant="tonal" @click="validerModifications"
        style="margin-right: 1em" color="success">
        Valider les modifications du compte
      </v-btn>
      <v-btn v-if="!modificationModeDisabled" class="mt-3" variant="tonal" @click="annulerModifications">
        Réinitialiser les champs d'origine
      </v-btn>
      <v-btn v-if="modificationModeDisabled && getEtablissement.statut !== 'Validé'" class="mt-3" variant="tonal"
        style="margin-right: 1em" :loading="buttonValidationLoading" @click="validerEtablissement">
        Valider le compte
      </v-btn>
      <v-btn v-if="modificationModeDisabled && getEtablissement.statut === 'Validé'" class="btn-5  mt-3"
        :loading="buttonValidationLoading" @click="devaliderEtablissement">
        Dévalider le compte
      </v-btn>
      <v-row class="d-flex justify-space-between flex-wrap ma-0 pa-0">
        <v-col cols="12" md="6" lg="6" xl="6" class="d-flex align-content-start justify-center flex-wrap px-0 pr-2">
          <v-card class="d-flex justify-space-between flex-column w-100 pa-4">
            <div class="d-flex justify-space-between align-center">
              <h2 class="mb-3">Etablissement</h2>
              <v-tooltip text="Non modifiable par l'utilisateur" location="top" open-delay="100" theme="dark"
                content-class="text-white" v-if="!isAdmin">
                <template v-slot:activator="{ props }">
                  <FontAwesomeIcon v-bind="props" :icon="faLock" class="fa-2x mx-2" />
                </template>
              </v-tooltip>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <v-text-field label="Siren" placeholder="Siren" variant="outlined" v-model="etablissement.siren" disabled
                class="mt-1" />
              <v-text-field label="Nom de l'établissement" placeholder="Nom de l'établissement" variant="outlined"
                v-model="etablissement.nom" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="ID Abes" placeholder="ID Abes" variant="outlined" v-model="etablissement.idAbes"
                disabled class="mt-1" />
              <v-select label="Type d'établissement" :items="typesEtab" variant="outlined"
                v-model="etablissement.typeEtablissement" :disabled="modificationModeDisabled" class="mt-1" />
              <div class="mt-1">
                <h3 class="d-inline">Statut de l'établissement:</h3>
                {{ etablissement.statut }}
              </div>
              <div class="mt-1">
                <h3 class="d-inline">Statut IP :</h3>
                {{ etablissement.statutIP }}
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" class="d-flex align-content-start justify-center flex-wrap px-0 pl-2">
          <v-card class="d-flex justify-space-between flex-column w-100 pa-4">
            <div class="d-flex justify-space-between align-center">
              <h2 class="mb-3">Contact</h2>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <v-text-field label="Nom du contact" placeholder="Nom du contact" variant="outlined"
                v-model="etablissement.contact.nom" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Prénom du contact" placeholder="Prénom du contact" variant="outlined"
                v-model="etablissement.contact.prenom" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Téléphone du contact" placeholder="Téléphone du contact" variant="outlined"
                v-model="etablissement.contact.telephone" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Mail du contact" placeholder="Mail du contact" variant="outlined"
                v-model="etablissement.contact.mail" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Adresse du contact" placeholder="Adresse du contact" variant="outlined"
                v-model="etablissement.contact.adresse" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="BP du contact" placeholder="BP du contact" variant="outlined"
                v-model="etablissement.contact.boitePostale" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Code Postal du contact" placeholder="Code Postal du contact" variant="outlined"
                v-model="etablissement.contact.codePostal" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Ville du contact" placeholder="Ville du contact" variant="outlined"
                v-model="etablissement.contact.ville" :disabled="modificationModeDisabled" class="mt-1" />
              <v-text-field label="Cedex du contact" placeholder="Cedex du contact" variant="outlined"
                v-model="etablissement.contact.cedex" :disabled="modificationModeDisabled" class="mt-1" />
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="button" class="bouton-supprimer" :loading="buttonSuppresionLoading"
            @click="supprimerEtablissement">
            Supprimer le compte
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { useEtablissementService } from "@/composables/useEtablissementService";
import { useSnackbar } from "@/composables/useSnackbar";
import Etablissement from "@/core/Etablissement";
import { RouteName } from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { faDownload, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const etablissementStore = useEtablissementStore();
const router = useRouter();
const etablissementService = useEtablissementService();

const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const etablissement = ref<Etablissement>(etablissementStore.getCurrentEtablissement);
const buttonValidationLoading = ref(false);
const buttonSuppresionLoading = ref(false);
const isExportLoading = ref(false);
const typesEtab = ref<Array<string>>([]);
const modificationModeDisabled = ref(true);

const isAdmin = computed(() => authStore.isAdmin);
const getEtablissement = computed(() => etablissementStore.getCurrentEtablissement);

onMounted(() => {
  fetchListeType();
  if (!isAdmin.value) {
    snackbar.error("Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissemnt");
    router.push({ name: RouteName.Home });
  }
});

async function fetchListeType() {
  try {
    typesEtab.value = await etablissementService.listeType();
  } catch (err: any) {
    snackbar.error(err)
  }
}

function allerAIPs(): void {
  snackbar.hide();
  router.push({ name: RouteName.IpList });
}

async function supprimerEtablissement() {
  buttonSuppresionLoading.value = true;
  snackbar.hide();

  const confirmed = await confirmRef.value?.open(
    `ATTENTION : Vous êtes sur le point de supprimer définitivement le compte de l'établissement ${etablissement.value.nom} avec toutes les informations associées (les des IPs,...)


      Etes-vous sûr de vouloir effectuer cette ation ?`
  );
  if (confirmed) {
    etablissementService
      .deleteEtab(etablissement.value.siren, authStore.getToken)
      .then(() => {
        snackbar.success("Le compte a bien été supprimé", {
          onHide: () => {
            router.push({ name: RouteName.Institutions });
          },
          timeout: 4000
        });

      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonSuppresionLoading.value = false;
      });
  } else {
    buttonSuppresionLoading.value = false;
  }
}

async function validerEtablissement() {
  buttonValidationLoading.value = true;
  snackbar.hide();

  const confirmed = await confirmRef.value?.open(
    `Vous êtes sur le point de valider le compte de l'établissement ${etablissement.value.nom}

      Etes-vous sûr de vouloir effectuer cette ation ?`
  );
  if (confirmed) {
    etablissement.value.statut = "Validé";
    etablissementService
      .validerEtablissement(etablissement.value.siren, authStore.getToken)
      .then(response => {
        etablissementStore.updateCurrentEtablissement(etablissement.value);
        snackbar.success(response.data.message);
      })
      .catch((err: any) => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonValidationLoading.value = false;
      });
  } else {
    buttonValidationLoading.value = false;
  }
}

async function devaliderEtablissement() {
  buttonValidationLoading.value = true;
  snackbar.hide();

  const confirmed = await confirmRef.value?.open(
    `Vous êtes sur le point de dévalider le compte de l'établissement ${etablissement.value.nom}

      Etes-vous sûr de vouloir effectuer cette ation ?`
  );
  if (confirmed) {
    etablissement.value.statut = "Nouveau";
    etablissementService
      .devaliderEtablissement(etablissement.value.siren, authStore.getToken)
      .then(response => {
        etablissementStore.updateCurrentEtablissement(etablissement.value);
        snackbar.success(response.data.message);
      })
      .catch((err: any) => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonValidationLoading.value = false;
      });
  } else {
    buttonValidationLoading.value = false;
  }
}

function entrerEnModification(): void {
  console.log("ENTRY");
  modificationModeDisabled.value = false;
}

function validerModifications(): void {
  etablissementService
    .updateEtablissement(
      etablissement.value,
      authStore.getToken,
      authStore.isAdmin
    )
    .then(() => {
      etablissementStore.updateCurrentEtablissement(etablissement.value);
    })
    .catch((err: any) => {
      snackbar.error(err);
    })
    .finally(() => {
      console.log("FINAL VALID");

      modificationModeDisabled.value = true;
    });
}

function annulerModifications(): void {
  etablissement.value = etablissementStore.getCurrentEtablissement;
  modificationModeDisabled.value = true;
  console.log("CANCEL");

}

console.log(modificationModeDisabled.value);

function downloadEtablissement(): void {
  isExportLoading.value = true;
  snackbar.hide();
  const siren = [etablissement.value.siren];
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
      snackbar.error(err);
      isExportLoading.value = false;
    });
}
</script>