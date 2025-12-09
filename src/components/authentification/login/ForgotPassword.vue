<template>
  <v-card elevation="0">
    <v-card-title class="pb-0 pl-0 pa-3">
      <h1 class="pb-1">Mot de passe oublié</h1>
    </v-card-title>
    <v-card-title class="pa-1">
      Choisir une option de réinitialisation <MessageBox />
    </v-card-title>
    <v-radio-group id="radio" v-model="sirenRadio">
      <v-card-text class="fondGris">
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-radio
              label="Je connais le SIREN de mon établissement"
              :value="true"
            />
            <v-form ref="formSIREN">
              <v-text-field
                variant="outlined"
                label="SIREN"
                placeholder="SIREN"
                v-model="siren"
                maxlength="9"
                :rules="rulesForms.siren"
                required
                @keyup.enter="validate"
                :disabled="!sirenRadio"
              />
              <v-icon> mdi-information </v-icon>
              <a
                href="https://annuaire-entreprises.data.gouv.fr/"
                target="_blank"
                style="font-size: 1.1rem"
                >Trouver le SIREN de votre établissement</a
              >
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10">
            <v-radio
              label="Je connais l'adresse de contact de mon établissement :"
              :value="false"
            />
            <v-form ref="formMail">
              <v-text-field
                variant="outlined"
                label="Adresse mail de contact"
                placeholder="Adresse mail de contact"
                type="mail"
                v-model="mail"
                :rules="rulesForms.email"
                required
                @keyup.enter="validate"
                :disabled="sirenRadio"
              />
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-radio-group>
    <v-card-actions>
      <v-row>
        <v-col>
          <v-btn
            color="button"
            style="float: right;"
            :loading="buttonLoading"
            @click="recaptcha"
          >
            Envoyer
            <v-icon style="padding-left: 5px;">mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Logger } from "@/utils/Logger";
import { rulesForms } from "@/core/RulesForm";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import MessageBox from "@/components/common/MessageBox.vue";
import { useMessageStore } from "@/stores/messageStore";
import type { VForm } from "vuetify/components";

const messageStore = useMessageStore();

const siren = ref("");
const mail = ref("");
const sirenRadio = ref(true);
const buttonLoading = ref(false);
const token = ref("");

const formSIREN = ref<VForm | null>(null);
const formMail = ref<VForm | null>(null);

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

const recaptcha = async () => {
  await loadRecaptcha();
  token.value = await executeRecaptcha("forgotPassword");
  validate();
};

const validate = async () => {
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
  messageStore.closeDisplayedMessage();
  try {
    const response = await authService.motDePasseOublieSiren({
      siren: siren.value,
      recaptcha: token.value
    });
    const message: Message = new Message();
    message.type = MessageType.VALIDATION;
    message.texte = response.message;
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);
    scrollToMessage();
  } catch (err: any) {
    handleError(err, false);
  } finally {
    buttonLoading.value = false;
  }
};

const submitMail = async () => {
  buttonLoading.value = true;
  messageStore.closeDisplayedMessage();
  try {
    const response = await authService.motDePasseOublieEmail({
      email: mail.value,
      recaptcha: token.value
    });
    const message: Message = new Message();
    message.type = MessageType.VALIDATION;
    message.texte = response.message;
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);
    scrollToMessage();
  } catch (err: any) {
    handleError(err, true);
  } finally {
    buttonLoading.value = false;
  }
};

const handleError = (err: any, isMailFlow: boolean) => {
  Logger.error(err?.toString?.() ?? err);
  const message: Message = new Message();
  if (isMailFlow && err instanceof LicencesNationalesBadRequestApiError) {
    message.type = MessageType.VALIDATION;
    message.texte =
      "Si l'adresse e-mail est reconnue, vous recevrez un lien de réinitialisation du mot de passe";
  } else {
    message.type = MessageType.ERREUR;
    if (err instanceof LicencesNationalesBadRequestApiError) {
      message.texte = err.message;
    } else {
      message.texte = "Impossible d'exécuter l'action : " + (err?.message ?? "");
    }
  }
  message.isSticky = true;

  try {
    messageStore.openDisplayedMessage(message);
  } catch (error: any) {
    Logger.error(error?.toString?.() ?? error);
  }
  scrollToMessage();
};

const scrollToMessage = () => {
  const messageBox = document.getElementById("messageBox");
  if (messageBox) {
    window.scrollTo(0, messageBox.offsetTop);
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
