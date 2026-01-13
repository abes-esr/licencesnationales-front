<template>
  <div>
    <v-container class="pb-0">
      <h1>{{ $t("common.search.title") }}</h1>
      <v-alert :model-value="Boolean(message)" density="compact" type="error" class="mt-2">
        {{ message }}
      </v-alert>
    </v-container>

    <v-card flat class="mt-2">
      <v-form ref="searchForm">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text>
              <v-row class="d-flex justify-center align-center">
                <v-col cols="2" class="pb-0">
                  <v-select
                    variant="outlined"
                    :items="domainOptions"
                    item-title="title"
                    item-value="value"
                    v-model="domaine"
                    :placeholder="$t('common.search.domainPlaceholder')"
                    hide-details="auto"
                    persistent-placeholder
                    required
                    :rules="rulesForm.selectSearchRules"
                  />
                </v-col>
                <v-col cols="9" class="pb-0">
                  <v-text-field
                    variant="outlined"
                    :label="$t('common.search.keywordsLabel')"
                    :placeholder="$t('common.search.keywordsPlaceholder')"
                    hide-details="auto"
                    v-model="criteres"
                    required
                    :rules="rulesForm.searchRules"
                    @keyup.enter="search"
                  />
                </v-col>
                <v-col class="pb-0">
                  <v-btn @click="search" :loading="buttonLoading">{{ $t("common.search.submit") }}</v-btn>
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
          <h3>{{ $t("common.search.resultsTitle", { criteria: criteres, domain: selectedDomainLabel }) }}</h3>
          <br />
          <div v-if="domaineValide === 'ips'">
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
          <div v-if="domaineValide === 'institutions'">
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
          <div v-if="domaineValide === 'publishers'">
            <v-list density="compact">
              <div v-for="item in resultats" :key="item.id">
                <v-list-item @click="clickEditeur(item)">
                  <v-list-item-title>
                    {{ item.idEditeur }} - {{ item.nom }} - {{ item.adresse }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-for="contactCommerciaux in item.contactsCommerciaux" :key="contactCommerciaux.id">
                    {{ contactCommerciaux.nom }} {{ contactCommerciaux.prenom }} - {{ contactCommerciaux.mail }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-for="contactTechnique in item.contactsTechniques" :key="contactTechnique.id">
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
import { useEditeurService } from "@/composables/useEditeurService";
import { useEtablissementService } from "@/composables/useEtablissementService";
import { useIpService } from "@/composables/useIpService";
import { rulesForm } from "@/core/RulesForm";
import { RouteName } from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { useEditeurStore } from "@/stores/editeurStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const etablissementStore = useEtablissementStore();
const editeurStore = useEditeurStore();
const etablissementService = useEtablissementService();
const editeurService = useEditeurService();
const iPService = useIpService();
const { t } = useI18n();

const criteres = ref("");
const domaine = ref("");
const domaineValide = ref("");
const resultats = ref<any[]>([]);
const message = ref("");
const afficheResultat = ref(false);
const buttonLoading = ref(false);
const searchForm = ref<VForm | null>(null);

const domainOptions = computed(() => [
  { value: "institutions", title: t("common.search.domains.institutions") },
  { value: "ips", title: t("common.search.domains.ips") },
  { value: "publishers", title: t("common.search.domains.publishers") },
]);

const selectedDomainLabel = computed(() => {
  const labels = {
    institutions: t("common.search.domains.institutions"),
    ips: t("common.search.domains.ips"),
    publishers: t("common.search.domains.publishers"),
  } as Record<string, string>;

  return labels[domaineValide.value] ?? domaineValide.value;
});

const search = async () => {
  const validation = await searchForm.value?.validate();
  if (validation && !validation.valid) {
    return;
  }

  const listeCriteres: Array<string> = criteres.value.split(" ");
  domaineValide.value = domaine.value;

  let service;
  switch (domaineValide.value) {
    case "institutions":
      service = etablissementService;
      break;
    case "ips":
      service = iPService;
      break;
    case "publishers":
      service = editeurService;
      break;
    default:
      message.value = t("common.search.domainRequired");
      return;
  }

  buttonLoading.value = true;
  resultats.value = [];

  try {
    const res = await service.search(listeCriteres, authStore.getToken);
    afficheResultat.value = true;
    resultats.value = res.data;
  } catch (err: any) {
    message.value = err?.data?.message ?? t("common.search.searchError");
    window.scrollTo(0, 0);
  } finally {
    buttonLoading.value = false;
  }
};

const clickEtab = async (item: any) => {
  try {
    await etablissementStore.setCurrentEtablissement(item);
    router.push({ name: RouteName.InstitutionView });
  } catch (err: any) {
    message.value = err?.data?.message ?? t("common.search.navigationError");
    window.scrollTo(0, 0);
  }
};

const clickIP = async (item: any) => {
  try {
    await etablissementStore.setCurrentEtablissement(item);
    router.push({ name: RouteName.IpList });
  } catch (err: any) {
    message.value = err?.data?.message ?? t("common.search.navigationError");
    window.scrollTo(0, 0);
  }
};

const clickEditeur = async (item: any) => {
  try {
    await editeurStore.setCurrentEditeur(item);
    router.push({ name: RouteName.PublisherEdit });
  } catch (err: any) {
    message.value = err?.data?.message ?? t("common.search.navigationError");
    window.scrollTo(0, 0);
  }
};
</script>
