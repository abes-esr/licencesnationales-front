<template>
  <v-container fill-height class="d-flex justify-center">
    <v-col cols="8">
      <v-row align="center" justify="center">
        <v-card flat class="pa-4">
          <v-form ref="form">
            <h1 class="pb-4">{{ $t("auth.changePassword.title") }}</h1>
            <v-card-text class="fondGris">
              <div class="pt-4 px-4">
                <PasswordForm ref="passwordForm" :action="Action.MODIFICATION" v-model:oldPassword="oldPassword"
                  v-model:newPassword="newPassword" :linkIsExpired="false" />
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
import PasswordForm from "@/components/authentication/PasswordForm.vue";
import { useAuthService } from "@/composables/service/useAuthService";
import { useLoading } from "@/utils/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import { Action } from "@/entity/CommonDefinition";
import { RouteName } from "@/router";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const snackbar = useSnackbar();
const authService = useAuthService();
const { t } = useI18n();

const form = ref<VForm | null>(null);
const passwordForm = ref<InstanceType<typeof PasswordForm> | null>(null);
const { loading, startLoading, stopLoading } = useLoading();
const oldPassword = ref("");
const newPassword = ref("");

const validate = async () => {
  const formValidation = await form.value?.validate();
  const passwordsValid = await passwordForm.value?.validate();
  if (formValidation?.valid && passwordsValid) {
    submit();
  }
};

const submit = async () => {
  startLoading();
  try {
    await authService.changePassword(
      oldPassword.value,
      newPassword.value,
      authStore.getToken
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




