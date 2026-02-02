<template>
  <v-form ref="formRef" lazy-validation :disabled="isDisableForm">
    <v-row>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.lastName')"
            :placeholder="$t('institution.contactForm.lastName')" v-model="contact.lastName" :rules="lastNameRules"
            required @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.firstName')"
            :placeholder="$t('institution.contactForm.firstName')" v-model="contact.firstName" :rules="firstNameRules"
            required @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.address')"
            :placeholder="$t('institution.contactForm.address')" maxlength="80" v-model="contact.address"
            :rules="addressRules" required @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.poBox')"
            :placeholder="$t('institution.contactForm.poBox')" v-model="contact.poBox" required
            @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.postalCode')"
            :placeholder="$t('institution.contactForm.postalCode')" maxlength="5" v-model="contact.postalCode"
            :rules="postalCodeRules" required @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.city')"
            :placeholder="$t('institution.contactForm.city')" v-model="contact.city" :rules="cityRules" required
            @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.cedex')"
            :placeholder="$t('institution.contactForm.cedex')" v-model="contact.cedex" required
            @keyup.enter="validate()"></v-text-field>
        </v-row>
      </v-col>
      <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row>
          <v-text-field outlined :label="$t('institution.contactForm.phone')"
            :placeholder="$t('institution.contactForm.phone')" maxlength="10" v-model.trim="contact.phone"
            :rules="phoneRules" required @paste.prevent="pastePhone" @keyup.enter="validate()"></v-text-field>
        </v-row>
        <v-row>
          <v-form ref="mailRef" :disabled="isDisableForm" style="width: 100%">
            <v-alert variant="outlined" class="pa-2 mb-4" v-if="action === RouteAction.CREATION">
              <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 mt-2 icone-information" />
              {{ $t("institution.contactForm.emailNotice") }}
            </v-alert>
            <v-text-field outlined :label="$t('institution.contactForm.email')"
              :placeholder="$t('institution.contactForm.email')" v-model="contact.email" :rules="baseRules" required
              @keyup.enter="validate()" autocomplete="new-mail"></v-text-field>
            <v-text-field outlined :label="$t('institution.contactForm.confirmEmail')"
              :placeholder="$t('institution.contactForm.confirmEmail')" v-model="emailConfirmation" :rules="baseRules"
              required @keyup.enter="validate()"
              autocomplete="new-mail"></v-text-field>
          </v-form>
        </v-row>
        <v-row>
          <PasswordForm
            v-if="action === RouteAction.CREATION || action === RouteAction.FUSION || action === RouteAction.SCISSION"
            :action="RouteAction.CREATION" :linkIsExpired="false" :isDisableForm="isDisableForm"></PasswordForm>
        </v-row>
        <v-row>
          <div v-if="action === RouteAction.CREATION">
            <v-checkbox required :rules="privacyAcceptanceRules"
              :label="$t('institution.contactForm.privacyConsent')"></v-checkbox>
            <div>
              {{ $t("institution.contactForm.privacyNotice") }}
              <router-link :to="{ name: RouteName.Privacy }" target="_blank" rel="noopener noreferrer">
                {{ $t("institution.contactForm.privacyLink") }}
              </router-link>
            </div>
            <br />
            <div>
              {{ $t("institution.contactForm.recaptchaIntro") }}
              <a href="https://policies.google.com/privacy" target="_blank">{{
                $t("institution.contactForm.recaptchaPrivacy") }}</a>
              {{ $t("institution.contactForm.recaptchaAnd") }}
              <a href="https://policies.google.com/terms" target="_blank">{{
                $t("institution.contactForm.recaptchaTerms") }}</a>
              {{ $t("institution.contactForm.recaptchaApply") }}
            </div>
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts" setup>
import PasswordForm, { passwordFormKey } from "@/components/authentication/PasswordForm.vue";
import { useValidationRules } from "@/composables/useValidationRules";
import InstitutionContact from "@/entity/InstitutionContact";
import { RouteAction, RouteName } from "@/router";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, provide, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  contact: InstitutionContact;
  action: RouteAction;
  isDisableForm: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();
const {
  addressRules,
  cityRules,
  emailRules,
  firstNameRules,
  lastNameRules,
  phoneRules,
  postalCodeRules,
  privacyAcceptanceRules
} = useValidationRules();

const emailConfirmation = ref("");
const initialEmail = ref("");
const passwordFormState = reactive({
  oldPassword: "",
  newPassword: props.contact.password ?? "",
  confirmPassword: ""
});

const formRef = ref();
const mailRef = ref();

onMounted(() => {
  initialEmail.value = props.contact.email;
});

const rulesMailConfirmation = computed(() => {
  return (value: string) =>
    value === props.contact.email ||
    value === "" ||
    t("institution.contactForm.confirmEmailError");
});

const baseRules = computed(() => {
  const baseRules = emailRules as Array<(v: string) => true | string>;
  return baseRules.concat(rulesMailConfirmation.value);
});

const shouldValidateMail = computed(() => {
  return props.action === RouteAction.CREATION || initialEmail.value !== props.contact.email;
});

function validate(): boolean {
  const isFormValide = formRef.value?.validate() ?? true;

  let isMailValide = true;
  if (shouldValidateMail.value) {
    isMailValide = mailRef.value?.validate() ?? true;
  }

  return isFormValide && isMailValide;
}

function clear() {
  formRef.value?.resetValidation();
  mailRef.value?.resetValidation();
  props.contact.reset();
  passwordFormState.oldPassword = "";
  passwordFormState.newPassword = props.contact.password ?? "";
  passwordFormState.confirmPassword = "";
}

function pastePhone(evt: ClipboardEvent) {
  props.contact.phone = evt.clipboardData
    ?.getData("text")
    .replaceAll(" ", "")
    .replaceAll(".", "") ?? "";
}

watch(
  () => passwordFormState.newPassword,
  value => {
    props.contact.password = value;
  }
);

watch(
  () => props.contact.password,
  value => {
    if (passwordFormState.newPassword !== (value ?? "")) {
      passwordFormState.newPassword = value ?? "";
    }
  }
);

watch(
  [() => emailConfirmation.value, () => props.contact.email],
  () => {
    if (emailConfirmation.value !== "") {
      mailRef.value?.validate();
    }
  }
);

provide(passwordFormKey, passwordFormState);

defineExpose({
  validate,
  clear,
});
</script>
