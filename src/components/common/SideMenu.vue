<template>
  <v-navigation-drawer app flat hide-overlay permanent :model-value="displayMenu">
    <v-list dense color="transparent">
      <v-row class="mb-15"> </v-row>

      <v-row class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToDashboard()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faGaugeHigh" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.dashboard") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToInstitutions()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faBuildingColumns" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.institutions") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToPublishers()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faList" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.publishers") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToStatistics()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faChartBar" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.statistics") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToHistory()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faClockRotateLeft" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.history") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToSearch()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faMagnifyingGlass" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.search") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="!isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" v-on:click="goToIpList()">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <v-icon xLarge class="mr-2">mdi-ip-network</v-icon>
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.ip") }}</v-list-item-title>
        </v-list-item>
      </v-row>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBuildingColumns,
  faChartBar,
  faClockRotateLeft,
  faGaugeHigh,
  faList,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router";

defineProps<{
  displayMenu: boolean;
  isAdmin: boolean;
}>();

const router = useRouter();

function goToPublishers() {
  router.push({ name: RouteName.Publishers }).catch(err => Logger.error(err));
}

function goToInstitutions() {
  router.push({ name: RouteName.Institutions }).catch(err => Logger.error(err));
}

function goToDashboard() {
  router.push({ name: RouteName.Home }).catch(err => Logger.error(err));
}

function goToStatistics() {
  router.push({ name: RouteName.Statistics }).catch(err => Logger.error(err));
}

function goToHistory() {
  router.push({ name: RouteName.History }).catch(err => Logger.error(err));
}

function goToSearch() {
  router.push({ name: RouteName.Search }).catch(err => Logger.error(err));
}

function goToIpList() {
  router.push({ name: RouteName.IpList }).catch(err => Logger.error(err));
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
