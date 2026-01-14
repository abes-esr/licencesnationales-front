<template>
  <div>
    <v-container class="pb-0">
      <h1>{{ $t("common.search.title") }}</h1>
      <v-alert :model-value="Boolean(errorMessage)" density="compact" type="error" class="mt-2">
        {{ errorMessage }}
      </v-alert>
    </v-container>

    <v-card flat class="mt-2">
      <v-form ref="searchFormRef">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text>
              <v-row class="d-flex justify-center align-center">
                <v-col cols="2" class="pb-0">
                  <v-select variant="outlined" :items="domainOptions" item-title="title" item-value="value"
                    v-model="domain" :placeholder="$t('common.search.domainPlaceholder')" hide-details="auto"
                    persistent-placeholder required :rules="searchDomainRules" />
                </v-col>
                <v-col cols="9" class="pb-0">
                  <v-text-field variant="outlined" :label="$t('common.search.keywordsLabel')"
                    :placeholder="$t('common.search.keywordsPlaceholder')" hide-details="auto" v-model="criteria"
                    required :rules="searchCriteriaRules" @keyup.enter="search" />
                </v-col>
                <v-col class="pb-0">
                  <v-btn @click="search" :loading="loading">{{ $t("common.search.submit") }}</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="8" v-if="showResults">
          <h3>
            {{
              $t("common.search.resultsTitle", {
                criteria: criteria,
                domain: domainOptions.find(option => option.value === selectedDomain)?.title || selectedDomain
              })
            }}
          </h3>
          <div v-if="selectedDomain === 'ips'">
            <v-list density="compact">
              <div v-for="item in results" :key="item.id">
                <v-list-item @click="handleIpClick(item)">
                  <v-list-item-title>{{ item.ip }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.idAbes }} - {{ item.siren }} - {{ item.nomEtab }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider />
              </div>
            </v-list>
          </div>
          <div v-if="selectedDomain === 'institutions'">
            <v-list density="compact">
              <div v-for="item in results" :key="item.id">
                <v-list-item @click="handleInstitutionClick(item)">
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
          <div v-if="selectedDomain === 'publishers'">
            <v-list density="compact">
              <div v-for="item in results" :key="item.id">
                <v-list-item @click="handlePublisherClick(item)">
                  <v-list-item-title>
                    {{ item.idEditeur }} - {{ item.nom }} - {{ item.adresse }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-for="contactCommerciaux in item.contactsCommerciaux"
                    :key="contactCommerciaux.id">
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
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useIpService } from "@/composables/service/useIpService";
import { useValidationRules } from "@/composables/useValidationRules";
import { useLoading } from "@/utils/useLoading";
import { RouteName } from "@/router";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { usePublisherStore } from "@/composables/store/usePublisherStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const publisherStore = usePublisherStore();
const institutionService = useInstitutionService();
const publisherService = usePublisherService();
const ipService = useIpService();
const { t } = useI18n();
const { searchCriteriaRules, searchDomainRules } = useValidationRules();

const criteria = ref("");
const domain = ref("");
const selectedDomain = ref("");
const results = ref<any[]>([]);
const errorMessage = ref("");
const showResults = ref(false);
const searchFormRef = ref<VForm | null>(null);
const { loading, startLoading, stopLoading } = useLoading();

const domainOptions = computed(() => [
  { value: "institutions", title: t("common.search.domains.institutions") },
  { value: "ips", title: t("common.search.domains.ips") },
  { value: "publishers", title: t("common.search.domains.publishers") },
]);

const search = async () => {
  const validation = await searchFormRef.value?.validate();
  if (validation && !validation.valid) {
    return;
  }

  const criteriaList = criteria.value.split(" ");
  selectedDomain.value = domain.value;

  let service;
  switch (selectedDomain.value) {
    case "institutions":
      service = institutionService;
      break;
    case "ips":
      service = ipService;
      break;
    case "publishers":
      service = publisherService;
      break;
    default:
      errorMessage.value = t("common.search.domainRequired");
      return;
  }

  startLoading();
  results.value = [];

  try {
    const res = await service.search(criteriaList, authStore.getToken);
    showResults.value = true;
    results.value = res.data;
  } catch (err: any) {
    errorMessage.value = err?.data?.message ?? t("common.search.searchError");
    window.scrollTo(0, 0);
  } finally {
    stopLoading();
  }
};

const handleInstitutionClick = async (item: any) => {
  try {
    await institutionStore.setCurrentInstitution(item);
    router.push({ name: RouteName.InstitutionView });
  } catch (err: any) {
    errorMessage.value = err?.data?.message ?? t("common.search.navigationError");
    window.scrollTo(0, 0);
  }
};

const handleIpClick = async (item: any) => {
  try {
    await institutionStore.setCurrentInstitution(item);
    router.push({ name: RouteName.IpList });
  } catch (err: any) {
    errorMessage.value = err?.data?.message ?? t("common.search.navigationError");
    window.scrollTo(0, 0);
  }
};

const handlePublisherClick = async (item: any) => {
  try {
    await publisherStore.setCurrentPublisher(item);
    router.push({ name: RouteName.PublisherEdit });
  } catch (err: any) {
    errorMessage.value = err?.data?.message ?? t("common.search.navigationError");
    window.scrollTo(0, 0);
  }
};
</script>



