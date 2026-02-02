<template>
  <div class="d-flex flex-column">
    <v-alert variant="outlined" class="pa-2 mb-4" v-if="!linkIsExpired">
      <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 mt-2 icone-information" />
      {{ $t("auth.passwordForm.rules") }}
    </v-alert>
    <v-alert variant="outlined" class="pa-2 mb-4" v-if="linkIsExpired">
      <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 mt-2 icone-information" />
      {{ $t("auth.passwordForm.expiredMessage") }}
      <router-link :to="{ name: RouteName.Login }">
        {{ $t("auth.passwordForm.expiredLink") }}
      </router-link>
    </v-alert>
    <v-text-field v-if="action === RouteAction.MODIFICATION && !linkIsExpired" variant="outlined"
      :label="$t('auth.passwordForm.oldPasswordLabel')" :placeholder="$t('auth.passwordForm.oldPasswordPlaceholder')"
      :type="isPasswordVisible ? 'text' : 'password'" :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="formState.oldPassword" :rules="passwordRules" required :disabled="isDisableForm"
      @click:append-inner="togglePasswordVisibility" autocomplete="new-password" />
    <v-text-field v-if="!linkIsExpired" variant="outlined" :label="action === RouteAction.CREATION ? $t('auth.passwordForm.createPasswordLabel') : $t('auth.passwordForm.updatePasswordLabel')
      " :placeholder="action === RouteAction.CREATION ? $t('auth.passwordForm.createPasswordPlaceholder') : $t('auth.passwordForm.updatePasswordPlaceholder')
        " :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'" v-model="formState.newPassword"
      :rules="passwordRules" required @click:append-inner="togglePasswordVisibility" :disabled="isDisableForm"
      autocomplete="new-password" />
    <v-text-field v-if="!linkIsExpired" variant="outlined" :label="action === RouteAction.CREATION
      ? $t('auth.passwordForm.createConfirmLabel')
      : $t('auth.passwordForm.updateConfirmLabel')
      " :placeholder="action === RouteAction.CREATION
        ? $t('auth.passwordForm.createConfirmPlaceholder')
        : $t('auth.passwordForm.updateConfirmPlaceholder')
        " :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'" v-model="formState.confirmPassword"
      :rules="passwordRules.concat(confirmPasswordRules)" required @click:append-inner="togglePasswordVisibility"
      :disabled="isDisableForm" autocomplete="new-password" />
  </div>
</template>
<script lang="ts">
export type PasswordFormState = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const passwordFormKey: InjectionKey<PasswordFormState> = Symbol("passwordFormState");
</script>
<script setup lang="ts">
import { useToggle } from "@/composables/useToggle";
import { useValidationRules } from "@/composables/useValidationRules";
import { RouteAction, RouteName } from "@/router";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { InjectionKey } from "vue";
import { inject } from "vue";
import { useI18n } from "vue-i18n";



const props = withDefaults(
  defineProps<{
    action: RouteAction;
    isDisableForm?: boolean;
    linkIsExpired?: boolean;
  }>(),
  {
    isDisableForm: false,
    linkIsExpired: false
  }
);

const { t } = useI18n();
const { passwordRules } = useValidationRules();
const formState = inject(passwordFormKey);
const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useToggle(false);

const confirmPasswordRules = () =>
  formState.newPassword === formState.confirmPassword ||
  formState.confirmPassword === "" ||
  t("auth.passwordForm.confirmMismatch");
</script>
