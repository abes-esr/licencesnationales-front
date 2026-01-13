<template>
  <v-form ref="formRef" lazy-validation :disabled="isDisableForm">
    <v-row>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.lastName')"
            :placeholder="$t('institution.contactForm.lastName')"
            v-model="contact.nom"
            :rules="rulesForms.nom"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.firstName')"
            :placeholder="$t('institution.contactForm.firstName')"
            v-model="contact.prenom"
            :rules="rulesForms.prenom"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.address')"
            :placeholder="$t('institution.contactForm.address')"
            maxlength="80"
            v-model="contact.adresse"
            :rules="rulesForms.adresse"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.poBox')"
            :placeholder="$t('institution.contactForm.poBox')"
            v-model="contact.boitePostale"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.postalCode')"
            :placeholder="$t('institution.contactForm.postalCode')"
            maxlength="5"
            v-model="contact.codePostal"
            :rules="rulesForms.codePostal"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.city')"
            :placeholder="$t('institution.contactForm.city')"
            v-model="contact.ville"
            :rules="rulesForms.ville"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.cedex')"
            :placeholder="$t('institution.contactForm.cedex')"
            v-model="contact.cedex"
            required
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row>
          <v-text-field
            outlined
            :label="$t('institution.contactForm.phone')"
            :placeholder="$t('institution.contactForm.phone')"
            maxlength="10"
            v-model.trim="contact.telephone"
            :rules="rulesForms.tel"
            required
            @paste.prevent="pastePhone"
            @keyup.enter="validate()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-form ref="mailRef" :disabled="isDisableForm" style="width: 100%">
            <v-alert variant="outlined" class="pa-2 mb-4" v-if="action === Action.CREATION">
              <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 mt-2 icone-information" />
              {{ $t("institution.contactForm.emailNotice") }}
            </v-alert>
            <v-text-field
              outlined
              :label="$t('institution.contactForm.email')"
              :placeholder="$t('institution.contactForm.email')"
              v-model="contact.mail"
              :rules="emailRules"
              required
              @keyup="checkConfirmationMail()"
              @keyup.enter="validate()"
              autocomplete="new-mail"
            ></v-text-field>
            <v-text-field
              outlined
              :label="$t('institution.contactForm.confirmEmail')"
              :placeholder="$t('institution.contactForm.confirmEmail')"
              v-model="emailConfirmation"
              :rules="emailRules"
              required
              @keyup="checkConfirmationMail()"
              @keyup.enter="validate()"
              autocomplete="new-mail"
            ></v-text-field>
          </v-form>
        </v-row>
        <v-row>
          <PasswordFields
            ref="motdepasseRef"
            v-if="action === Action.CREATION || action === Action.FUSION || action === Action.SCISSION"
            :action="Action.CREATION"
            :linkIsExpired="false"
            :nouveau-mot-de-passe="contact.motDePasse"
            @update:nouveauMotDePasse="updateMotDePasse"
            :isDisableForm="isDisableForm"
          ></PasswordFields>
        </v-row>
        <v-row>
          <div v-if="action === Action.CREATION">
            <v-checkbox
              required
              :rules="rulesForms.checkboxRules"
              :label="$t('institution.contactForm.privacyConsent')"
            ></v-checkbox>
            <div>
              {{ $t("institution.contactForm.privacyNotice") }}
              <a @click="gotoDonneesPersonnellesInNewPage()">{{ $t("institution.contactForm.privacyLink") }}</a>
            </div>
            <br />
            <div>
              {{ $t("institution.contactForm.recaptchaIntro") }}
              <a href="https://policies.google.com/privacy" target="_blank">{{ $t("institution.contactForm.recaptchaPrivacy") }}</a>
              {{ $t("institution.contactForm.recaptchaAnd") }}
              <a href="https://policies.google.com/terms" target="_blank">{{ $t("institution.contactForm.recaptchaTerms") }}</a>
              {{ $t("institution.contactForm.recaptchaApply") }}
            </div>
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts" setup>
import PasswordFields from "@/components/authentication/PasswordFields.vue";
import { Action } from "@/core/CommonDefinition";
import ContactEtablissement from "@/core/ContactEtablissement";
import { rulesForms } from "@/core/RulesForm";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

interface Props {
  contact: ContactEtablissement;
  action: Action;
  isDisableForm: boolean;
}

const props = defineProps<Props>();
const router = useRouter();
const { t } = useI18n();

const emailConfirmation = ref("");
const ancienMail = ref("");

const formRef = ref();
const mailRef = ref();
const motdepasseRef = ref();

onMounted(() => {
  ancienMail.value = props.contact.mail;
});

const rulesMailConfirmation = computed(() => {
  return (value: string) =>
    value === props.contact.mail ||
    value === "" ||
    t("institution.contactForm.confirmEmailError");
});

const emailRules = computed(() => {
  const baseRules = rulesForms.email as Array<(v: string) => true | string>;
  return baseRules.concat(rulesMailConfirmation.value);
});

const shouldValidateMail = computed(() => {
  return props.action === Action.CREATION || ancienMail.value !== props.contact.mail;
});

function gotoDonneesPersonnellesInNewPage() {
  const route = router.resolve({ path: "/privacy" });
  window.open(route.href);
}

function checkConfirmationMail() {
  if (emailConfirmation.value !== "") {
    mailRef.value?.validate();
  }
}

function validate(): boolean {
  const isFormValide = formRef.value?.validate() ?? true;

  let isMotDePasseValide = true;
  if (motdepasseRef.value) {
    isMotDePasseValide = motdepasseRef.value.validate();
  }

  let isMailValide = true;
  if (shouldValidateMail.value) {
    isMailValide = mailRef.value?.validate() ?? true;
  }

  return isFormValide && isMotDePasseValide && isMailValide;
}

function clear() {
  motdepasseRef.value?.clear();
  formRef.value?.resetValidation();
  mailRef.value?.resetValidation();
  props.contact.reset();
}

function updateMotDePasse(value: string) {
  props.contact.motDePasse = value;
}

function pastePhone(evt: ClipboardEvent) {
  props.contact.telephone = evt.clipboardData
    ?.getData("text")
    .replaceAll(" ", "")
    .replaceAll(".", "") ?? "";
}

defineExpose({
  validate,
  clear,
});
</script>

<style scoped>
.row {
  margin: 0 !important;
}
</style>
