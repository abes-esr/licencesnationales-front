<template>
  <v-form ref="formRef" lazy-validation :disabled="isDisableForm">
    <v-row>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row
          ><v-text-field
            outlined
            label="Nom"
            placeholder="Nom"
            v-model="contact.nom"
            :rules="rulesForms.nom"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Prénom"
            placeholder="Prénom"
            v-model="contact.prenom"
            :rules="rulesForms.prenom"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Adresse"
            placeholder="Adresse"
            maxlength="80"
            v-model="contact.adresse"
            :rules="rulesForms.adresse"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Boîte postale"
            placeholder="Boîte postale"
            v-model="contact.boitePostale"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Code Postal"
            placeholder="Code Postal"
            maxlength="5"
            v-model="contact.codePostal"
            :rules="rulesForms.codePostal"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="Ville"
            placeholder="Ville"
            v-model="contact.ville"
            :rules="rulesForms.ville"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-text-field
            outlined
            label="CEDEX"
            placeholder="CEDEX"
            v-model="contact.cedex"
            required
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
      </v-col>
      <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
      <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
        <v-row>
          <v-text-field
            outlined
            label="Téléphone"
            placeholder="Téléphone"
            maxlength="10"
            v-model.trim="contact.telephone"
            :rules="rulesForms.tel"
            required
            @paste.prevent="pastePhone"
            @keyup.enter="validate()"
          ></v-text-field
        ></v-row>
        <v-row
          ><v-form ref="mailRef" :disabled="isDisableForm" style="width: 100%">
            <v-alert
              variant="outlined"
              class="pa-2 mb-4"
              v-if="action === Action.CREATION"
            >
              <FontAwesomeIcon
                :icon="faCircleInfo"
                class="fa-2x mr-5 mb-1 mt-2 icone-information"
              />
              Choisir de préférence un alias pérenne pour continuer de recevoir
              les différents messages informatifs sur la gestion du compte et
              des IP déclarées en cas de changement d’interlocuteur ou
              d’interlocutrice au sein de l’établissement
            </v-alert>
            <v-text-field
              outlined
              label="Mail de contact"
              placeholder="Mail de contact"
              v-model="contact.mail"
              :rules="emailRules"
              required
              @keyup="checkConfirmationMail()"
              @keyup.enter="validate()"
              autocomplete="new-mail"
            ></v-text-field>
            <v-text-field
              outlined
              label="Confirmez votre adresse e-mail"
              placeholder="Confirmez votre adresse e-mail"
              v-model="emailConfirmation"
              :rules="emailRules"
              required
              @keyup="checkConfirmationMail()"
              @keyup.enter="validate()"
              autocomplete="new-mail"
            ></v-text-field> </v-form
        ></v-row>
        <v-row>
          <PasswordFields
            ref="motdepasseRef"
            v-if="
              action === Action.CREATION ||
                action === Action.FUSION ||
                action === Action.SCISSION
            "
            :action="Action.CREATION"
            :linkIsExpired="false"
            :nouveau-mot-de-passe="contact.motDePasse"
            @update:nouveauMotDePasse="updateMotDePasse"
            :isDisableForm="isDisableForm"
          ></PasswordFields>
        </v-row>
        <v-row
          ><div v-if="action === Action.CREATION">
            <v-checkbox
              required
              :rules="rulesForms.checkboxRules"
              label="J'accepte les conditions générales liées à la politique de
                confidentialité*"
            ></v-checkbox>
            <div>
              Pour connaître et exercer vos droits relatifs à l'utilisation des
              données collectées par ce formulaire, veuillez consulter la page
              <a @click="gotoDonneesPersonnellesInNewPage()"
                >Données personnelles</a
              >
            </div>
            <br />
            <div>
              Ce formulaire est protégé par reCAPTCHA, la
              <a href="https://policies.google.com/privacy" target="_blank"
                >politique de confidentialité</a
              >
              ainsi que les
              <a href="https://policies.google.com/terms" target="_blank"
                >conditions d'utilisations</a
              >
              de Google s'appliquent.
            </div>
          </div></v-row
        >
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import ContactEtablissement from "@/core/ContactEtablissement";
import PasswordFields from "@/components/authentication/PasswordFields.vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// ---------- Props ----------
interface Props {
  contact: ContactEtablissement;
  action: Action;
  isDisableForm: boolean;
}

const props = defineProps<Props>();
const router = useRouter();

// ---------- Refs ----------
const emailConfirmation = ref("");
const ancienMail = ref("");

// Refs des formulaires (équivalent this.$refs)
const formRef = ref();
const mailRef = ref();
const motdepasseRef = ref();

// ---------- Mounted ----------
onMounted(() => {
  ancienMail.value = props.contact.mail;
});

// ---------- Computed ----------
const rulesMailConfirmation = computed(() => {
  return (value: string) =>
    value === props.contact.mail ||
    value === "" ||
    "Le mail de confirmation n'est pas valide";
});

const emailRules = computed(() => {
  const baseRules = rulesForms.email as Array<(v: string) => true | string>;
  return baseRules.concat(rulesMailConfirmation.value);
});

const shouldValidateMail = computed(() => {
  return props.action === Action.CREATION || ancienMail.value !== props.contact.mail;
});

// ---------- Methods ----------
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

// ---------- Expose to Parent ----------
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
