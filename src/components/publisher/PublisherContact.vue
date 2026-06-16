<template>
  <v-card witdh="50%" outlined>
    <v-form ref="formRef" :outline="true" lazy-validation>
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn class="ma-0 pa-0 bouton-simple" icon x-large @click="remove()">
          <FontAwesomeIcon :icon="faXmark" class="fa-orange" />
        </v-btn>
      </v-card-actions>
      <v-card-text class="mb-0 pb-0">
        <v-radio-group row v-model="contact.type" class="d-flex justify-center">
          <v-radio v-for="type in typeContactCandidates" :key="type"
            :label="`Contact ${typeContactCandidatesLabel[type]}`" :value="type"></v-radio>
        </v-radio-group>

        <v-text-field outlined label="Nom" placeholder="Nom" v-model="contact.lastName" :rules="lastNameRules" required
          @keyup.enter="validate()"></v-text-field>
        <v-text-field outlined label="Prénom" placeholder="Prénom" v-model="contact.firstName" :rules="firstNameRules"
          required @keyup.enter="validate()"></v-text-field>
        <v-text-field outlined label="Adresse e-mail" placeholder="Adresse e-mail" v-model="contact.email"
          :rules="emailRules" required @keyup.enter="validate()"></v-text-field>
      </v-card-text>

    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useValidationRules } from "@/composables/useValidationRules";
import PublisherContact, { ContactType } from "@/entity/PublisherContact";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";

// Props
const props = defineProps<{
  contact: PublisherContact;
}>();

// Emits
const emit = defineEmits<{
  (e: "onChange"): void;
}>();

const { emailRules, firstNameRules, lastNameRules } = useValidationRules();

// Candidates
const typeContactCandidates = [
  ContactType.COMMERCIAL,
  ContactType.TECHNIQUE
];

// Equivalent de ton constructeur → générer les labels
const typeContactCandidatesLabel = ref<string[]>([]);

onMounted(() => {
  typeContactCandidatesLabel.value = typeContactCandidates.map(
    (t) => ContactType[t].toLowerCase()
  );
});

// Refs (ancien $refs.form)
const formRef = ref<any>(null);

// Methods

function remove() {
  emit("onChange");
}

function validate(): boolean {
  if (formRef.value?.validate) {
    return formRef.value.validate();
  }
  return false;
}

function clear(): void {
  if (formRef.value?.resetValidation) {
    formRef.value.resetValidation();
  }
}

defineExpose({ validate, clear });
</script>

<style scoped lang="scss">
.v-card-text {
  border: 0;
}

.v-input--radio-group__input {
  justify-content: center;
}
</style>
