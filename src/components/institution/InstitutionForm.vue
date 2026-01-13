<template>
  <v-container elevation="0" class="pa-0">
    <v-form ref="formCreationCompte" class="elevation-0" :disabled="isDisableForm" autocomplete="on">
      <h1 v-if="action === Action.CREATION" class="pl-3">
        {{ $t("institution.form.createTitle") }}
      </h1>
      <h1 v-if="action === Action.MODIFICATION" class="pl-3">
        {{ etablissement.nom }}
      </h1>
      <v-container class="pa-0">
        <div v-if="action === Action.CREATION" class="d-flex flex-row align-center">
          <h2 @click="allerAConnexion" class="pl-3">
            {{ $t("institution.form.hasAccount") }}
            <a class="bouton-simple elevation-0 large">{{ $t("institution.form.authenticate") }}</a>
          </h2>
          <v-icon small>mdi-arrow-right-circle-outline</v-icon>
        </div>
        <v-col cols="12" md="6" lg="6" xl="6"> </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" v-if="returnLink">
          <v-alert variant="outlined">
            <div>
              <a @click="allerPageAccueil()">
                <FontAwesomeIcon :icon="faReply" /> {{ $t("institution.form.backHome") }}
              </a>
            </div>
          </v-alert>
        </v-col>
        <v-row v-if="action === Action.CREATION">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-alert variant="outlined" density="compact">
              <FontAwesomeIcon :icon="faTriangleExclamation" class="mx-2 icone-attention" />
              <h4 class="mb-1">{{ $t("institution.form.eligibilityTitle") }}</h4>
              <p>
                <strong>{{ $t("institution.form.attention") }}</strong>{{
                  $t("institution.form.eligibilityText")
                }}
                <a
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
                  target="_blank"
                >
                  {{ $t("institution.form.eligibilityLink") }}
                </a>
              </p>
              <v-checkbox
                required
                :rules="rulesForms.checkboxRules"
                :label="$t('institution.form.eligibilityConfirm')"
              />
            </v-alert>
          </v-col>
        </v-row>
        <v-card>
          <div
            class="mx-9"
            v-if="
              (action === Action.MODIFICATION && isAdmin) ||
              action === Action.CREATION ||
              action === Action.FUSION ||
              action === Action.SCISSION
            "
          >
            <v-row>
              <v-card-title>{{ $t("institution.form.institutionSection") }}</v-card-title>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <div class="mx-9">
              <v-row>
                <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                  <v-row>
                    <v-text-field
                      variant="outlined"
                      :label="$t('institution.form.institutionName')"
                      :placeholder="$t('institution.form.institutionName')"
                      name="organization"
                      autocomplete="organization"
                      v-model="etablissement.nom"
                      :rules="rulesForms.nomEtabRules"
                      :disabled="action === Action.MODIFICATION && !isAdmin"
                      required
                      @keyup.enter="validate"
                    />
                  </v-row>
                  <v-row>
                    <v-col :cols="12" class="pa-0">
                      <v-text-field
                        variant="outlined"
                        :label="$t('institution.form.siren')"
                        :placeholder="$t('institution.form.siren')"
                        maxlength="9"
                        name="siren"
                        autocomplete="on"
                        v-model="etablissement.siren"
                        :rules="rulesForms.siren"
                        required
                        @input="checkSiren"
                        @keyup.enter="validate"
                        :disabled="action === Action.MODIFICATION"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-chip
                      class="ma-2"
                      :class="checkSirenColor"
                      label
                      v-if="action == Action.CREATION || action == Action.FUSION || action == Action.SCISSION"
                    >
                      {{ $t("institution.form.sirenStatus", { status: checkSirenAPI }) }}
                    </v-chip>
                  </v-row>
                  <v-row v-if="action == Action.MODIFICATION">
                    <v-text-field
                      variant="outlined"
                      :label="$t('institution.form.idAbes')"
                      :placeholder="$t('institution.form.idAbes')"
                      v-model="etablissement.idAbes"
                      disabled
                    />
                  </v-row>
                </v-col>
                <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
                <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                  <v-row>
                    <v-select
                      variant="outlined"
                      v-model="etablissement.typeEtablissement"
                      :items="typesEtab"
                      :label="$t('institution.form.institutionType')"
                      :placeholder="$t('institution.form.institutionType')"
                      :disabled="action === Action.MODIFICATION && !isAdmin"
                      :rules="rulesForms.typeEtabRules"
                      required
                    />
                  </v-row>
                  <v-row>
                    <v-alert variant="outlined" v-if="action == Action.CREATION" style="width: 100%">
                      <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 icone-information" />
                      <a
                        class="noUnderlineLink"
                        href="https://annuaire-entreprises.data.gouv.fr/"
                        target="_blank"
                      >
                        {{ $t("institution.form.findSiren") }}
                      </a>
                    </v-alert>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="mx-9">
            <v-card-title>{{ $t("institution.form.contactSection") }}</v-card-title>
            <v-divider class="mb-4"></v-divider>
            <InstitutionContact
              ref="formContact"
              :action="action"
              :contact="etablissement.contact"
              :isDisableForm="isDisableForm"
              class="mx-9"
            />
          </div>
        </v-card>
        <v-card-actions v-if="action !== Action.SCISSION">
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-col cols="12" md="6" lg="4" xl="4" class="d-flex justify-space-around flex-wrap" style="float: right;">
            <v-row>
              <v-btn @click="clear" :disabled="isDisableForm" variant="outlined">
                {{ $t("institution.form.cancel") }}
              </v-btn>

              <v-btn class="ml-4" :loading="buttonLoading" :disabled="isDisableForm" @click="validate" variant="elevated">
                {{ $t("institution.form.save") }}
                <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-card-actions>
      </v-container>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import InstitutionContact from "@/components/institution/InstitutionContact.vue";
