<template>
  <v-container elevation="0" class="pa-0">
    <v-form ref="accountForm" class="elevation-0" :disabled="isFormDisabled" autocomplete="on">
      <h1 v-if="action === RouteAction.CREATION" class="pl-3">
        {{ $t("institution.form.createTitle") }}
      </h1>
      <h1 v-if="action === RouteAction.MODIFICATION" class="pl-3">
        {{ localInstitution.name }}
      </h1>
      <v-container class="pa-0">
        <div v-if="action === RouteAction.CREATION" class="d-flex flex-row align-center">
          <h2 class="pl-3">
            {{ $t("institution.form.hasAccount") }}
            <router-link class="bouton-simple elevation-0 large" :to="{ name: RouteName.Login }">
              {{ $t("institution.form.authenticate") }}
            </router-link>
          </h2>
          <v-icon small>mdi-arrow-right-circle-outline</v-icon>
        </div>
        <v-col cols="12" md="6" lg="6" xl="6"> </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" v-if="returnLink">
          <v-alert variant="outlined">
            <div>
              <router-link :to="{ name: RouteName.Login }">
                <FontAwesomeIcon :icon="faReply" /> {{ $t("institution.form.backHome") }}
              </router-link>
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
                      autocomplete="organization" v-model="localInstitution.name" :rules="establishmentNameRules"
                      :disabled="action === RouteAction.MODIFICATION && !isAdmin" required @keyup.enter="validate" />
                  </v-row>
                  <v-row>
                    <v-col :cols="12" class="pa-0">
                      <v-text-field variant="outlined" :label="$t('institution.form.siren')"
                        :placeholder="$t('institution.form.siren')" maxlength="9" name="siren" autocomplete="on"
                        v-model="localInstitution.siren" :rules="sirenRules" required @input="checkSiren"
                        @keyup.enter="validate" :disabled="action === RouteAction.MODIFICATION" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-chip class="ma-2" :class="sirenStatusColor" label
                      v-if="action === RouteAction.CREATION || action === RouteAction.FUSION || action === RouteAction.SCISSION">
                      {{ $t("institution.form.sirenStatus", { status: sirenStatus }) }}
                    </v-chip>
                  </v-row>
                  <v-row v-if="action === RouteAction.MODIFICATION">
                    <v-text-field variant="outlined" :label="$t('institution.form.idAbes')"
                      :placeholder="$t('institution.form.idAbes')" v-model="localInstitution.abesId" disabled />
                  </v-row>
                </v-col>
                <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
                <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                  <v-row>
                    <v-select variant="outlined" v-model="localInstitution.institutionType" :items="institutionTypes"
                      :label="$t('institution.form.institutionType')"
                      :placeholder="$t('institution.form.institutionType')"
                      :disabled="action === RouteAction.MODIFICATION && !isAdmin" :rules="establishmentTypeRules"
                      required />
                  </v-row>
                  <v-row>
                    <v-alert variant="outlined" v-if="action === RouteAction.CREATION" style="width: 100%">
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
            <InstitutionContact ref="formContact" :action="action" :contact="localInstitution.contact"
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
import { useRecaptcha } from "@/composables/useRecaptcha";
import { usePageMeta } from "@/composables/usePageMeta";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import Institution from "@/entity/Institution";
import InstitutionContactEntity from "@/entity/InstitutionContact";
import Ip from "@/entity/Ip";
import { DataGouvApiError } from "@/exception/data.gouv/DataGouvApiError";
import { SirenNotFoundError } from "@/exception/data.gouv/SirenNotFoundError";
import { RouteAction, RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import { faCircleInfo, faReply, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

interface Props {
  action: RouteAction;
  listeSirenFusion?: Array<string>;
  triggerScission?: boolean;
  onSend?: (value: Institution) => void;
}

const props = withDefaults(defineProps<Props>(), {
  listeSirenFusion: () => [],
  triggerScission: false,
});

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbar();
const dataGouvService = useDataGouvService();
const institutionService = useInstitutionService();
const institutionStore = useInstitutionStore();
const { loadRecaptcha, executeRecaptcha } = useRecaptcha();
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

if (action.value === RouteAction.CREATION || action.value === RouteAction.MODIFICATION) {
  const metaTitleKey = computed(() =>
    action.value === RouteAction.CREATION
      ? "institution.form.meta.createTitle"
      : "institution.form.meta.editTitle"
  );

  usePageMeta({
    titleKey: metaTitleKey,
    descriptionKey: "institution.form.meta.description"
  });
}

const isAdmin = computed(() => authStore.isAdmin);
const recaptchaToken = ref("");
const institutionTypes = ref<Array<string>>([]);
enum SirenStatusKey {
  Pending = "pending",
  Checking = "checking",
  Ok = "ok",
  Unknown = "unknown",
  ServiceError = "serviceError",
  InternalError = "internalError",
}

const sirenStatusKey = ref<SirenStatusKey>(SirenStatusKey.Pending);
const sirenStatusMessage = ref(t("institution.form.sirenPending"));
const sirenStatusColorByKey: Record<SirenStatusKey, string> = {
  [SirenStatusKey.Pending]: "grey",
  [SirenStatusKey.Checking]: "siren-default",
  [SirenStatusKey.Ok]: "siren-ok",
  [SirenStatusKey.Unknown]: "siren-erreur",
  [SirenStatusKey.ServiceError]: "siren-erreur",
  [SirenStatusKey.InternalError]: "red",
};
const sirenStatus = computed(() => sirenStatusMessage.value);
const sirenStatusColor = computed(() => sirenStatusColorByKey[sirenStatusKey.value]);
const isSaving = ref(false);
const isFormDisabled = ref(false);
const returnLink = ref(false);
const accountForm = ref<VForm | null>(null);
const formContact = ref<InstanceType<typeof InstitutionContact> | null>(null);
const { currentInstitution } = storeToRefs(institutionStore);
const localInstitution = ref<Institution>(new Institution());
const initialInstitution = ref<Institution | null>(null);

const cloneInstitution = (value: Institution): Institution => {
  const cloned = Object.assign(new Institution(), value);
  cloned.contact = new InstitutionContactEntity(cloned.contact as Partial<InstitutionContactEntity>);
  cloned.ips = (cloned.ips ?? []).map((ip) => Object.assign(new Ip(), ip));
  return cloned;
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

const validate = async () => {
  isSaving.value = true;
  try {
    await loadRecaptcha();
    recaptchaToken.value = await executeRecaptcha("creationCompte");

    const formValid = await accountForm.value?.validate();
    const isFormValide = formValid?.valid ?? false;
    const isSubFormValide = formContact.value?.validate() ?? true;

    if (recaptchaToken.value != null && isFormValide && isSubFormValide) {
      await send();
    } else if (sirenStatusKey.value === SirenStatusKey.Unknown) {
      snackbar.error(t("institution.form.unknownSiren"));
    } else {
      snackbar.error(t("institution.form.invalidFields"));
    }
  } finally {
    isSaving.value = false;
  }
};

const send = async () => {
  try {
    switch (action.value) {
      case RouteAction.CREATION:
        await institutionService.createInstitution(localInstitution.value, recaptchaToken.value);
        snackbar.success(t("institution.form.createSuccess"));
        router.push({ name: RouteName.Home });
        break;
      case RouteAction.MODIFICATION:
        await institutionService.updateInstitution(localInstitution.value, authStore.token, authStore.isAdmin);
        snackbar.success(t("institution.form.updateSuccess"));
        institutionStore.updateCurrentInstitution(cloneInstitution(localInstitution.value));
        if (localInstitution.value.siren === authStore.connectedInstitution.siren) {
          authStore.updateInstitution();
        }
        break;
      case RouteAction.FUSION:
        await institutionService.mergeInstitutions(authStore.token, {
          nouveauEtab: localInstitution.value,
          sirenFusionnes: props.listeSirenFusion,
        });
        clear();
        snackbar.success(t("institution.form.mergeSuccess"));
        router.push({ name: RouteName.Institutions });
        break;
      case RouteAction.SCISSION:
        props.onSend?.(localInstitution.value);
        break;
      default:
        break;
    }
  } catch (err) {
    snackbar.error(err);
  }
};

const checkSiren = async () => {
  sirenStatusKey.value = SirenStatusKey.Pending;
  sirenStatusMessage.value = t("institution.form.sirenPending");
  if (!localInstitution.value.siren) {
    return;
  }

  sirenStatusKey.value = SirenStatusKey.Checking;
  sirenStatusMessage.value = t("institution.form.sirenChecking");

  if (localInstitution.value.siren.length !== 9) {
    return;
  }

  try {
    const data = await dataGouvService.checkSiren(localInstitution.value.siren);
    sirenStatusKey.value = SirenStatusKey.Ok;
    sirenStatusMessage.value = data;
  } catch (err: any) {
    Logger.error(err);
    if (err instanceof SirenNotFoundError) {
      sirenStatusKey.value = SirenStatusKey.Unknown;
      sirenStatusMessage.value = t("institution.form.sirenUnknown");
    } else if (err instanceof DataGouvApiError) {
      sirenStatusKey.value = SirenStatusKey.ServiceError;
      sirenStatusMessage.value = t("institution.form.sirenServiceError");
    } else {
      sirenStatusKey.value = SirenStatusKey.InternalError;
      sirenStatusMessage.value = t("institution.form.sirenInternalError", {
        message: err?.message ?? "",
      });
    }
  }
};

const clear = async () => {
  accountForm.value?.resetValidation();
  formContact.value?.clear();

  switch (action.value) {
    case RouteAction.MODIFICATION: {
      const fresh = await institutionService.getInstitution(localInstitution.value.siren, authStore.token);
      localInstitution.value = cloneInstitution(fresh);
      initialInstitution.value = cloneInstitution(fresh);
      break;
    }
    default:
      localInstitution.value.reset();
      window.scrollTo(0, 0);
      break;
  }
};

const lastTriggerScission = ref(false);

watch(
  () => currentInstitution.value,
  value => {
    localInstitution.value = cloneInstitution(value);
    if (action.value === RouteAction.MODIFICATION) {
      initialInstitution.value = cloneInstitution(value);
    }
  },
  { immediate: true }
);

watch(
  () => props.triggerScission,
  value => {
    if (action.value === RouteAction.SCISSION && value && !lastTriggerScission.value) {
      validate();
    }
    lastTriggerScission.value = Boolean(value);
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
</style>
