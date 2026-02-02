<template>
  <v-container fill-height class="d-flex justify-center">
    <v-col cols="8">
      <v-row align="center" justify="center">
        <v-card flat class="pa-4">
          <v-form ref="form">
            <h1 class="pb-4">{{ $t("auth.changePassword.title") }}</h1>
            <v-card-text class="fondGris">
              <div class="pt-4 px-4">
                <PasswordForm :action="RouteAction.MODIFICATION" :linkIsExpired="false" />
              </div>
              <v-spacer class="hidden-sm-and-down"></v-spacer>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn :loading="loading" size="x-large" @click="validate">
                  {{ $t("auth.changePassword.submit") }}
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
import PasswordForm, { passwordFormKey } from "@/components/authentication/PasswordForm.vue";
import { useAuthService } from "@/composables/service/useAuthService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import { RouteAction, RouteName } from "@/router";
import { provide, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbar();
const authService = useAuthService();
const { t } = useI18n();

const form = ref<VForm | null>(null);
const { loading, startLoading, stopLoading } = useLoading();

const passwordFormState = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

provide(passwordFormKey, passwordFormState);

const validate = async () => {
  const formValidation = await form.value?.validate();
  if (formValidation?.valid) {
    submit();
  }
};

const submit = async () => {
  startLoading();
  try {
    await authService.changePassword(
      passwordFormState.oldPassword,
      passwordFormState.newPassword,
      authStore.token
    );

    snackbar.success(t("auth.changePassword.success"), {
      timeout: 2000,
      onHide: () => router.push({ name: RouteName.Home })
    });
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    stopLoading();
  }
};
</script>
