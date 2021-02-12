<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="valeur" label="Recherche par valeur"></v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <v-btn small @click="rechercheParValeur">
        Search
      </v-btn>
    </v-col>

    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Liste des Accès</v-card-title>

        <v-data-table
            :headers="headers"
            :items="acces"
            disable-pagination
            :hide-default-footer="true"
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon small class="mr-2" @click="modifierAcces(item.id)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" @click="analyserAcces(item.id)">mdi-help-circle-outline</v-icon>
            <v-icon small @click="supprimerAcces(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-card-actions v-if="acces.length > 0">
          <v-btn small color="error" @click="suppTousAcces">
            Supprimer tous les accès
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AccesDataService from "../services/AccesDataService";
export default {
  name: "acces-list",
  data() {
    return {
      acces: [],
      title: "",
      headers: [
        { text: "Date de création", align: "start", value: "dateCreation", sortable: false },
        { text: "Date de modification", value: "dateModif", sortable: false },
        { text: "Type d'accès", value: "typeAcces", sortable: false },
        { text: "Type d'IP", value: "typeIp", sortable: false },
        { text: "Valeur", value: "valeur", sortable: false  },
        { text: "Statut", value: "statut", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
    };
  },
  methods: {
    collecterAcces() {
      AccesDataService.getAll()
          .then((response) => {
            this.acces = response.data.map(this.affichageAcces);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    refreshList() {
      this.collecterAcces();
    },

    suppTousAcces() {
      AccesDataService.deleteAll()
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    },

    rechercheParValeur() {
      AccesDataService.findByValeur(this.valeur)
          .then((response) => {
            this.acces = response.data.map(this.affichageAcces);
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    modifierAcces(id) {
      this.$router.push({ name: "acces-details", params: { id: id } });
    },

    analyserAcces(id) {
      this.$router.push({ name: "acces-analyse", params: { id: id } });
    },

    supprimerAcces(id) {
      AccesDataService.delete(id)
          .then(() => {
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    },

    affichageAcces(acces) {
      return {
        id: acces.id,
        dateCreation: acces.dateCreation,
        dateModification: acces.dateModification,
        typeAcces: acces.typeAcces,
        typeIp: acces.typeIp,
        valeur: acces.valeur,
        statut: acces.statut ? "Published" : "Pending",

      };
    },
  },
  mounted() {
    this.collecterAcces();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
