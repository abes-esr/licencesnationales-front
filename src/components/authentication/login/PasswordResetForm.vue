<template>
  <v-container fill-height class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="5" md="8" xs="10">
        <v-card class="elevation-0">
          <v-form ref="resetFormRef" class="elevation-0" :disabled="status !== 'valid'">
            <v-card-title class="pa-3">
              <h1>{{ $t("auth.resetPassword.title") }}</h1>
            </v-card-title>
            <v-card-text>
              <PasswordForm :action="RouteAction.CREATION" class="ma-3" :link-is-expired="status !== 'valid'"
                :is-disable-form="status !== 'valid'" />
            </v-card-text>
            <v-card-actions>
              <v-spacer class="hidden-sm-and-down"></v-spacer>
              <v-col cols="12" md="8" lg="8" xl="8" class="d-flex justify-space-around">
                <v-btn v-if="status !== 'expired'" size="x-large" @click="clear" class="bouton-annuler"
                  :disabled="status !== 'valid'" variant="outlined">
                  {{ $t("auth.resetPassword.cancel") }}
                </v-btn>
                <v-btn v-if="status !== 'expired'" :loading="loading" :disabled="status !== 'valid'" size="x-large"
                  @click="handleRecaptcha" variant="elevated">
                  {{ $t("auth.resetPassword.save") }}
                  <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
                </v-btn>
              </v-col>
            </v-card-actions>
            <v-card-actions>
              <router-link :to="{ name: RouteName.Login }">
                <FontAwesomeIcon :icon="faReply" />&nbsp;{{ $t("auth.resetPassword.backHome") }}
              </router-link>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import PasswordForm, { passwordFormKey } from "@/components/authentication/PasswordForm.vue";
import { useAuthService } from "@/composables/service/useAuthService";
import { useLoading } from "@/composables/useLoading";
import { useRecaptcha } from "@/composables/useRecaptcha";
import { useSnackbar } from "@/composables/useSnackbar";
import { RouteAction, RouteName } from "@/router";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, provide, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const route = useRoute();
const router = useRouter();
const snackbar = useSnackbar();
const { t } = useI18n();
const authService = useAuthService();
const { loadRecaptcha, executeRecaptcha } = useRecaptcha();

const resetToken = ref("");
const recaptchaToken = ref("");
const { loading, startLoading, stopLoading } = useLoading();
const status = ref<"checking" | "valid" | "expired">("checking");

const resetFormRef = ref<VForm | null>(null);

const passwordFormState = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

provide(passwordFormKey, passwordFormState);

onMounted(async () => {
  await setupToken();
});

const setupToken = async () => {
  const token = route.query?.token;
  resetToken.value = typeof token === "string" ? token : "";

  try {
    const valid = await authService.verifyToken(resetToken.value);
    status.value = valid ? "valid" : "expired";
  } catch (err: any) {
    status.value = "expired";
    snackbar.error(err);
  }
};

const handleRecaptcha = async () => {
  await loadRecaptcha();
  recaptchaToken.value = await executeRecaptcha("reinitialisationPass");
  const isValid = await validate();
  if (isValid) {
    await resetPassword();
  } else {
    snackbar.error(t("auth.resetPassword.invalidFields"));
  }
};

const validate = async (): Promise<boolean> => {
  const formValid = await resetFormRef.value?.validate();
  return Boolean(formValid?.valid);
};

const resetPassword = async () => {
  startLoading();
  try {
    const response = await authService.resetPassword({
      nouveauMotDePasse: passwordFormState.newPassword,
      recaptcha: recaptchaToken.value,
      token: resetToken.value
    });
    snackbar.success(response.message, {
      timeout: 4000,
      onHide: () => router.push({ name: RouteName.Login })
    });
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    stopLoading();
  }
};

const clear = () => {
  resetFormRef.value?.resetValidation();
  passwordFormState.oldPassword = "";
  passwordFormState.newPassword = "";
  passwordFormState.confirmPassword = "";
};

</script>