import { useDataGouvService } from "@/composables/useDataGouvService";
import { useEtablissementService } from "@/composables/useEtablissementService";
import { useSnackbar } from "@/composables/useSnackbar";
import { Action as ActionEnum } from "@/core/CommonDefinition";
import Etablissement from "@/core/Etablissement";
import { rulesForms } from "@/core/RulesForm";
import { DataGouvApiError } from "@/exception/data.gouv/DataGouvApiError";
import { SirenNotFoundError } from "@/exception/data.gouv/SirenNotFoundError";
import { RouteName } from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { Logger } from "@/utils/Logger";
import { faCircleInfo, faReply, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

interface Props {
  action: ActionEnum | keyof typeof ActionEnum;
  listeSirenFusion?: Array<string>;
  triggerScission?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  listeSirenFusion: () => [],
  triggerScission: false,
});
const emit = defineEmits<{
  (e: "send", value: Etablissement): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbar();
const dataGouvService = useDataGouvService();
const etablissementService = useEtablissementService();
const etablissementStore = useEtablissementStore();
const { t } = useI18n();

const action = computed<ActionEnum>(() =>
  typeof props.action === "string"
    ? ActionEnum[props.action as keyof typeof ActionEnum]
    : props.action
);

const etablissement = ref<Etablissement>(new Etablissement());

etablissement.value = etablissementStore.getCurrentEtablissement;
watch(
  () => etablissementStore.currentEtablissement,
  () => {
    etablissement.value = etablissementStore.getCurrentEtablissement;
  },
  { immediate: true }
);

watch(
  () => authStore.getEtablissementConnecte,
  () => {
    etablissementStore.setCurrentEtablissement(authStore.getEtablissementConnecte);
  },
  { immediate: true }
);

const Action = ActionEnum;
const isAdmin = computed(() => authStore.isAdmin);
const tokenrecaptcha = ref("");
const typesEtab = ref<Array<string>>([]);
const checkSirenAPI = ref(t("institution.form.sirenPending"));
const checkSirenColor = ref("grey");
const buttonLoading = ref(false);
const isDisableForm = ref(false);
const returnLink = ref(false);

const formCreationCompte = ref<VForm | null>(null);
const formContact = ref<InstanceType<typeof InstitutionContact> | null>(null);

const metaInfo = () => {
  const titre =
    action.value === ActionEnum.CREATION
      ? t("institution.form.meta.createTitle")
      : t("institution.form.meta.editTitle");
  return {
    meta: [
      {
        name: "description",
        content: t("institution.form.meta.description"),
      },
    ],
    title: `${titre} - Licences Nationales`,
  };
};

const loadRecaptcha = async () => {
  const maybeRecaptchaLoaded = (globalThis as any).$recaptchaLoaded;
  if (maybeRecaptchaLoaded) {
    await maybeRecaptchaLoaded();
  }
};

const executeRecaptcha = async (action: string) => {
  const maybeRecaptcha = (globalThis as any).$recaptcha;
  if (maybeRecaptcha) {
    return await maybeRecaptcha(action);
  }
  return "";
};

const fetchListeType = async () => {
  snackbar.hide();
  try {
    const result = await etablissementService.listeType();
    isDisableForm.value = false;
    typesEtab.value = result;
  } catch (err: any) {
    snackbar.error(err);
  }
};

const allerAConnexion = () => {
  snackbar.hide();
  router.push({ name: RouteName.Login }).catch(err => {
    Logger.error(err);
  });
};

const allerPageAccueil = () => {
  router.push({ name: RouteName.Login });
};

const recaptcha = async () => {
  await loadRecaptcha();
  tokenrecaptcha.value = await executeRecaptcha("creationCompte");
};

const validate = async () => {
  buttonLoading.value = true;
  snackbar.hide();

  await recaptcha();

  const formValid = await formCreationCompte.value?.validate();
  const isFormValide = formValid?.valid ?? false;

  const isSubFormValide = formContact.value?.validate() ?? true;

  if (tokenrecaptcha.value != null) {
    if (isFormValide && isSubFormValide) {
      await send();
    } else {
      if (checkSirenAPI.value === "inconnu" || checkSirenAPI.value === "Inconnu") {
        snackbar.error(t("institution.form.unknownSiren"));
      } else {
        snackbar.error(t("institution.form.invalidFields"));
      }
    }
  }
  buttonLoading.value = false;
};

const send = async () => {
  buttonLoading.value = true;
  snackbar.hide();

  if (action.value == ActionEnum.CREATION) {
    etablissementService
      .creerEtablissement(etablissement.value, tokenrecaptcha.value)
      .then(() => {
        snackbar.success(t("institution.form.createSuccess"));
        router.push({ name: RouteName.Home });
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else if (action.value == ActionEnum.MODIFICATION) {
    etablissementService
      .updateEtablissement(etablissement.value, authStore.getToken, authStore.isAdmin)
      .then(() => {
        snackbar.success(t("institution.form.updateSuccess"));

        if (etablissement.value.siren === authStore.getEtablissementConnecte.siren) {
          etablissementStore.setEtablissementConnecte(etablissement.value);
        }
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else if (action.value === ActionEnum.FUSION) {
    etablissementService
      .fusion(authStore.getToken, {
        nouveauEtab: etablissement.value,
        sirenFusionnes: props.listeSirenFusion,
      })
      .then(() => {
        clear();
        snackbar.success(t("institution.form.mergeSuccess"));
        router.push({ name: RouteName.Institutions });
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else if (action.value === ActionEnum.SCISSION) {
    emit("send", etablissement.value);
    buttonLoading.value = false;
  }
};

const checkSiren = async () => {
  snackbar.hide();
  checkSirenAPI.value = t("institution.form.sirenPending");
  if (etablissement.value.siren) {
    checkSirenAPI.value = t("institution.form.sirenChecking");
    checkSirenColor.value = "siren-default";
    if (etablissement.value.siren.length === 9) {
      try {
        const data = await dataGouvService.checkSiren(etablissement.value.siren);
        checkSirenAPI.value = data;
        checkSirenColor.value = "siren-ok";
      } catch (err: any) {
        Logger.error(err);
        if (err instanceof SirenNotFoundError) {
          checkSirenAPI.value = t("institution.form.sirenUnknown");
          checkSirenColor.value = "siren-erreur";
        } else if (err instanceof DataGouvApiError) {
          checkSirenAPI.value = t("institution.form.sirenServiceError");
          checkSirenColor.value = "siren-erreur";
        } else {
          checkSirenAPI.value = t("institution.form.sirenInternalError", {
            message: err?.message ?? "",
          });
          checkSirenColor.value = "red";
        }
      }
    }
  }
};

const clear = () => {
  snackbar.hide();
  formCreationCompte.value?.resetValidation();
  formContact.value?.clear();

  if (action.value === ActionEnum.MODIFICATION) {
    etablissementStore.setCurrentEtablissement(etablissement.value);
    router.push({ name: RouteName.Home }).catch(err => {
      Logger.error(err);
    });
  } else {
    etablissement.value.reset();
    window.scrollTo(0, 0);
  }
};

watch(
  () => props.triggerScission,
  value => {
    if (action.value === ActionEnum.SCISSION && value) {
      validate();
    }
  }
);

onMounted(() => {
  fetchListeType();
  window.scrollTo(0, 0);
});
</script>
<style scoped lang="scss">
.v-card-text {
  border: 0;
}

.v-card-title {
  width: 100%;
}

.icone-attention {
  float: left;
}

.row {
  margin: 0 !important;
}
</style>
