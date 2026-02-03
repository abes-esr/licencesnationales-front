<template>
  <v-navigation-drawer app flat hide-overlay permanent :model-value="isLoggedIn">
    <v-list dense color="transparent">
      <v-row class="mb-15"> </v-row>

      <v-row class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" :to="{ name: RouteName.Home }">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faGaugeHigh" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.dashboard") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot"
          :to="{ name: RouteName.Institutions }">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faBuildingColumns" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.institutions") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot"
          :to="{ name: RouteName.Publishers }">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faList" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.publishers") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot"
          :to="{ name: RouteName.Statistics }">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faChartBar" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.statistics") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" :to="{ name: RouteName.History }">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faClockRotateLeft" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.history") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" :to="{ name: RouteName.Search }">
          <v-list-item-action class="ma-0 pa-1 justify-center">
            <FontAwesomeIcon :icon="faMagnifyingGlass" size="2x" />
          </v-list-item-action>
          <v-list-item-title>{{ $t("common.sideMenu.search") }}</v-list-item-title>
        </v-list-item>
      </v-row>

      <v-row v-if="!isAdmin" class="mb-5">
        <v-list-item class="d-flex align-center justify-center flex-column menu-slot" :to="{ name: RouteName.IpList }">
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
import { useAuthStore } from "@/composables/store/useAuthStore";
import { RouteName } from "@/router";
import {
  faBuildingColumns,
  faChartBar,
  faClockRotateLeft,
  faGaugeHigh,
  faList,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { isAdmin, isLoggedIn } = storeToRefs(authStore);
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

.menu-slot {
  color: inherit !important
}
</style>
