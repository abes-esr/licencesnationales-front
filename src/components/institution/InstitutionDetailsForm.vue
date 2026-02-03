<template>
  <v-card class="d-flex justify-space-between flex-column w-100 pa-4">
    <div class="d-flex justify-space-between align-center">
      <h2 class="mb-3">{{ $t("institution.card.institutionSection") }}</h2>
      <v-tooltip v-if="!isAdmin" :text="$t('institution.card.readonly')" location="top" open-delay="100" theme="dark"
        content-class="text-white">
        <template #activator="{ props }">
          <FontAwesomeIcon v-bind="props" :icon="faLock" class="fa-2x mx-2" />
        </template>
      </v-tooltip>
    </div>
    <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
      <v-text-field :label="$t('institution.card.siren')" :placeholder="$t('institution.card.siren')"
        variant="outlined" v-model="institution.siren" disabled class="mt-1" />
      <v-text-field :label="$t('institution.card.institutionName')"
        :placeholder="$t('institution.card.institutionName')" variant="outlined" v-model="institution.name"
        :disabled="isEditModeDisabled" class="mt-1" />
      <v-text-field :label="$t('institution.card.idAbes')" :placeholder="$t('institution.card.idAbes')"
        variant="outlined" v-model="institution.abesId" disabled class="mt-1" />
      <v-select :label="$t('institution.card.institutionType')" :items="institutionTypes" variant="outlined"
        v-model="institution.institutionType" :disabled="isEditModeDisabled" class="mt-1" />
      <div class="mt-1">
        <h3 class="d-inline">{{ $t("institution.card.institutionStatus") }}</h3>
        {{ institution.status }}
      </div>
      <div class="mt-1">
        <h3 class="d-inline">{{ $t("institution.card.ipStatus") }}</h3>
        {{ institution.ipStatus }}
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import Institution from "@/entity/Institution";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  institution: Institution;
  institutionTypes: string[];
  isEditModeDisabled: boolean;
  isAdmin: boolean;
}>();
</script>

