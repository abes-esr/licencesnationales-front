<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card class="elevation-0">
            <v-form ref="formReinitialisationPass" class="elevation-0" :disabled="!tokenValid">
              <v-card-title class="pa-3">
                <h1>Reinitialiser le mot de passe</h1>
              </v-card-title>
              <v-card-text>
                <MotDePasse ref="motDePasse" :action="Action.CREATION" v-model:nouveauMotDePasse="newPassword"
                  class="ma-3" :link-is-expired="!tokenValid" :is-disable-form="!tokenValid" />
              </v-card-text>
              <v-card-actions>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-col cols="12" md="8" lg="8" xl="8" class="d-flex justify-space-around">
                  <v-btn v-if="!linkExpired" size="x-large" @click="clear" class="bouton-annuler"
                    :disabled="isDisableForm" variant="outlined">
                    Annuler
                  </v-btn>
                  <v-btn v-if="!linkExpired" :loading="buttonLoading" :disabled="isDisableForm" size="x-large"
                    @click="recaptcha" variant="elevated">
                    Enregistrer
                    <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-card-actions>
              <v-card-actions>
                <v-col cols="8"> </v-col>
                <a @click="revenirPageAccueil">
                  <FontAwesomeIcon :icon="faReply" />&nbsp;Revenir a la page d'accueil
                </a>
              </v-card-actions>
            </v-form>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import MotDePasse from "@/components/authentification/MotDePasse.vue";
import { useRecaptcha } from "@/composables/useRecaptcha";
import { useSnackbar } from "@/composables/useSnackbar";
import { Action } from "@/core/CommonDefinition";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { Logger } from "@/utils/Logger";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const snackbar = useSnackbar();
const { loadRecaptcha, executeRecaptcha } = useRecaptcha();

const resetToken = ref("");
const isDisableForm = ref(false);
const tokenValid = ref(true);
const tokenrecaptcha = ref("");
const newPassword = ref("");
const buttonLoading = ref(false);
const linkExpired = ref(false);

const formReinitialisationPass = ref<VForm | null>(null);
const motDePasse = ref<InstanceType<typeof MotDePasse> | null>(null);

onMounted(async () => {
  snackbar.hide();

  resetToken.value = window.location.href.substring(
    window.location.href.lastIndexOf("=") + 1
  );

  try {
    const valid = await verifierToken(resetToken.value);
    tokenValid.value = valid;
    linkExpired.value = !valid;
  } catch (err: any) {
    tokenValid.value = false;
    linkExpired.value = true;
    handleError(err);
  }
});

const verifierToken = async (token: string): Promise<boolean> => {
  try {
    const response = await authService.verifierValiditeToken(token);
    return response;
  } catch (err: any) {
    throw err;
  } finally {
    buttonLoading.value = false;
  }
};

const recaptcha = async () => {
  await loadRecaptcha();
  tokenrecaptcha.value = await executeRecaptcha("reinitialisationPass");
  const isValid = await validate();
  if (isValid) {
    reinitialisationPass();
  } else {
    snackbar.error("Des champs ne remplissent pas les conditions");
  }
};

const validate = async (): Promise<boolean> => {
  const formValid = await formReinitialisationPass.value?.validate();
  const mdpValid = await motDePasse.value?.validate();
  return Boolean(formValid?.valid && mdpValid);
};

const reinitialisationPass = async (): Promise<void> => {
  buttonLoading.value = true;
  snackbar.hide();

  try {
    const response = await authService.reinitialiserMotDePasse({
      nouveauMotDePasse: newPassword.value,
      recaptcha: tokenrecaptcha.value,
      token: resetToken.value
    });
    snackbar.success(response.message);
    setTimeout(() => {
      router.push({ name: "Login" });
    }, 4000);
  } catch (err: any) {
    handleError(err);
  } finally {
    buttonLoading.value = false;
  }
};

const handleError = (err: any) => {
  Logger.error(err?.toString?.() ?? err);
  snackbar.error(err);
};

const clear = () => {
  motDePasse.value?.clear();
  formReinitialisationPass.value?.resetValidation();
  newPassword.value = "";
};

const revenirPageAccueil = () => {
  router.push({ name: "Login" }).catch(err => {
    Logger.error(err);
  });
};
</script>
