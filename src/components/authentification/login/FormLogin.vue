<template>
  <v-card elevation="0">
    <v-card-title class="pa-3"><h1>S'authentifier</h1></v-card-title>
    <MessageBox />
    <v-card-text class="rounded pa-3 fondGris">
      <v-form ref="form">
        <v-row>
          <v-col cols="1" />
          <v-col cols="10" class="pb-0">
            <v-text-field
              ref="loginRef"
              variant="outlined"
              placeholder="SIREN"
              maxlength="9"
              v-model="siren"
              :rules="rulesForms.siren"
              required
              @keyup.enter="validate"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10" class="pt-0">
            <v-icon> mdi-information </v-icon>
            <a
              href="https://annuaire-entreprises.data.gouv.fr/"
              target="_blank"
              style="font-size: 1.1rem"
              >Trouver le SIREN de votre établissement</a
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" />
          <v-col cols="10" class="pt-0">
            <v-text-field
              ref="passwordRef"
              variant="outlined"
              placeholder="Mot de passe"
              :type="show ? 'text' : 'password'"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              v-model="password"
              :rules="rulesForms.motDePasse"
              required
              @click:append-inner="show = !show"
              @keyup.enter="validate"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8" class="pl-10">
            <a @click="afficherMotDePasseOulie">Mot de passe oublié ?</a>
          </v-col>
          <v-col>
            <v-btn class="btn-1" :loading="buttonLoading" @click="validate">
              Se connecter
              <v-icon>mdi-arrow-right-circle-outline </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessageStore } from "@/stores/messageStore";
import { useAuthStore } from "@/stores/authStore";
import { Logger } from "@/utils/Logger";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { rulesForms } from "@/core/RulesForm";
import { Message, MessageType } from "@/core/CommonDefinition";
import MessageBox from "@/components/common/MessageBox.vue";
import type { VForm } from "vuetify/components";

const emit = defineEmits<{
  (e: "onChange"): void;
}>();

const messageStore = useMessageStore();
const authStore = useAuthStore();

const siren = ref("");
const password = ref("");

const buttonLoading = ref(false);
const show = ref(false);

const form = ref<VForm | null>(null);
const loginRef = ref<any>(null);
const passwordRef = ref<any>(null);

const validate = async () => {
  messageStore.closeDisplayedMessage();
  const validation = await form.value?.validate();
  if (validation?.valid) {
    login();
  }
};

const login = async () => {
  buttonLoading.value = true;
  messageStore.closeDisplayedMessage();

  try {
    await authStore.login({
      login: siren.value,
      password: password.value
    });
  } catch (err: any) {
    Logger.error(err?.toString?.() ?? err);

    const message = new Message();
    message.type = MessageType.ERREUR;

    if (err instanceof LicencesNationalesBadRequestApiError) {
      message.texte = err.message;
    } else {
      message.texte = "Impossible d'exécuter l'action : " + (err?.message ?? "");
    }

    message.isSticky = true;

    try {
      messageStore.openDisplayedMessage(message);
    } catch (error: any) {
      Logger.error(error?.toString?.() ?? error);
    }
  } finally {
    buttonLoading.value = false;
  }
};

const afficherMotDePasseOulie = () => {
  emit("onChange");
};
</script>

