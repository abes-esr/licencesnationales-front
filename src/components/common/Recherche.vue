<template>
  <div>
    <v-card flat>
      <h1>Rechercher dans toute la base</h1>
      <br />
      <v-alert :model-value="Boolean(message)" density="compact" type="error">
        {{ message }}
      </v-alert>

      <v-form ref="searchForm">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text>
              <v-row class="d-flex justify-center align-center">
                <v-col cols="2" class="pb-0">
                  <v-select
                    variant="outlined"
                    :items="listeDomaine"
                    v-model="domaine"
                    placeholder="Domaine de recherche"
                    hide-details="auto"
                    persistent-placeholder
                    required
                    :rules="rulesForm.selectSearchRules"
                  />
                </v-col>
                <v-col cols="9" class="pb-0">
                  <v-text-field
                    variant="outlined"
                    label="Mots clés"
                    placeholder="Mots clés"
                    hide-details="auto"
                    v-model="criteres"
                    required
                    :rules="rulesForm.searchRules"
                    @keyup.enter="search"
                  />
                </v-col>
                <v-col class="pb-0">
                  <v-btn @click="search" :loading="buttonLoading">Rechercher</v-btn>
                </v-col>
              </v-row>
              <br />
            </v-card-text>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="8" v-if="afficheResultat">
          <h3>Résultats pour "{{ criteres }}" dans {{ domaine }} :</h3>
          <br />
          <div v-if="domaineValide === 'IPs'">
            <v-list density="compact">
              <div v-for="item in resultats" :key="item.id">
                <v-list-item @click="clickIP(item)">
                  <v-list-item-title>{{ item.ip }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.idAbes }} - {{ item.siren }} - {{ item.nomEtab }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider />
              </div>
            </v-list>
          </div>
          <div v-if="domaineValide === 'Etablissements'">
            <v-list density="compact">
              <div v-for="item in resultats" :key="item.id">
                <v-list-item @click="clickEtab(item)">
                  <v-list-item-title>
                    {{ item.idAbes }} - {{ item.siren }} - {{ item.nomEtab }} - {{ item.villeContact }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.nomContact }} {{ item.prenomContact }} - {{ item.mailContact }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider />
              </div>
            </v-list>
          </div>
          <div v-if="domaineValide === 'Editeurs'">
            <v-list density="compact">
              <div v-for="item in resultats" :key="item.id">
                <v-list-item @click="clickEditeur(item)">
                  <v-list-item-title>
                    {{ item.idEditeur }} - {{ item.nom }} - {{ item.adresse }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-for="contactCommerciaux in item.contactsCommerciaux"
                    :key="contactCommerciaux.id"
                  >
                    {{ contactCommerciaux.nom }} {{ contactCommerciaux.prenom }} - {{ contactCommerciaux.mail }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-for="contactTechnique in item.contactsTechniques"
                    :key="contactTechnique.id"
                  >
                    {{ contactTechnique.nom }} {{ contactTechnique.prenom }} - {{ contactTechnique.mail }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider />
              </div>
            </v-list>
          </div>
          <br />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { rulesForm } from "@/core/RulesForm";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { useAuthStore } from "@/stores/authStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { useEditeurStore } from "@/stores/editeurStore";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const etablissementStore = useEtablissementStore();
const editeurStore = useEditeurStore();

const criteres = ref("");
const domaine = ref("");
const domaineValide = ref("");
const listeDomaine = ["Etablissements", "IPs", "Editeurs"];
const resultats = ref<any[]>([]);
const message = ref("");
const afficheResultat = ref(false);
const buttonLoading = ref(false);
const searchForm = ref<VForm | null>(null);

const search = async () => {
  const validation = await searchForm.value?.validate();
  if (validation && !validation.valid) {
    return;
  }

  const listeCriteres: Array<string> = criteres.value.split(" ");
  domaineValide.value = domaine.value;

  let service;
  switch (domaineValide.value) {
    case "Etablissements":
      service = etablissementService;
      break;
    case "IPs":
      service = iPService;
      break;
    case "Editeurs":
      service = editeurService;
      break;
    default:
      message.value = "Le domaine de recherche est obligatoire";
      return;
  }

  buttonLoading.value = true;
  resultats.value = [];

  try {
    const res = await service.search(listeCriteres, authStore.getToken);
    afficheResultat.value = true;
    resultats.value = res.data;
  } catch (err: any) {
    message.value = err?.data?.message ?? "Erreur lors de la recherche";
    window.scrollTo(0, 0);
  } finally {
    buttonLoading.value = false;
  }
};

const clickEtab = async (item: any) => {
  try {
    await etablissementStore.setCurrentEtablissement(item);
    router.push({ name: "AfficherEtablissement" });
  } catch (err: any) {
    message.value = err?.data?.message ?? "Erreur lors de la navigation";
    window.scrollTo(0, 0);
  }
};

const clickIP = async (item: any) => {
  try {
    await etablissementStore.setCurrentEtablissement(item);
    router.push({ name: "ListeIP" });
  } catch (err: any) {
    message.value = err?.data?.message ?? "Erreur lors de la navigation";
    window.scrollTo(0, 0);
  }
};

const clickEditeur = async (item: any) => {
  try {
    await editeurStore.setCurrentEditeur(item);
    router.push({ name: "ModifierEditeur" });
  } catch (err: any) {
    message.value = err?.data?.message ?? "Erreur lors de la navigation";
    window.scrollTo(0, 0);
  }
};
</script>
