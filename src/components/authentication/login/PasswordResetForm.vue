<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <div>
          <v-card class="elevation-0">
            <v-form ref="formReinitialisationPass" class="elevation-0" :disabled="status !== 'valid'">
              <v-card-title class="pa-3">
                <h1>Reinitialiser le mot de passe</h1>
              </v-card-title>
              <v-card-text>
                <PasswordFields ref="motDePasse" :action="Action.CREATION" v-model:nouveauMotDePasse="formState.newPassword"
                  class="ma-3" :link-is-expired="status !== 'valid'" :is-disable-form="status !== 'valid'" />
              </v-card-text>
              <v-card-actions>
                <v-spacer class="hidden-sm-and-down"></v-spacer>
                <v-col cols="12" md="8" lg="8" xl="8" class="d-flex justify-space-around">
                  <v-btn v-if="!linkExpired" size="x-large" @click="clear" class="bouton-annuler"
                    :disabled="isDisableForm" variant="outlined">
                    Annuler
                  </v-btn>
                  <v-btn v-if="!linkExpired" :loading="buttonLoading" :disabled="isDisableForm" size="x-large"
                    @click="handleRecaptcha" variant="elevated">
                    Enregistrer
                    <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-card-actions>
              <v-card-actions>
                <v-col cols="8"> </v-col>
                <router-link :to="{ name: RouteName.Login }">
                  <FontAwesomeIcon :icon="faReply" />&nbsp;Revenir a la page d'accueil
                </router-link>
              </v-card-actions>
            </v-form>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import PasswordFields from "@/components/authentication/PasswordFields.vue";
import { useAuthService } from "@/composables/useAuthService";
import { useRecaptcha } from "@/composables/useRecaptcha";
import { useSnackbar } from "@/composables/useSnackbar";
import { Action } from "@/core/CommonDefinition";
import { RouteName } from "@/router";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const route = useRoute();
const router = useRouter();
const snackbar = useSnackbar();
const authService = useAuthService();
const { loadRecaptcha, executeRecaptcha } = useRecaptcha();

const resetToken = ref("");
const isDisableForm = ref(false);
const tokenrecaptcha = ref("");
const formState = ref({
  newPassword: ""
});
const buttonLoading = ref(false);
const status = ref<"checking" | "valid" | "expired">("checking");
const linkExpired = computed(() => status.value === "expired");

const formReinitialisationPass = ref<VForm | null>(null);
const motDePasse = ref<InstanceType<typeof PasswordFields> | null>(null);

onMounted(async () => {
  snackbar.hide();
  await setupToken();
});

const setupToken = async () => {
  const token = route.query?.token;
  resetToken.value = typeof token === "string" ? token : "";

  try {
    const valid = await authService.verifierValiditeToken(resetToken.value);
    status.value = valid ? "valid" : "expired";
  } catch (err: any) {
    status.value = "expired";
    snackbar.error(err);
  }
};

const handleRecaptcha = async () => {
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

const reinitialisationPass = async () => {
  buttonLoading.value = true;
  snackbar.hide();

  try {
    const response = await authService.reinitialiserMotDePasse({
      nouveauMotDePasse: formState.value.newPassword,
      recaptcha: tokenrecaptcha.value,
      token: resetToken.value
    });
    snackbar.success(response.message, {
      timeout: 4000,
      onHide: () => router.push({ name: RouteName.Login })
    });
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    buttonLoading.value = false;
  }
};

const clear = () => {
  motDePasse.value?.clear();
  formReinitialisationPass.value?.resetValidation();
  formState.value.newPassword = "";
};

</script>
