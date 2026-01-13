<template>
  <v-container variant="flat">
    <h1>{{ $t("institution.card.title", { name: etablissement.nom }) }}</h1>
    <v-col cols="12" md="6" lg="6" xl="6" class="pa-1">
      <ConfirmPopup ref="confirmRef" />
    </v-col>
    <v-container class="elevation-0 pt-0">
      <v-col cols="12" class="d-flex align-content-start justify-space-between flex-wrap mx-0 px-0 py-0">
        <v-card-title class="px-0">
          {{ $t("institution.card.accountInfo") }}
          <v-tooltip
            :text="$t('institution.card.exportAccountInfo')"
            location="top"
            open-delay="100"
            theme="dark"
            content-class="text-white"
          >
            <template v-slot:activator="{ props }">
              <v-btn icon @click="downloadEtablissement" class="bouton-simple" v-bind="props" :loading="isExportLoading">
                <FontAwesomeIcon :icon="faDownload" class="mx-2 fa-lg" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-card-title>

        <v-btn variant="tonal" class="mt-3" @click="allerAIPs">
          {{ $t("institution.card.viewIpList") }}
          <v-icon class="ml-2">mdi-ip-network</v-icon>
        </v-btn>
      </v-col>
      <span class="d-block">
        {{ $t("institution.card.accountCreatedOn") }}
        {{ etablissement.dateCreation.toLocaleDateString() }}
      </span>
      <v-btn v-if="modificationModeDisabled" class="mt-3" variant="tonal" style="margin-right: 1em" @click="entrerEnModification">
        {{ $t("institution.card.editAccount") }}
      </v-btn>
      <v-btn v-if="!modificationModeDisabled" class="mt-3" variant="tonal" @click="validerModifications"
        style="margin-right: 1em" color="success">
        {{ $t("institution.card.validateChanges") }}
      </v-btn>
      <v-btn v-if="!modificationModeDisabled" class="mt-3" variant="tonal" @click="annulerModifications">
        {{ $t("institution.card.resetFields") }}
      </v-btn>
      <v-btn
        v-if="modificationModeDisabled && getEtablissement.statut !== 'Validé'"
        class="mt-3"
        variant="tonal"
        style="margin-right: 1em"
        :loading="buttonValidationLoading"
        @click="validerEtablissement"
      >
        {{ $t("institution.card.validateAccount") }}
      </v-btn>
      <v-btn
        v-if="modificationModeDisabled && getEtablissement.statut === 'Validé'"
        class="btn-5 mt-3"
        :loading="buttonValidationLoading"
        @click="devaliderEtablissement"
      >
        {{ $t("institution.card.invalidateAccount") }}
      </v-btn>
      <v-row class="d-flex justify-space-between flex-wrap ma-0 pa-0">
        <v-col cols="12" md="6" lg="6" xl="6" class="d-flex align-content-start justify-center flex-wrap px-0 pr-2">
          <v-card class="d-flex justify-space-between flex-column w-100 pa-4">
            <div class="d-flex justify-space-between align-center">
              <h2 class="mb-3">{{ $t("institution.card.institutionSection") }}</h2>
              <v-tooltip
                :text="$t('institution.card.readonly')"
                location="top"
                open-delay="100"
                theme="dark"
                content-class="text-white"
                v-if="!isAdmin"
              >
                <template v-slot:activator="{ props }">
                  <FontAwesomeIcon v-bind="props" :icon="faLock" class="fa-2x mx-2" />
                </template>
              </v-tooltip>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <v-text-field
                :label="$t('institution.card.siren')"
                :placeholder="$t('institution.card.siren')"
                variant="outlined"
                v-model="etablissement.siren"
                disabled
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.institutionName')"
                :placeholder="$t('institution.card.institutionName')"
                variant="outlined"
                v-model="etablissement.nom"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.idAbes')"
                :placeholder="$t('institution.card.idAbes')"
                variant="outlined"
                v-model="etablissement.idAbes"
                disabled
                class="mt-1"
              />
              <v-select
                :label="$t('institution.card.institutionType')"
                :items="typesEtab"
                variant="outlined"
                v-model="etablissement.typeEtablissement"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <div class="mt-1">
                <h3 class="d-inline">{{ $t("institution.card.institutionStatus") }}</h3>
                {{ etablissement.statut }}
              </div>
              <div class="mt-1">
                <h3 class="d-inline">{{ $t("institution.card.ipStatus") }}</h3>
                {{ etablissement.statutIP }}
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" class="d-flex align-content-start justify-center flex-wrap px-0 pl-2">
          <v-card class="d-flex justify-space-between flex-column w-100 pa-4">
            <div class="d-flex justify-space-between align-center">
              <h2 class="mb-3">{{ $t("institution.card.contactSection") }}</h2>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <v-text-field
                :label="$t('institution.card.contactLastName')"
                :placeholder="$t('institution.card.contactLastName')"
                variant="outlined"
                v-model="etablissement.contact.nom"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactFirstName')"
                :placeholder="$t('institution.card.contactFirstName')"
                variant="outlined"
                v-model="etablissement.contact.prenom"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactPhone')"
                :placeholder="$t('institution.card.contactPhone')"
                variant="outlined"
                v-model="etablissement.contact.telephone"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactEmail')"
                :placeholder="$t('institution.card.contactEmail')"
                variant="outlined"
                v-model="etablissement.contact.mail"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactAddress')"
                :placeholder="$t('institution.card.contactAddress')"
                variant="outlined"
                v-model="etablissement.contact.adresse"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactPoBox')"
                :placeholder="$t('institution.card.contactPoBox')"
                variant="outlined"
                v-model="etablissement.contact.boitePostale"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactPostalCode')"
                :placeholder="$t('institution.card.contactPostalCode')"
                variant="outlined"
                v-model="etablissement.contact.codePostal"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactCity')"
                :placeholder="$t('institution.card.contactCity')"
                variant="outlined"
                v-model="etablissement.contact.ville"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
              <v-text-field
                :label="$t('institution.card.contactCedex')"
                :placeholder="$t('institution.card.contactCedex')"
                variant="outlined"
                v-model="etablissement.contact.cedex"
                :disabled="modificationModeDisabled"
                class="mt-1"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="button" class="bouton-supprimer" :loading="buttonSuppresionLoading" @click="supprimerEtablissement">
            {{ $t("institution.card.deleteAccount") }}
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
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const etablissementStore = useEtablissementStore();
const router = useRouter();
const etablissementService = useEtablissementService();
const { t } = useI18n();

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
    snackbar.error(t("institution.card.unauthorized"));
    router.push({ name: RouteName.Home });
  }
});

async function fetchListeType() {
  try {
    typesEtab.value = await etablissementService.listeType();
  } catch (err: any) {
    snackbar.error(err);
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
    t("institution.card.confirmDelete", { name: etablissement.value.nom })
  );
  if (confirmed) {
    etablissementService
      .deleteEtab(etablissement.value.siren, authStore.getToken)
      .then(() => {
        snackbar.success(t("institution.card.deleteSuccess"), {
          onHide: () => {
            router.push({ name: RouteName.Institutions });
          },
          timeout: 4000,
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
    t("institution.card.confirmValidate", { name: etablissement.value.nom })
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
    t("institution.card.confirmInvalidate", { name: etablissement.value.nom })
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
  modificationModeDisabled.value = false;
}

function validerModifications(): void {
  etablissementService
    .updateEtablissement(etablissement.value, authStore.getToken, authStore.isAdmin)
    .then(() => {
      etablissementStore.updateCurrentEtablissement(etablissement.value);
    })
    .catch((err: any) => {
      snackbar.error(err);
    })
    .finally(() => {
      modificationModeDisabled.value = true;
    });
}

function annulerModifications(): void {
  etablissement.value = etablissementStore.getCurrentEtablissement;
  modificationModeDisabled.value = true;
}

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
