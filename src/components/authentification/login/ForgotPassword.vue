<template>
  <v-container elevation="0">
    <h1 class="pb-1">Mot de passe oublie</h1>
    <h2 class="pa-1">
      Choisir une option de reinitialisation
    </h2>
    <v-card class="pa-4">
      <v-radio-group id="radio" v-model="sirenRadio">
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-radio label="Je connais le SIREN de mon etablissement" :value="true" />
            <v-form ref="formSIREN">
              <v-text-field variant="outlined" label="SIREN" placeholder="SIREN" v-model="siren" maxlength="9"
                :rules="rulesForms.siren" required @keyup.enter="validate" :disabled="!sirenRadio" />
              <v-icon> mdi-information </v-icon>
              <a href="https://annuaire-entreprises.data.gouv.fr/" target="_blank" style="font-size: 1.1rem">Trouver le
                SIREN de votre etablissement</a>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-radio label="Je connais l'adresse de contact de mon etablissement :" :value="false" />
            <v-form ref="formMail">
              <v-text-field variant="outlined" label="Adresse mail de contact" placeholder="Adresse mail de contact"
                type="mail" v-model="mail" :rules="rulesForms.email" required @keyup.enter="validate"
                :disabled="sirenRadio" />
            </v-form>
          </v-col>
        </v-row>
      </v-radio-group>
    </v-card>

    <v-row>
      <v-col>
        <v-btn color="button" style="float: right;" :loading="buttonLoading" @click="validate">
          Envoyer
          <v-icon style="padding-left: 5px;">mdi-arrow-right-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthService } from "@/composables/useAuthService";
import { useRecaptcha } from "@/composables/useRecaptcha";
import { useSnackbar } from "@/composables/useSnackbar";
import { rulesForms } from "@/core/RulesForm";
import { LicencesNationalesBadRequestApiError } from "@/exception/licencesnationales/LicencesNationalesBadRequestApiError";
import { ref } from "vue";
import type { VForm } from "vuetify/components";

const snackbar = useSnackbar();
const authService = useAuthService();
const { loadRecaptcha, executeRecaptcha } = useRecaptcha();

const siren = ref("");
const mail = ref("");
const sirenRadio = ref(true);
const buttonLoading = ref(false);
const token = ref("");

const formSIREN = ref<VForm | null>(null);
const formMail = ref<VForm | null>(null);

const validate = async () => {
  await loadRecaptcha();
  token.value = await executeRecaptcha("forgotPassword");
  if (sirenRadio.value) {
    const valid = await formSIREN.value?.validate();
    if (valid?.valid) {
      submitSiren();
    }
  } else {
    const valid = await formMail.value?.validate();
    if (valid?.valid) {
      submitMail();
    }
  }
};

const submitSiren = async () => {
  buttonLoading.value = true;
  snackbar.hide();
  try {
    const response = await authService.motDePasseOublieSiren({
      siren: siren.value,
      recaptcha: token.value
    });
    snackbar.success(response.message);
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    buttonLoading.value = false;
  }
};

const submitMail = async () => {
  buttonLoading.value = true;
  snackbar.hide();
  try {
    const response = await authService.motDePasseOublieEmail({
      email: mail.value,
      recaptcha: token.value
    });
    snackbar.success(response.message);
  } catch (err: any) {
    if (err instanceof LicencesNationalesBadRequestApiError) {
      snackbar.success(
        "Si l'adresse e-mail est reconnue, vous recevrez un lien de reinitialisation du mot de passe"
      );
    } else {
      snackbar.error(err);
    }
  } finally {
    buttonLoading.value = false;
  }
};
</script>

<style scoped>
h1 {
  padding-bottom: 30px;
}

.v-input--radio-group {
  padding-top: 0;
  margin-top: 0;
}
</style>
