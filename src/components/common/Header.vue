<template>
<v-app-bar color="primary" flat id="appBar" height="150">
  <v-img
    class="hidden-sm-and-down"
    src="/header/graphe-couleur-appli-ln.png"
    cover
    style="float:right; height:300%; min-width:60%; max-width:75%; margin:-180px 0 0 0;"
  />


    <v-layout class="d-flex flex-column" fill-height>
      <!-- Logo -->
      <v-container class="justify-start pa-0" style="margin-left:2%; height:100%">
        <v-toolbar-title id="titleBar" @click="goHome">
          <v-img alt="Logo licences nationales" src="logo.svg" max-width="300px" />
        </v-toolbar-title>
      </v-container>

      <!-- Barre icônes -->
      <v-container
        class="d-flex justify-end mainBar ma-0 pa-0 pr-12"
        style="max-height:40px"
      >
        <!-- Thème sombre -->
        <v-container class="pl-8 pt-2 ml-0">
          <v-switch
            dense
            inset
            class="theme-selector"
            :model-value="isDark"
            @update:model-value="toggleTheme"
          >
            <template #label>
              <span style="color:white; font-size:15px">Thème sombre</span>
            </template>
          </v-switch>
        </v-container>

        <!-- Icônes utilisateur -->
        <v-container
          id="barreIcones"
          v-if="isLoggedIn"
          class="d-flex justify-end mainBar ma-0 pa-0 pr-12"
          style="max-height:40px"
        >
          <div class="menu-slot btn-3 d-flex align-center mr-3">
            Bienvenue {{ loggedInUsername }}
          </div>

          <v-divider vertical dark />

          <!-- Admin -->
          <div v-if="isAdmin">
            <!-- Modifier MDP -->
            <v-tooltip top>
              <template #activator="{ props }">
                <v-btn plain @click="allerAModifierMotDePasse" v-bind="props">
                  <FontAwesomeIcon :icon="faLock" size="2x" />
                </v-btn>
              </template>
              <span>Modifier mot de passe</span>
            </v-tooltip>

            <!-- Modifier profil -->
            <v-tooltip top>
              <template #activator="{ props }">
                <v-btn plain @click="allerAModifierProfil" v-bind="props">
                  <FontAwesomeIcon :icon="faUser" size="2x" />
                </v-btn>
              </template>
              <span>Modifier les infos</span>
            </v-tooltip>
          </div>

          <v-divider vertical dark />

          <!-- Assistance -->
          <v-tooltip top>
            <template #activator="{ props }">
              <v-btn
                plain
                href="https://stp.abes.fr/node/3?origine=LicencesNationales"
                target="_blank"
                v-bind="props"
              >
                <FontAwesomeIcon :icon="faComments" size="2x" />
              </v-btn>
            </template>
            <span>Assistance</span>
          </v-tooltip>

          <v-divider vertical dark />

          <!-- Documentation -->
          <v-tooltip top>
            <template #activator="{ props }">
              <v-btn
                plain
                href="https://documentation.abes.fr/aidelicencesnationales/index.html#AccederAuxLN"
                target="_blank"
                v-bind="props"
              >
                <FontAwesomeIcon :icon="faCircleQuestion" size="2x" />
              </v-btn>
            </template>
            <span>Documentation</span>
          </v-tooltip>

          <v-divider vertical dark />

          <!-- Déconnexion -->
          <v-tooltip top>
            <template #activator="{ props }">
              <v-btn plain @click="seDeconnecter" v-bind="props">
                <FontAwesomeIcon :icon="faRightFromBracket" size="2x" />
              </v-btn>
            </template>
            <span>Se déconnecter</span>
          </v-tooltip>
        </v-container>
      </v-container>
    </v-layout>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Import icons manquants !
import {
  faLock,
  faUser,
  faRightFromBracket,
  faComments,
  faCircleQuestion
} from "@fortawesome/free-solid-svg-icons";

// Router
const router = useRouter();

// Stores
const authStore = useAuthStore();
const uiStore = useUiStore();

// Computed
const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);
const loggedInUsername = computed(() => authStore.userEtab);
const isDark = computed(() => uiStore.isDark);

// Actions
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
#barreIcones .v-btn {
  font-size: 0.75rem !important;
}
</style>
