<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

</script>

<template>
  <v-card>
    <v-card-text class="fondGris pa-0">
      <v-row>
        <v-col cols="1">
          <FontAwesomeIcon
            class="ma-4"
            :icon="['fas', 'info-circle']"
            size="3x"
            :style="{ color: '#478dcb' }"
        /></v-col>
        <v-col cols="6">
          <v-list-item>
              <v-list-item-title class="pb-2"
                ><span class="dot"></span>
                <a
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#StatutsEtProcessusDeValidationDesIP:CgILNaqqg4eJrTC78srR8c"
                  target="_blank"
                  >En savoir plus sur les délais d'ouverture des accès</a
                ></v-list-item-title
              >
              <v-list-item-title
                ><span class="dot"></span>
                <a
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#StatutsEtProcessusDeValidationDesIP"
                  target="_blank"
                  >Les différents statuts des IP</a
                ></v-list-item-title
              >
          </v-list-item> </v-col
        ><v-col cols="5">
          <v-list-item>
              <v-list-item-title class="pb-2"
                ><span class="dot"></span>
                <a
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#StatutsEtProcessusDeValidationDesIP:DdxqgVeI57cdWkxUf4O9Vc"
                  target="_blank"
                  >Pourquoi une attestation est parfois demandée ?</a
                ></v-list-item-title
              >
              <v-list-item-title
                ><span class="dot"></span>
                <a
                  href="https://www.licencesnationales.fr/modele_attestation_ip_licences_nationales/"
                  target="_blank"
                  >Télécharger un modèle d'attestation</a
                ></v-list-item-title
              >
          </v-list-item>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>



<style scoped></style>
