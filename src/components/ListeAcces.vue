<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div>
          <v-data-table
              :headers="listeAccesHeaders"
              :items="listeAccesItems2"
              item-key="name"
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
          >
            <template v-slot:top>
              <v-text-field
                  v-model="search"
                  label="Search (UPPER CASE ONLY)"
                  class="mx-4"
              ></v-text-field>
            </template>
            <template v-slot:body.append>
              <tr>
                <td></td>
                <td>
                  <v-text-field
                      v-model="calories"
                      type="number"
                      label="Less than"
                  ></v-text-field>
                </td>
                <td colspan="4"></td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import ListeAccesService from "../services/liste.acces.service";



export default {
  name: "liste-acces",

  data () {
    return {
      search: '',
      resRequete:'',
      listeAccesItems2:'',
      //listeAccesItems2:[{"datecreation":"103045", "datemodif":"103045","tipeip":"ipv4"},{"datecreation":"103045", "datemodif":"103045","tipeip":"ipv4"}],
      calories: '',
      listeAccesItems: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    }
  },
  computed: {
    listeAccesHeaders () {
      return [
        {
          text: "Date de création",
          align: 'start',
          sortable: false,
          value: 'dateCreation',
        },
        { text: "Type d'accès", value: 'typeAcces'},
        { text: "Type d'IP", value: 'typeIp' },
        { text: "Valeur", value: 'valeur' },
        { text: "Statut", value: 'statut' },
        { text: "Action", value: '' },
      ]
    },
  },
  //sorte de constructeur, mettre ce qu'on veut qui soit fait au début
  mounted: {


  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    filterOnlyCapsText (value, search, item) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
    },
    getListeIp(){
      this.resRequete = '';
      this.dateCreation = '';
      this.dateModification = '';
      this.typeAcces = '';
      this.typeIp = '';
      this.valeur = '';
      this.statut = '';
      ListeAccesService.getListeIp()
          .then(response => {
            //this.resRequete = response.data;
            this.listeAccesItems2 = [{"datecreation":"103045", "datemodif":"103045","tipeip":"ipv4"},{"datecreation":"103045", "datemodif":"103045","tipeip":"ipv4"}];
          })
          .catch(() => {
            this.resRequete = 'Erreur requete ip';
          });
    }
  },
}
</script>
