<template>
  <v-navigation-drawer
    app
    flat
    hide-overlay
    permanent
    :model-value="displayMenu"
  >
    <v-list dense color="transparent">
      <v-row class="mb-15"> </v-row>

      <v-row class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerATableauDeBord()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faGaugeHigh" size="2x" />
          </v-list-item-action>
            <v-list-item-title>Tableau de bord</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAListeEtabs()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faBuildingColumns" size="2x" />
          </v-list-item-action>
            <v-list-item-title>Liste des établissements</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAListeEditeurs()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faList" size="2x" />
          </v-list-item-action>
            <v-list-item-title>Liste des éditeurs</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAStatitique()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faChartBar" size="2x" />
          </v-list-item-action>
            <v-list-item-title>Statistique de l'application</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAHistorique()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faClockRotateLeft" size="2x" />
          </v-list-item-action>
            <v-list-item-title>Historique des actions</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerRecherche()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faMagnifyingGlass" size="2x" />
          </v-list-item-action>
            <v-list-item-title>Recherche</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="!isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAListeIPs()"
        >
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <v-icon xLarge class="mr-2">mdi-ip-network</v-icon>
          </v-list-item-action>
            <v-list-item-title>Adresse IP</v-list-item-title>
        </v-list-item>
      </v-row>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Logger } from "@/utils/Logger";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBuildingColumns,
  faChartBar,
  faClockRotateLeft,
  faGaugeHigh,
  faList,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

// Props
defineProps<{
  displayMenu: boolean;
  isAdmin: boolean;
}>();

// Router
const router = useRouter();

// Navigation helpers
function allerAListeEditeurs() {
  router.push({ name: "ListeEditeurs" }).catch(err => Logger.error(err));
}

function allerAListeEtabs() {
  router.push({ name: "ListeEtab" }).catch(err => Logger.error(err));
}

function allerATableauDeBord() {
  router.push({ name: "Home" }).catch(err => Logger.error(err));
}

function allerAStatitique() {
  router.push({ name: "Statistiques" }).catch(err => Logger.error(err));
}

function allerAHistorique() {
  router.push({ name: "Historique" }).catch(err => Logger.error(err));
}

function allerRecherche() {
  router.push({ name: "Recherche" }).catch(err => Logger.error(err));
}

function allerAListeIPs() {
  router.push({ name: "ListeIP" }).catch(err => Logger.error(err));
}
</script>
<style scoped lang="scss">
  .v-navigation-drawer {
    width: 80px !important;
    height: auto !important;
    position: unset !important;
    top: unset !important;
    left: unset !important;
    bottom: unset !important;
    right: unset !important;
    transform: unset !important;
  }
</style>
