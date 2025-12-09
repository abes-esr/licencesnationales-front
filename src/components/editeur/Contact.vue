<template>
  <v-card witdh="50%" outlined>
    <v-form ref="form" :outline="true" lazy-validation>
      <v-card-text class="mb-0 pb-0">
        <v-radio-group row v-model="contact.type" class="d-flex justify-center">
          <v-radio
            v-for="type in typeContactCandidates"
            :key="type"
            :label="`Contact ${typeContactCandidatesLabel[type]}`"
            :value="type"
          ></v-radio>
        </v-radio-group>

        <v-text-field
          outlined
          label="Nom"
          placeholder="Nom"
          v-model="contact.nom"
          :rules="rulesForms.nom"
          required
          @keyup.enter="validate()"
        ></v-text-field>
        <v-text-field
          outlined
          label="Prénom"
          placeholder="Prénom"
          v-model="contact.prenom"
          :rules="rulesForms.prenom"
          required
          @keyup.enter="validate()"
        ></v-text-field>
        <v-text-field
          outlined
          label="Adresse e-mail"
          placeholder="Adresse e-mail"
          v-model="contact.mail"
          :rules="rulesForms.email"
          required
          @keyup.enter="validate()"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-btn class="ma-0 pa-0 bouton-simple" icon x-large @click="remove()">
          <FontAwesomeIcon :icon="['fas', 'times']" class="fa-orange" />
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ContactType } from "@/core/CommonDefinition";
import ContactEditeur from "@/core/ContactEditeur";
import { rulesForms } from "@/core/RulesForm";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Props
const props = defineProps<{
  contact: ContactEditeur;
}>();

// Emits
const emit = defineEmits<{
  (e: "onChange"): void;
}>();

// rulesForms
const rules = rulesForms;

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
</script>

<style scoped lang="scss">
.v-card__text {
  border: 0;
}

.v-card__title {
  width: 100%;
}

.v-input--radio-group__input {
  justify-content: center;
}
</style>
