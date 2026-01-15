<template>
  <v-app-bar color="primary" :height="smAndDown ? 174 : 134">
    <v-container fluid class="pa-0">
      <v-row class="align-center" no-gutters>
        <v-btn variant="plain" class="h-100 opacity-100" :aria-label="$t('common.header.appLabel')"
          :to="{ name: RouteName.Home }">
          <v-img :alt="$t('common.header.logoAlt')" src="logo.svg" height="90" width="260" contain />
        </v-btn>

        <v-img :alt="$t('common.header.illustrationAlt')" src="/header/graphe-couleur-appli-ln.png" height="90"
          class="hidden-sm-and-down" cover />
      </v-row>

      <v-row class="align-center bg-secondary px-4" no-gutters>
        <v-col cols="12" md="3">
          <div class="d-flex align-center flex-wrap justify-space-between justify-md-start">
            <v-switch class="theme-selector" density="compact" inset hide-details :model-value="isDark"
              @update:model-value="uiStore.toggleTheme">
              <template #label>
                <p class="text-white text-subtitle-2">{{ $t('common.header.darkTheme') }}</p>
              </template>
            </v-switch>
            <div v-if="isLoggedIn" class="text-white me-4 my-1 hidden-md-and-up">
              {{ $t("common.header.welcome", { name: username }) }}
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="9">
          <div v-if="isLoggedIn" class="d-flex align-center flex-wrap justify-end">
            <div class="text-white me-4 my-1 hidden-sm-and-down">
              {{ $t("common.header.welcome", { name: username }) }}
            </div>

            <div v-if="isAdmin" class="d-flex align-center flex-wrap">
              <v-tooltip :text="$t('common.header.changePassword')" location="top" theme="dark"
                content-class="text-white">
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="text" color="white" class="my-1 me-2"
                    :to="{ name: RouteName.Password }">
                    <FontAwesomeIcon :icon="faLock" size="lg" />
                  </v-btn>
                </template>
              </v-tooltip>

              <div>
                <v-tooltip :text="$t('common.header.editInfo')" location="top" activator="parent" theme="dark"
                  content-class="text-white"></v-tooltip>
                <v-btn variant="text" color="white" class="my-1 me-2" :to="{ name: RouteName.Profile }">
                  <FontAwesomeIcon :icon="faUser" size="lg" />
                </v-btn>
              </div>
            </div>

            <v-tooltip :text="$t('common.header.support')" location="top" theme="dark" content-class="text-white">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" color="white" class="my-1 me-2"
                  href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank">
                  <FontAwesomeIcon :icon="faComments" size="lg" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="$t('common.header.documentation')" location="top" theme="dark" content-class="text-white">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" color="white" class="my-1 me-2"
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#AccederAuxLN" target="_blank">
                  <FontAwesomeIcon :icon="faCircleQuestion" size="lg" />
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="$t('common.header.logout')" location="top" theme="dark" content-class="text-white">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" color="white" class="my-1" @click="authStore.logout()">
                  <FontAwesomeIcon :icon="faRightFromBracket" size="lg" />
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useUiStore } from "@/composables/store/useUiStore";
import { RouteName } from "@/router";
import {
  faCircleQuestion,
  faComments,
  faLock,
  faRightFromBracket,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";

const authStore = useAuthStore();
const uiStore = useUiStore();
const { smAndDown } = useDisplay();
const { isLoggedIn, isAdmin, userInstitutionName: username } = storeToRefs(authStore);
const { isDark } = storeToRefs(uiStore);

</script>

<style scoped>
.header-graphic {
  max-width: 420px;
}
</style>
