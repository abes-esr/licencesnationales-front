<template>
  <v-col cols="12" md="12" lg="6" xl="3">
    <div class="borderCol fondBlanc card-full card-relative">
      <div class="d-flex justify-space-between align-center">
        <h2 class="my-3 pl-4 mb-0">{{ $t("dashboard.contact.title") }}</h2>
      </div>
      <v-card-text class="d-flex align-content-start flex-wrap pt-0 no-border">
        <div class="d-flex flex-column justify-start mx-3 mb-3 mt-0 bloc-info">
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.lastName") }}</h3>
            {{ contact.lastName }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.firstName") }}</h3>
            {{ contact.firstName }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.phone") }}</h3>
            {{ contact.phone }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.email") }}</h3>
            {{ contact.email }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.address") }}</h3>
            {{ contact.address }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.poBox") }}</h3>
            {{ contact.poBox }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.postalCode") }}</h3>
            {{ contact.postalCode }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.city") }}</h3>
            {{ contact.city }}
          </div>
          <div class="mt-2">
            <h3 class="d-inline">{{ $t("dashboard.contact.cedex") }}</h3>
            {{ contact.cedex }}
          </div>
        </div>
        <v-row class="text-right pb-4 pr-4 card-actions-bottom">
          <v-col cols="12">
            <v-btn variant="tonal" :to="{ name: profileRoute }">
              {{ $t("dashboard.contact.editContact") }}
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn variant="tonal" :to="{ name: passwordRoute }">
              {{ $t("dashboard.contact.editPassword") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
  </v-col>
</template>

<script setup lang="ts">
import InstitutionContact from "@/entity/InstitutionContact";
import { RouteName } from "@/router";
import { useI18n } from "vue-i18n";

withDefaults(
  defineProps<{
    contact: InstitutionContact;
    profileRoute?: RouteName;
    passwordRoute?: RouteName;
  }>(),
  {
    profileRoute: RouteName.Profile,
    passwordRoute: RouteName.Password
  }
);

useI18n();
</script>

<style scoped lang="scss" src="./dashboard.scss"></style>
