<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Ajout Acces</p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>

<!--        <select v-model="acces.statut" class="form-control col-md-5 mb-3" required>
          <option disabled value="">-&#45;&#45; STATUT -&#45;&#45;</option>
          <option v-for="data in choix_statut" :value="data.id">{{data.name}}</option>
        </select>-->

        <v-select
            v-model="acces.statut"
            :items="choix_statut"
            label="Statut"
        ></v-select>

        <v-select
            v-model="acces.typeIp"
            :items="choix_ip"
            :rules="[(v) => !!v || 'Le type de l\'Ip est requis']"
            label="Type d'IP"
            required
        ></v-select>

        <v-text-field
            v-model="acces.valeur"
            :rules="[(v) => !!v || 'La valeur de l\'Ip est requise']"
            label="Valeur"
            required
        ></v-text-field>

        <v-textarea
            v-model="acces.commentaires"
            outlined
            name="input-7-4"
            label="Commentaires"
            value="Si certaines des adresses renseignées ne font pas partie du réseau RENATER, nous vous invitons à le préciser."
        ></v-textarea>

        <v-text-field
            v-model="acces.description"
            :rules="[(v) => !!v || 'Description is required']"
            label="Description"
            required
        ></v-text-field>

        <v-text-field
            v-model="acces.title"
            :rules="[(v) => !!v || 'Title is required']"
            label="Title"
            required
        ></v-text-field>

        <v-text-field
            v-model="acces.description"
            :rules="[(v) => !!v || 'Description is required']"
            label="Description"
            required
        ></v-text-field>
      </v-form>

      <v-card-subtitle>
        Cliquer sur le bouton pour ajouter un nouvel Acces.
      </v-card-subtitle>

      <v-card-actions>
        <v-btn color="success" @click="newAcces">Ajouter</v-btn>
      </v-card-actions>

      <v-btn color="primary" class="mt-3" @click="saveAcces">Créer</v-btn>
      <v-btn color="primary" class="mt-3" @click="reset">Annuler</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title>
          Submitted successfully!
        </v-card-title>

        <v-card-subtitle>
          Cliquer sur le bouton pour ajouter un nouvel Acces.
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newAcces">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import AccesDataService from "../services/AccesDataService";

export default {
  name: "add-acces",
  data() {
    return {
      choix_statut: [ 'En saisie','Validation','Validé','Refusé'],
      choix_ip: [ 'IPV4','IPV6'],
      acces: {
        id: null,
        title: "",
        description: "",
        published: false,
      },
      submitted: false,
    };
  },
  methods: {
    saveAcces() {
      var data = {
        title: this.acces.title,
        description: this.acces.description,
      };

      AccesDataService.create(data)
          .then((response) => {
            this.acces.id = response.data.id;
            console.log(response.data);
            this.submitted = true;
          })
          .catch((e) => {
            console.log(e);
          });
    },

    newAcces() {
      this.submitted = false;
      this.acces = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
}
</style>
