<template>
  <v-col cols="12" md="12" lg="6" xl="3">
    <div class="borderCol fondBlanc card-full card-relative" :class="[isCompact ? 'compact-form' : '']">
      <div class="d-flex">
        <h2 class="my-3 pl-4 mb-0">{{ $t("dashboard.institution.title") }}</h2>
        <v-tooltip :text="$t('dashboard.institution.readonly')" location="top" open-delay="100" theme="dark"
          content-class="text-white">
          <template #activator="{ props }">
            <FontAwesomeIcon v-bind="props" :icon="faLock" class="fa-2x mx-2 lock-icon" />
          </template>
        </v-tooltip>
      </div>
      <v-card-text class="d-flex align-content-start flex-wrap pt-0 no-border">
        <div class="d-flex flex-column justify-start mx-3 mb-3 mt-0 bloc-info">
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.institution.siren") }}</h3>
            {{ institution.siren }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.institution.idAbes") }}</h3>
            {{ institution.abesId }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.institution.name") }}</h3>
            {{ institution.name }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.institution.type") }}</h3>
            {{ institution.institutionType }}
          </div>
        </div>
      </v-card-text>
      <v-alert outlined class="ma-2 pt-1 pb-0 card-alert-bottom">
        <FontAwesomeIcon :icon="faCircleInfo" class="fa-2x mr-5 mb-1 icone-information" />
        <p class="mb-0 pl-12">
          {{ $t("dashboard.institution.contactSupport") }}
          <a href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank">ABESstp</a>
        </p>
      </v-alert>
    </div>
  </v-col>
</template>

<script setup lang="ts">
import Institution from "@/entity/Institution";
import { faCircleInfo, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useI18n } from "vue-i18n";

defineProps<{
  institution: Institution;
  isCompact: boolean;
}>();

useI18n();
</script>

<style scoped lang="scss" src="./dashboard.scss"></style>
