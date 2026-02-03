<template>
  <v-card class="pa-8 w-100 login-card">
    <v-card-title class="text-center">
      <h1>{{ $t("auth.login.title") }}</h1>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-form ref="formRef">
        <v-row>
          <v-col cols="12" class="pa-2">
            <v-text-field v-model="sirenValue" :label="$t('auth.login.sirenLabel')"
              :placeholder="$t('auth.login.sirenPlaceholder')" :rules="sirenRules" variant="outlined" maxLength="9"
              autocomplete="username" required @keyup.enter="validate"></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-2">
            <v-text-field v-model="passwordValue" :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="isPasswordVisible ? 'text' : 'password'" :label="$t('auth.login.passwordLabel')"
              :placeholder="$t('auth.login.passwordPlaceholder')" :rules="passwordRules" variant="outlined" required
              @click:append-inner="togglePasswordVisibility" @keyup.enter="validate"
              autocomplete="current-password"></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-2 d-flex justify-end">
            <v-btn :loading="loading" size="x-large" class="bouton-connexion" @click="validate">
              {{ $t("auth.login.submit") }}
              <v-icon class="pl-2">mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-text class="pa-0 pt-4">
      <v-btn variant="text" class="text-none" :to="{ name: RouteName.ForgotPassword }">
        {{ $t("auth.login.forgotPassword") }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import { useToggle } from "@/composables/useToggle";
import { useValidationRules } from "@/composables/useValidationRules";
import { RouteName } from "@/router";
import { ref } from "vue";
import type { VForm } from "vuetify/components";

const snackbar = useSnackbar();
const authStore = useAuthStore();
const { sirenRules, passwordRules } = useValidationRules();
const sirenValue = ref("");
const passwordValue = ref("");
const formRef = ref<VForm | null>(null);
const { loading, startLoading, stopLoading } = useLoading();
const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useToggle(false);

const validate = async () => {
  const validation = await formRef.value?.validate();
  if (!validation?.valid) {
    return;
  }
  await login();
};

const login = async () => {
  startLoading();
  try {
    await authStore.login({
      login: sirenValue.value,
      password: passwordValue.value
    });

  } catch (err) {
    snackbar.error(err);
  } finally {
    stopLoading();
  }
};

</script>

<style scoped>
.login-card {
  width: 350px;
}

h1 {
  text-align: center;
  padding-bottom: 20px;
}

.bouton-connexion {
  width: 100%;
}
</style>
