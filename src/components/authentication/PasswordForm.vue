<template>
  <v-form ref="formRef" :disabled="isDisableForm" class="d-flex flex-column">
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
      v-model="oldPasswordModel" :rules="passwordRules.concat(confirmPasswordRules)" required
      @click:append-inner="togglePasswordVisibility" autocomplete="new-password" @keyup.enter="validate" />
    <v-text-field v-if="!linkIsExpired" variant="outlined" :label="action === RouteAction.CREATION ? $t('auth.passwordForm.createPasswordLabel') : $t('auth.passwordForm.updatePasswordLabel')
      " :placeholder="action === RouteAction.CREATION ? $t('auth.passwordForm.createPasswordPlaceholder') : $t('auth.passwordForm.updatePasswordPlaceholder')
        " :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'" v-model="newPasswordModel"
      :rules="passwordRules.concat(passwordRule)" required @click:append-inner="togglePasswordVisibility"
      autocomplete="new-password" @keyup.enter="validate" />
    <v-text-field v-if="!linkIsExpired" variant="outlined" :label="action === RouteAction.CREATION
      ? $t('auth.passwordForm.createConfirmLabel')
      : $t('auth.passwordForm.updateConfirmLabel')
      " :placeholder="action === RouteAction.CREATION
        ? $t('auth.passwordForm.createConfirmPlaceholder')
        : $t('auth.passwordForm.updateConfirmPlaceholder')
        " :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'" v-model="confirmPassword"
      :rules="passwordRules.concat(confirmPasswordRules)" required @click:append-inner="togglePasswordVisibility"
      autocomplete="new-password" @keyup.enter="validate" />
  </v-form>
</template>

<script setup lang="ts">
import { useToggle } from "@/composables/useToggle";
import { useValidationRules } from "@/composables/useValidationRules";
import { RouteAction, RouteName } from "@/router";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { VForm } from "vuetify/components";

const props = withDefaults(
  defineProps<{
    action: RouteAction;
    oldPassword?: string;
    newPassword: string;
    isDisableForm?: boolean;
    linkIsExpired?: boolean;
  }>(),
  {
    oldPassword: "",
    isDisableForm: false,
    linkIsExpired: false
  }
);

const emit = defineEmits<{
  (e: "update:oldPassword", value: string): void;
  (e: "update:newPassword", value: string): void;
}>();

const { t } = useI18n();
const { passwordRules } = useValidationRules();

const confirmPassword = ref("");
const formRef = ref<VForm | null>(null);
const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useToggle(false);

const oldPasswordModel = computed({
  get: () => props.oldPassword ?? "",
  set: value => emit("update:oldPassword", value)
});

const newPasswordModel = computed({
  get: () => props.newPassword,
  set: value => emit("update:newPassword", value)
});

const passwordRule = () =>
  confirmPassword.value === "" ||
  newPasswordModel.value === confirmPassword.value ||
  t("auth.passwordForm.confirmMismatch");

const confirmPasswordRules = () =>
  newPasswordModel.value === confirmPassword.value ||
  confirmPassword.value === "" ||
  t("auth.passwordForm.confirmMismatch");

watch(
  () => newPasswordModel.value,
  async () => {
    if (confirmPassword.value !== "") {
      await formRef.value?.validate();
    }
  }
);

const validate = async (): Promise<boolean> => {
  const validation = await formRef.value?.validate();
  return validation?.valid ?? false;
};

const clear = () => {
  formRef.value?.resetValidation();
  confirmPassword.value = "";
};

defineExpose({ validate, clear });
</script>
