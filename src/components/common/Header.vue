<template>
  <v-app-bar color="primary" :height="smAndDown ? 174 : 134">
    <v-container fluid class="pa-0">
      <v-row class="align-center" no-gutters>
        <v-btn variant="text" class="h-100" aria-label="Accueil Licences nationales" @click="goHome">
          <v-img alt="Logo licences nationales" src="logo.svg" height="90" width="260" contain />
        </v-btn>

        <v-img alt="Illustration licences nationales" src="/header/graphe-couleur-appli-ln.png" height="90"
          class="hidden-sm-and-down" cover />
      </v-row>

      <v-row class="align-center bg-secondary px-4" no-gutters>
        <v-col cols="12" md="3">
          <div class="d-flex align-center flex-wrap justify-space-between justify-md-start">
            <v-switch class="theme-selector" density="compact" inset hide-details :model-value="isDark"
              @update:model-value="toggleTheme">
              <template #label>
                <p class="text-white text-subtitle-2">Thème sombre</p>
              </template>
            </v-switch>
            <div v-if="isLoggedIn" class="text-white me-4 my-1 hidden-md-and-up">
              Bienvenue {{ loggedInUsername }}
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="9">
          <div v-if="isLoggedIn" class="d-flex align-center flex-wrap justify-end">
            <div class="text-white me-4 my-1 hidden-sm-and-down">
              Bienvenue {{ loggedInUsername }}
            </div>

            <div v-if="isAdmin" class="d-flex align-center flex-wrap">
              <v-tooltip
                location="top"
                :theme="isDark ? 'dark' : 'light'"
                :content-class="isDark ? 'text-white' : 'text-black'"
              >
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="text" color="white" class="my-1 me-2"
                    @click="allerAModifierMotDePasse">
                    <FontAwesomeIcon :icon="faLock" size="lg" />
                  </v-btn>
                </template>
                <span>Modifier mot de passe</span>
              </v-tooltip>

              <div>
                <v-tooltip
                  text="Modifier les infos"
                  location="top"
                  activator="parent"
                  :theme="isDark ? 'dark' : 'light'"
                  :content-class="isDark ? 'text-white' : 'text-black'"
                ></v-tooltip>
                <v-btn variant="text" color="white" class="my-1 me-2" @click="allerAModifierProfil">
                  <FontAwesomeIcon :icon="faUser" size="lg" />
                </v-btn>
              </div>
            </div>

            <v-tooltip
              location="top"
              :theme="isDark ? 'dark' : 'light'"
              :content-class="isDark ? 'text-white' : 'text-black'"
            >
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" color="white" class="my-1 me-2"
                  href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank">
                  <FontAwesomeIcon :icon="faComments" size="lg" />
                </v-btn>
              </template>
              <span>Assistance</span>
            </v-tooltip>

            <v-tooltip
              location="top"
              :theme="isDark ? 'dark' : 'light'"
              :content-class="isDark ? 'text-white' : 'text-black'"
            >
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" color="white" class="my-1 me-2"
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#AccederAuxLN" target="_blank">
                  <FontAwesomeIcon :icon="faCircleQuestion" size="lg" />
                </v-btn>
              </template>
              <span>Documentation</span>
            </v-tooltip>

            <v-tooltip
              location="top"
              :theme="isDark ? 'dark' : 'light'"
              :content-class="isDark ? 'text-white' : 'text-black'"
            >
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text" color="white" class="my-1" @click="seDeconnecter">
                  <FontAwesomeIcon :icon="faRightFromBracket" size="lg" />
                </v-btn>
              </template>
              <span>Se déconnecter</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useDisplay } from 'vuetify'

import {
  faLock,
  faUser,
  faRightFromBracket,
  faComments,
  faCircleQuestion
} from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();
const { smAndDown } = useDisplay()

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);
const loggedInUsername = computed(() => authStore.userEtab);
const isDark = computed(() => uiStore.isDark);


function toggleTheme() {
  uiStore.toggleTheme();
}

function allerAModifierMotDePasse() {
  router.push({ name: "Password" });
}

function allerAModifierProfil() {
  router.push({ name: "Profil" });
}

function goHome() {
  router.push({ name: "Home" });
}

function seDeconnecter() {
  authStore.logout();
}
</script>

<style scoped>
.header-graphic {
  max-width: 420px;
}
</style>
