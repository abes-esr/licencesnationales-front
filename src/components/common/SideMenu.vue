<template>
  <v-navigation-drawer
    v-if="displayMenu"
    width="100px"
    app
    flat
    hide-overlay
    permanent
    :visible="displayMenu"
    height="100%"
  >
    <v-list dense color="transparent">
      <v-row class="mb-15"> </v-row>

      <v-row class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerATableauDeBord()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <font-awesome-icon :icon="['fas', 'tachometer-alt']" size="2x" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tableau de bord</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAListeEtabs()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <font-awesome-icon :icon="['fas', 'university']" size="2x" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Liste des établissements</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAListeEditeurs()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <font-awesome-icon :icon="['fas', 'list']" size="2x" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Liste des éditeurs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAStatitique()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <font-awesome-icon :icon="['fas', 'chart-bar']" size="2x" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Statistique de l'application</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAHistorique()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <font-awesome-icon :icon="['fas', 'history']" size="2x" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Historique des actions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>

      <v-row v-if="isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerRecherche()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <font-awesome-icon :icon="['fas', 'search']" size="2x" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Recherche</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>

      <v-row v-if="!isAdmin" class="mb-5">
        <v-list-item
          class="d-flex align-center justify-center flex-column menu-slot"
          v-on:click="allerAListeIPs()"
        >
          <v-list-item-action class="ma-0 pa-1">
            <v-icon xLarge class="mr-2">mdi-ip-network</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Adresse IP</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-row>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";

@Component
export default class SideMenu extends Vue {
  @Prop() displayMenu!: boolean;
  @Prop() isAdmin!: boolean;

  allerAListeEditeurs(): void {
    this.$router.push({ name: "ListeEditeurs" }).catch(err => {
      Logger.error(err);
    });
  }

  allerAListeEtabs(): void {
    this.$router.push({ name: "ListeEtab" }).catch(err => {
      Logger.error(err);
    });
  }

  allerATableauDeBord(): void {
    this.$router.push({ name: "Home" }).catch(err => {
      Logger.error(err);
    });
  }

  allerAStatitique(): void {
    this.$router.push({ name: "Statistiques" }).catch(err => {
      Logger.error(err);
    });
  }

  allerAHistorique(): void {
    this.$router.push({ name: "Historique" }).catch(err => {
      Logger.error(err);
    });
  }

  allerRecherche(): void {
    this.$router.push({ name: "Recherche" }).catch(err => {
      Logger.error(err);
    });
  }

  allerAListeIPs(): void {
    this.$router.push({ name: "ListeIP" }).catch(err => {
      Logger.error(err);
    });
  }
}
</script>
