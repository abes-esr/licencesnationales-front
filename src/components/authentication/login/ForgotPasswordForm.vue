<template>
  <v-container elevation="0">
    <h1 class="pb-1">Mot de passe oublie</h1>
    <h2 class="pa-1">
      Choisir une option de réinitialisation
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
              <a href="https://annuaire-entreprises.data.gouv.fr/" target="_blank" class="siren-link">Trouver le
                SIREN de votre établissement</a>
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
        <v-btn color="button" class="submit-button" :loading="buttonLoading" @click="validate">
          Envoyer
          <v-icon class="submit-button-icon">mdi-arrow-right-circle-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { JsonMotDePasseOublieResponse, useAuthService } from "@/composables/useAuthService";
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

const formSIREN = ref<VForm | null>(null);
const formMail = ref<VForm | null>(null);

const EMAIL_NOT_FOUND_MESSAGE =
  "Si l'adresse e-mail est reconnue, vous recevrez un lien de reinitialisation du mot de passe";

const submitWithLoading = async (action: () => Promise<JsonMotDePasseOublieResponse>) => {
  buttonLoading.value = true;
  snackbar.hide();
  try {
    const response = await action();
    snackbar.success(response.message);
  } catch (err: any) {
    if (err instanceof LicencesNationalesBadRequestApiError && !sirenRadio.value) {
      snackbar.success(EMAIL_NOT_FOUND_MESSAGE);
    } else {
      snackbar.error(err);
    }
  } finally {
    buttonLoading.value = false;
  }
};

const submitSiren = async (recaptcha: string) =>
  submitWithLoading(() =>
    authService.motDePasseOublieSiren({
      siren: siren.value,
      recaptcha
    })
  );

const submitEmail = async (recaptcha: string) =>
  submitWithLoading(() =>
    authService.motDePasseOublieEmail({
      email: mail.value,
      recaptcha
    })
  );

const validate = async () => {
  await loadRecaptcha();
  const token = await executeRecaptcha("forgotPassword");
  const form = sirenRadio.value ? formSIREN.value : formMail.value;
  const validation = await form?.validate();
  if (!validation?.valid) {
    return;
  }
  if (sirenRadio.value) {
    await submitSiren(token);
  } else {
    await submitEmail(token);
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

.siren-link {
  font-size: 1.1rem;
}

.submit-button {
  float: right;
}

.submit-button-icon {
  padding-left: 5px;
}
</style>
