<template>
  <v-container elevation="0" class="pa-0">
    <v-form ref="accountForm" class="elevation-0" :disabled="isFormDisabled" autocomplete="on">
      <h1 v-if="action === RouteAction.CREATION" class="pl-3">
        {{ $t("institution.form.createTitle") }}
      </h1>
      <h1 v-if="action === RouteAction.MODIFICATION" class="pl-3">
        {{ institution.name }}
      </h1>
      <v-container class="pa-0">
        <div v-if="action === RouteAction.CREATION" class="d-flex flex-row align-center">
          <h2 @click="goToLogin" class="pl-3">
            {{ $t("institution.form.hasAccount") }}
            <a class="bouton-simple elevation-0 large">{{ $t("institution.form.authenticate") }}</a>
          </h2>
          <v-icon small>mdi-arrow-right-circle-outline</v-icon>
        </div>
        <v-col cols="12" md="6" lg="6" xl="6"> </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" v-if="returnLink">
          <v-alert variant="outlined">
            <div>
              <a @click="goToHome()">
                <FontAwesomeIcon :icon="faReply" /> {{ $t("institution.form.backHome") }}
              </a>
            </div>
          </v-alert>
        </v-col>
        <v-row v-if="action === RouteAction.CREATION">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-alert variant="outlined" density="compact">
              <FontAwesomeIcon :icon="faTriangleExclamation" class="mx-2 icone-attention" />
              <h4 class="mb-1">{{ $t("institution.form.eligibilityTitle") }}</h4>
              <p>
                <strong>{{ $t("institution.form.attention") }}</strong>{{
                  $t("institution.form.eligibilityText")
                }}
                <a href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires" target="_blank">
                  {{ $t("institution.form.eligibilityLink") }}
                </a>
              </p>
              <v-checkbox required :rules="privacyAcceptanceRules" :label="$t('institution.form.eligibilityConfirm')" />
            </v-alert>
          </v-col>
        </v-row>
        <v-card>
          <div class="mx-9" v-if="
            (action === RouteAction.MODIFICATION && isAdmin) ||
            action === RouteAction.CREATION ||
            action === RouteAction.FUSION ||
            action === RouteAction.SCISSION
          ">
            <v-row>
              <v-card-title>{{ $t("institution.form.institutionSection") }}</v-card-title>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <div class="mx-9">
              <v-row>
                <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                  <v-row>
                    <v-text-field variant="outlined" :label="$t('institution.form.institutionName')"
                      :placeholder="$t('institution.form.institutionName')" name="organization"
                      autocomplete="organization" v-model="institution.name" :rules="establishmentNameRules"
                      :disabled="action === RouteAction.MODIFICATION && !isAdmin" required @keyup.enter="validate" />
                  </v-row>
                  <v-row>
                    <v-col :cols="12" class="pa-0">
                      <v-text-field variant="outlined" :label="$t('institution.form.siren')"
                        :placeholder="$t('institution.form.siren')" maxlength="9" name="siren" autocomplete="on"
                        v-model="institution.siren" :rules="sirenRules" required @input="checkSiren"
                        @keyup.enter="validate" :disabled="action === RouteAction.MODIFICATION" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-chip class="ma-2" :class="sirenStatusColor" label
                      v-if="action == RouteAction.CREATION || action == RouteAction.FUSION || action == RouteAction.SCISSION">
                      {{ $t("institution.form.sirenStatus", { status: sirenStatus }) }}
                    </v-chip>
                  </v-row>
                  <v-row v-if="action == RouteAction.MODIFICATION">
                    <v-text-field variant="outlined" :label="$t('institution.form.idAbes')"
                      :placeholder="$t('institution.form.idAbes')" v-model="institution.abesId" disabled />
                  </v-row>
                </v-col>
                <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
                <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                  <v-row>
                    <v-select variant="outlined" v-model="institution.institutionType" :items="institutionTypes"
                      :label="$t('institution.form.institutionType')"
                      :placeholder="$t('institution.form.institutionType')"
                      :disabled="action === RouteAction.MODIFICATION && !isAdmin" :rules="establishmentTypeRules"
                      required />
                  </v-row>
                  <v-row>
                    <v-alert variant="outlined" v-if="action == RouteAction.CREATION" style="width: 100%">
                      <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 icone-information" />
                      <a class="noUnderlineLink" href="https://annuaire-entreprises.data.gouv.fr/" target="_blank">
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
            <InstitutionContact ref="formContact" :action="action" :contact="institution.contact"
              :isDisableForm="isFormDisabled" class="mx-9" />
          </div>
        </v-card>
        <v-card-actions v-if="action !== RouteAction.SCISSION">
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-col cols="12" md="6" lg="4" xl="4" class="d-flex justify-space-around flex-wrap" style="float: right;">
            <v-row>
              <v-btn @click="clear" :disabled="isFormDisabled" variant="outlined">
                {{ $t("institution.form.cancel") }}
              </v-btn>

              <v-btn class="ml-4" :loading="isSaving" :disabled="isFormDisabled" @click="validate" variant="elevated">
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
import { useDataGouvService } from "@/composables/service/useDataGouvService";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import Institution from "@/entity/Institution";
import { DataGouvApiError } from "@/exception/data.gouv/DataGouvApiError";
import { SirenNotFoundError } from "@/exception/data.gouv/SirenNotFoundError";
import { RouteAction, RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import { faCircleInfo, faReply, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

interface Props {
  action: RouteAction;
  listeSirenFusion?: Array<string>;
  triggerScission?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  listeSirenFusion: () => [],
  triggerScission: false,
});
const emit = defineEmits<{
  (e: "send", value: Institution): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbar();
const dataGouvService = useDataGouvService();
const institutionService = useInstitutionService();
const institutionStore = useInstitutionStore();
const { t } = useI18n();
const {
  establishmentNameRules,
  establishmentTypeRules,
  privacyAcceptanceRules,
  sirenRules
} = useValidationRules();

const action = computed<RouteAction>(() =>
  typeof props.action === "string"
    ? RouteAction[props.action as keyof typeof RouteAction]
    : props.action
);

const institution = ref<Institution>(new Institution());

institution.value = institutionStore.currentInstitution;
watch(
  () => institutionStore.currentInstitution,
  () => {
    institution.value = institutionStore.currentInstitution;
  },
  { immediate: true }
);

watch(
  () => authStore.connectedInstitution,
  () => {
    institutionStore.setCurrentInstitution(authStore.connectedInstitution);
  },
  { immediate: true }
);

const isAdmin = computed(() => authStore.isAdmin);
const recaptchaToken = ref("");
const institutionTypes = ref<Array<string>>([]);
const sirenStatus = ref(t("institution.form.sirenPending"));
const sirenStatusColor = ref("grey");
const isSaving = ref(false);
const isFormDisabled = ref(false);
const returnLink = ref(false);

const accountForm = ref<VForm | null>(null);
const formContact = ref<InstanceType<typeof InstitutionContact> | null>(null);

const metaInfo = () => {
  const titre =
    action.value === RouteAction.CREATION
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

const fetchInstitutionTypes = async () => {
  try {
    const result = await institutionService.listInstitutionTypes();
    isFormDisabled.value = false;
    institutionTypes.value = result;
  } catch (err: any) {
    snackbar.error(err);
  }
};

const goToLogin = () => {
  router.push({ name: RouteName.Login })
};

const goToHome = () => {
  router.push({ name: RouteName.Login });
};

const runRecaptcha = async () => {
  await loadRecaptcha();
  recaptchaToken.value = await executeRecaptcha("creationCompte");
};

const validate = async () => {
  isSaving.value = true;

  await runRecaptcha();

  const formValid = await accountForm.value?.validate();
  const isFormValide = formValid?.valid ?? false;

  const isSubFormValide = formContact.value?.validate() ?? true;

  if (recaptchaToken.value != null) {
    if (isFormValide && isSubFormValide) {
      await send();
    } else {
      if (sirenStatus.value === "inconnu" || sirenStatus.value === "Inconnu") {
        snackbar.error(t("institution.form.unknownSiren"));
      } else {
        snackbar.error(t("institution.form.invalidFields"));
      }
    }
  }
  isSaving.value = false;
};

const send = async () => {
  isSaving.value = true;

  if (action.value == RouteAction.CREATION) {
    institutionService
      .createInstitution(institution.value, recaptchaToken.value)
      .then(() => {
        snackbar.success(t("institution.form.createSuccess"));
        router.push({ name: RouteName.Home });
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        isSaving.value = false;
      });
  } else if (action.value == RouteAction.MODIFICATION) {
    institutionService
      .updateInstitution(institution.value, authStore.token, authStore.isAdmin)
      .then(() => {
        snackbar.success(t("institution.form.updateSuccess"));

        if (institution.value.siren === authStore.connectedInstitution.siren) {
          institutionStore.setConnectedInstitution(institution.value);
        }
      })
      .catch(err => {
        snackbar.error(err);
      })
      .finally(() => {
        isSaving.value = false;
      });
  } else if (action.value === RouteAction.FUSION) {
    institutionService
      .mergeInstitutions(authStore.token, {
        nouveauEtab: institution.value,
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
        isSaving.value = false;
      });
  } else if (action.value === RouteAction.SCISSION) {
    emit("send", institution.value);
    isSaving.value = false;
  }
};

const checkSiren = async () => {
  sirenStatus.value = t("institution.form.sirenPending");
  if (institution.value.siren) {
    sirenStatus.value = t("institution.form.sirenChecking");
    sirenStatusColor.value = "siren-default";
    if (institution.value.siren.length === 9) {
      try {
        const data = await dataGouvService.checkSiren(institution.value.siren);
        sirenStatus.value = data;
        sirenStatusColor.value = "siren-ok";
      } catch (err: any) {
        Logger.error(err);
        if (err instanceof SirenNotFoundError) {
          sirenStatus.value = t("institution.form.sirenUnknown");
          sirenStatusColor.value = "siren-erreur";
        } else if (err instanceof DataGouvApiError) {
          sirenStatus.value = t("institution.form.sirenServiceError");
          sirenStatusColor.value = "siren-erreur";
        } else {
          sirenStatus.value = t("institution.form.sirenInternalError", {
            message: err?.message ?? "",
          });
          sirenStatusColor.value = "red";
        }
      }
    }
  }
};

const clear = () => {
  accountForm.value?.resetValidation();
  formContact.value?.clear();

  if (action.value === RouteAction.MODIFICATION) {
    institutionStore.setCurrentInstitution(institution.value);
    router.push({ name: RouteName.Home }).catch(err => {
      Logger.error(err);
    });
  } else {
    institution.value.reset();
    window.scrollTo(0, 0);
  }
};

watch(
  () => props.triggerScission,
  value => {
    if (action.value === RouteAction.SCISSION && value) {
      validate();
    }
  }
);

onMounted(() => {
  fetchInstitutionTypes();
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
