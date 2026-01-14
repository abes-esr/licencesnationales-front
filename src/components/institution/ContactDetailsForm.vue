<template>
  <v-card class="d-flex justify-space-between flex-column w-100 pa-4">
    <div class="d-flex justify-space-between align-center">
      <h2 class="mb-3">{{ $t("institution.card.contactSection") }}</h2>
    </div>
    <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
      <v-text-field :label="$t('institution.card.contactLastName')"
        :placeholder="$t('institution.card.contactLastName')" variant="outlined" v-model="institution.contact.nom"
        :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactFirstName')"
        :placeholder="$t('institution.card.contactFirstName')" variant="outlined"
        v-model="institution.contact.prenom" :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactPhone')"
        :placeholder="$t('institution.card.contactPhone')" variant="outlined"
        v-model="institution.contact.telephone" :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactEmail')"
        :placeholder="$t('institution.card.contactEmail')" variant="outlined" v-model="institution.contact.mail"
        :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactAddress')"
        :placeholder="$t('institution.card.contactAddress')" variant="outlined"
        v-model="institution.contact.adresse" :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactPoBox')"
        :placeholder="$t('institution.card.contactPoBox')" variant="outlined"
        v-model="institution.contact.boitePostale" :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactPostalCode')"
        :placeholder="$t('institution.card.contactPostalCode')" variant="outlined"
        v-model="institution.contact.codePostal" :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactCity')"
        :placeholder="$t('institution.card.contactCity')" variant="outlined" v-model="institution.contact.ville"
        :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.contactCedex')"
        :placeholder="$t('institution.card.contactCedex')" variant="outlined" v-model="institution.contact.cedex"
        :disabled="isEditModeDisabled" class="mt-1" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import Institution from "@/entity/Institution";

defineProps<{
  institution: Institution;
  isEditModeDisabled: boolean;
}>();
</script>

