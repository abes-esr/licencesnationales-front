<template>
  <v-form ref="form" :disabled="isDisableForm">
    <v-alert variant="outlined" class="pa-3 fondBlanc" v-if="linkIsExpired === false">
      <FontAwesomeIcon
        :icon="['fas', 'info-circle']"
        class="fa-2x mr-5 mb-1 mt-2 icone-information"
      />
      Le mot de passe doit contenir au moins 8 caractères, dont au moins un
      chiffre, une lettre majuscule, une lettre minuscule et un des caractères
      spéciaux suivants : @ $ ! % * ? &
    </v-alert>
    <v-alert variant="outlined" class="pa-3" v-if="linkIsExpired === true">
      <FontAwesomeIcon
        :icon="['fas', 'info-circle']"
        class="fa-2x mr-5 mb-1 mt-2 icone-information"
      />
      Ce lien n'est plus valide (expiration après 24 heures). Pour réinitialiser
      votre mot de passe : <a @click="allerPasswordReset">cliquez ici.</a>
    </v-alert>
    <v-text-field
      v-if="action === Action.MODIFICATION && linkIsExpired === false"
      variant="outlined"
      label="Ancien mot de passe"
      placeholder="Ancien mot de passe"
      :type="show ? 'text' : 'password'"
      :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="ancienMotDePasseModel"
      :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)"
      required
      @click:append-inner="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate"
    />
    <v-text-field
      v-if="linkIsExpired === false"
      variant="outlined"
      :label="
        action === Action.CREATION ? 'Mot de passe' : 'Nouveau mot de passe'
      "
      :placeholder="
        action === Action.CREATION ? 'Mot de passe' : 'Nouveau mot de passe'
      "
      :type="show ? 'text' : 'password'"
      :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="nouveauMotDePasseModel"
      :rules="regleFormulaire.motDePasse.concat(regleMotDePasse)"
      required
      @click:append-inner="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate"
    />
    <v-text-field
      v-if="linkIsExpired === false"
      variant="outlined"
      :label="
        action === Action.CREATION
          ? 'Confirmation du mot de passe'
          : 'Confirmation du nouveau mot de passe'
      "
      :placeholder="
        action === Action.CREATION
          ? 'Confirmation du mot de passe'
          : 'Confirmation du nouveau mot de passe'
      "
      :type="show ? 'text' : 'password'"
      :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      v-model="confirmationNouveauMotDePasse"
      :rules="regleFormulaire.motDePasse.concat(regleConfirmationMotDePasse)"
      required
      @click:append-inner="show = !show"
      autocomplete="new-password"
      @keyup.enter="validate"
    />
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { rulesForms } from "@/core/RulesForm";
import { Action } from "@/core/CommonDefinition";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { VForm } from "vuetify/components";

const props = defineProps<{
  action: Action;
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  isDisableForm: boolean;
  linkIsExpired?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:ancienMotDePasse", value: string): void;
  (e: "update:nouveauMotDePasse", value: string): void;
}>();

const router = useRouter();
const ActionRef = Action;
const regleFormulaire: any = rulesForms;

const confirmationNouveauMotDePasse = ref("");
const show = ref(false);
const form = ref<VForm | null>(null);

const ancienMotDePasseModel = computed({
  get: () => props.ancienMotDePasse,
  set: value => emit("update:ancienMotDePasse", value)
});

const nouveauMotDePasseModel = computed({
  get: () => props.nouveauMotDePasse,
  set: value => emit("update:nouveauMotDePasse", value)
});

const regleMotDePasse = () => () =>
  confirmationNouveauMotDePasse.value === "" ||
  nouveauMotDePasseModel.value === confirmationNouveauMotDePasse.value ||
  "La confirmation du mot de passe ne correspond pas au mot de passe saisi";

const regleConfirmationMotDePasse = () => () =>
  nouveauMotDePasseModel.value === confirmationNouveauMotDePasse.value ||
  confirmationNouveauMotDePasse.value === "" ||
  "La confirmation du mot de passe ne correspond pas au mot de passe saisi";

watch(
  () => nouveauMotDePasseModel.value,
  async () => {
    if (confirmationNouveauMotDePasse.value !== "") {
      await form.value?.validate();
    }
  }
);

const validate = async (): Promise<boolean> => {
  const validation = await form.value?.validate();
  return validation?.valid ?? false;
};

const clear = async (): Promise<void> => {
  await form.value?.resetValidation();
  confirmationNouveauMotDePasse.value = "";
};

const allerPasswordReset = () => {
  router.push({ name: "Login" });
};

defineExpose({ validate, clear, Action: ActionRef });
</script>
