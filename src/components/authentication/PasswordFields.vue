<template>
  <v-form ref="form" :disabled="isDisableForm" class="d-flex flex-column">
    <v-alert variant="outlined" class="pa-2 mb-4" v-if="linkIsExpired === false">
      <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 mt-2 icone-information" />
      {{ $t("auth.passwordFields.rules") }}
    </v-alert>
    <v-alert variant="outlined" class="pa-2 mb-4" v-if="linkIsExpired === true">
      <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 mt-2 icone-information" />
      {{ $t("auth.passwordFields.expiredMessage") }}
      <a @click="allerPasswordReset">{{ $t("auth.passwordFields.expiredLink") }}</a>
    </v-alert>
    <v-text-field v-if="action === Action.MODIFICATION && linkIsExpired === false" variant="outlined"
      :label="$t('auth.passwordFields.oldPasswordLabel')" :placeholder="$t('auth.passwordFields.oldPasswordPlaceholder')" :type="inputType"
      :append-inner-icon="appendIcon" v-model="ancienMotDePasseModel"
      :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)" required
      @click:append-inner="toggleShow" autocomplete="new-password" @keyup.enter="validate" />
    <v-text-field v-if="linkIsExpired === false" variant="outlined" :label="action === Action.CREATION ? $t('auth.passwordFields.createPasswordLabel') : $t('auth.passwordFields.updatePasswordLabel')
      " :placeholder="action === Action.CREATION ? $t('auth.passwordFields.createPasswordPlaceholder') : $t('auth.passwordFields.updatePasswordPlaceholder')
        " :type="inputType" :append-inner-icon="appendIcon"
      v-model="nouveauMotDePasseModel" :rules="regleFormulaire.motDePasse.concat(regleMotDePasse)" required
      @click:append-inner="toggleShow" autocomplete="new-password" @keyup.enter="validate" />
    <v-text-field v-if="linkIsExpired === false" variant="outlined" :label="action === Action.CREATION
      ? $t('auth.passwordFields.createConfirmLabel')
      : $t('auth.passwordFields.updateConfirmLabel')
      " :placeholder="action === Action.CREATION
        ? $t('auth.passwordFields.createConfirmPlaceholder')
        : $t('auth.passwordFields.updateConfirmPlaceholder')
        " :type="inputType" :append-inner-icon="appendIcon"
      v-model="confirmationNouveauMotDePasse" :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)"
      required @click:append-inner="toggleShow" autocomplete="new-password" @keyup.enter="validate" />
  </v-form>
</template>

<script setup lang="ts">
import { useToggle } from "@/utils/useToggle";
import { Action } from "@/core/CommonDefinition";
import { rulesForms } from "@/core/RulesForm";
import { RouteName } from "@/router";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const props = withDefaults(
  defineProps<{
    action: Action;
    ancienMotDePasse?: string;
    nouveauMotDePasse: string;
    isDisableForm: boolean;
    linkIsExpired?: boolean;
  }>(),
  {
    ancienMotDePasse: ""
  }
);

const emit = defineEmits<{
  (e: "update:ancienMotDePasse", value: string): void;
  (e: "update:nouveauMotDePasse", value: string): void;
}>();

const router = useRouter();
const { t } = useI18n();
const ActionRef = Action;
const regleFormulaire: any = rulesForms;

const confirmationNouveauMotDePasse = ref("");
const form = ref<VForm | null>(null);
const { value: show, toggle: toggleShow } = useToggle(false);
const inputType = computed(() => (show.value ? "text" : "password"));
const appendIcon = computed(() => (show.value ? "mdi-eye" : "mdi-eye-off"));

const ancienMotDePasseModel = computed({
  get: () => props.ancienMotDePasse ?? "",
  set: value => emit("update:ancienMotDePasse", value)
});

const nouveauMotDePasseModel = computed({
  get: () => props.nouveauMotDePasse,
  set: value => emit("update:nouveauMotDePasse", value)
});

const regleMotDePasse = () => () =>
  confirmationNouveauMotDePasse.value === "" ||
  nouveauMotDePasseModel.value === confirmationNouveauMotDePasse.value ||
  t("auth.passwordFields.confirmMismatch");

const regleConfirmationMotDePasse = () => () =>
  nouveauMotDePasseModel.value === confirmationNouveauMotDePasse.value ||
  confirmationNouveauMotDePasse.value === "" ||
  t("auth.passwordFields.confirmMismatch");

watch(
  () => nouveauMotDePasseModel.value,
  async () => {
    if (confirmationNouveauMotDePasse.value !== "") {
      await form.value?.validate();
    }
  }
);

const validate = async (): Promise<boolean> => {
  const validation = await form.value?.validate();
  return validation?.valid ?? false;
};

const clear = () => {
  form.value?.resetValidation();
  confirmationNouveauMotDePasse.value = "";
};

const allerPasswordReset = () => {
  router.push({ name: RouteName.Login });
};

defineExpose({ validate, clear, Action: ActionRef });
</script>
