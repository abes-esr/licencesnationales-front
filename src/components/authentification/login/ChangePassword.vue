<template>
  <v-container fill-height class="d-flex justify-center">
    <v-col cols="8">
      <v-row align="center" justify="center">
        <v-card flat class="pa-4">
          <v-form ref="form">
            <h1 class="pb-4">Modifier mon mot de passe</h1>
            <MessageBox />
            <v-card-text class="fondGris">
              <div class="pt-4 px-4">
                <MotDePasse
                  ref="motDePasse"
                  :action="Action.MODIFICATION"
                  :ancien-mot-de-passe="oldPassword"
                  :nouveau-mot-de-passe="newPassword"
                  :linkIsExpired="false"
                  @update:ancienMotDePasse="updateAncienMotDePasse"
                  @update:nouveauMotDePasse="updateNouveauMotDePasse"
                  :isDisableForm="isDisableForm"
                />
              </div>
              <v-spacer class="hidden-sm-and-down"></v-spacer>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn :loading="buttonLoading" size="x-large" @click="validate">
                  Valider
                  <v-icon class="pl-2">mdi-arrow-right-circle-outline</v-icon>
                </v-btn>
              </v-col>
            </v-card-text>
          </v-form>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Logger } from "@/utils/Logger";
import { authService } from "@/core/service/licencesnationales/AuthentificationService";
import MotDePasse from "@/components/authentification/MotDePasse.vue";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import MessageBox from "@/components/common/MessageBox.vue";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const form = ref<VForm | null>(null);
const motDePasse = ref<InstanceType<typeof MotDePasse> | null>(null);
const buttonLoading = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const isDisableForm = ref(false);

onMounted(() => {
  window.scrollTo(0, 0);
});

const updateAncienMotDePasse = (value: string) => {
  oldPassword.value = value;
};

const updateNouveauMotDePasse = (value: string) => {
  newPassword.value = value;
};

const validate = async () => {
  const formValid = await form.value?.validate();
  const mdpValid = await motDePasse.value?.validate();
  if (formValid?.valid && mdpValid) {
    submit();
  }
};

const submit = async () => {
  buttonLoading.value = true;
  messageStore.closeDisplayedMessage();
  try {
    await authService.changePassword(
      oldPassword.value,
      newPassword.value,
      authStore.getToken
    );

    const message: Message = new Message();
    message.type = MessageType.VALIDATION;
    message.texte = "Le mot de passe a été mis à jour";
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);

    const messageBox = document.getElementById("messageBox");
    if (messageBox) {
      window.scrollTo(0, messageBox.offsetTop);
    }

    setTimeout(() => {
      messageStore.closeDisplayedMessage();
      router.push({ name: "Home" });
    }, 2000);
  } catch (err: any) {
    Logger.error(err?.toString?.() ?? err);
    const message: Message = new Message();
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
    const messageBox = document.getElementById("messageBox");
    if (messageBox) {
      window.scrollTo(0, messageBox.offsetTop);
    }
  } finally {
    buttonLoading.value = false;
  }
};

const clear = () => {
  messageStore.closeDisplayedMessage();
  router.push({ name: "Home" }).catch(err => {
    Logger.error(err);
  });
};

defineExpose({ clear });
</script>
