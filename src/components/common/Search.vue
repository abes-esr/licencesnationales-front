<template>
  <div>
    <v-container class="pb-0">
      <h1>{{ $t("common.search.title") }}</h1>
    </v-container>

    <v-card flat class="mt-2">
      <v-form ref="searchFormRef" @submit.prevent="search">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text>
              <v-row class="d-flex justify-center align-center">
                <v-col cols="3" class="pb-0">
                  <v-select variant="outlined" :items="domainOptions" item-title="title" item-value="value"
                    v-model="selectedDomain" :placeholder="$t('common.search.domainPlaceholder')" hide-details="auto"
                    persistent-placeholder required :rules="searchDomainRules" />
                </v-col>
                <v-col cols="7" class="pb-0">
                  <v-text-field variant="outlined" :label="$t('common.search.keywordsLabel')"
                    :placeholder="$t('common.search.keywordsPlaceholder')" hide-details="auto" v-model="query" required
                    :rules="searchQueryRules" />
                </v-col>
                <v-col cols="2" class="pb-0">
                  <v-btn type="submit" size="x-large" :loading="loading" :disabled="loading || !selectedDomain">
                    {{ $t("common.search.submit") }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="8" v-if="searched">
          <h3>
            {{ $t("common.search.resultsTitle", { query, domain: selectedOption.title }) }}
          </h3>
          <div>
            <v-list density="compact">
              <div v-for="item in results" :key="item.id">
                <v-list-item v-if="item instanceof Institution" @click="handleInstitutionClick(item)">
                  <v-list-item-title>
                    {{ item.abesId }} - {{ item.siren }} - {{ item.name }} - {{ item.contact?.city }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.contact?.lastName }} {{ item.contact?.firstName }} - {{ item.contact?.email }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-else-if="item instanceof Ip" @click="handleIpClick(item)">
                  <v-list-item-title>{{ item.ip }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.id }} - {{ item.institution.siren }} - {{ item.institution.name }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-else-if="item instanceof Publisher" @click="handlePublisherClick(item)">
                  <v-list-item-title>
                    {{ item.id }} - {{ item.name }} - {{ item.address }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    v-for="contact in item.contacts.filter(contact => contact.type === ContactType.COMMERCIAL)"
                    :key="contact.id">
                    {{ contact.lastName }} {{ contact.firstName }} - {{ contact.email }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-for="contact in item.contacts.filter(contact => contact.type === ContactType.TECHNIQUE)"
                    :key="contact.id">
                    {{ contact.lastName }} {{ contact.firstName }} - {{ contact.email }}
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
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useIpService } from "@/composables/service/useIpService";
import { usePublisherService } from "@/composables/service/usePublisherService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { usePublisherStore } from "@/composables/store/usePublisherStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import Institution from "@/entity/Institution";
import Ip from "@/entity/Ip";
import Publisher from "@/entity/Publisher";
import { ContactType } from "@/entity/PublisherContact";
import { RouteName } from "@/router";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

type SearchDomain = "institutions" | "ips" | "publishers";

const router = useRouter();
const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const publisherStore = usePublisherStore();
const institutionService = useInstitutionService();
const publisherService = usePublisherService();
const ipService = useIpService();
const { t } = useI18n();
const { searchQueryRules, searchDomainRules } = useValidationRules();
const query = ref("");
const selectedDomain = ref<SearchDomain>("institutions");
const results = ref<Array<Institution | Ip | Publisher>>([]);
const searchFormRef = ref<VForm | null>(null);
const { loading, startLoading, stopLoading } = useLoading();
const searched = ref(false)
const snackbar = useSnackbar()
const domainOptions = computed<Array<{ value: SearchDomain, title: string, service: any }>>(() => [
  { value: "institutions", title: t("common.search.domains.institutions"), service: institutionService },
  { value: "ips", title: t("common.search.domains.ips"), service: ipService },
  { value: "publishers", title: t("common.search.domains.publishers"), service: publisherService },
]);

const selectedOption = computed(() => domainOptions.value.find(option => option.value === selectedDomain.value));

const search = async () => {
  const validation = await searchFormRef.value?.validate();
  if (validation && !validation.valid) {
    return;
  }

  try {
    startLoading();
    results.value = [];
    searched.value = false;
    const service = selectedOption.value.service;
    const queryList = query.value.split(" ")
      .map(part => part.trim())
      .filter(Boolean);
    results.value = await service.search(queryList, authStore.token);
    searched.value = true;
  } catch {
    snackbar.error(t("common.search.searchError"));
  } finally {
    stopLoading();
  }
};

const handleInstitutionClick = async (item: Institution) => {
  try {
    await institutionStore.setCurrentInstitution(item);
    router.push({ name: RouteName.InstitutionView });
  } catch {
    snackbar.error(t("common.search.navigationError"));
  }
};

const handleIpClick = async (item: Ip) => {
  try {
    await institutionStore.setCurrentInstitution(item.institution)
    router.push({ name: RouteName.IpList });
  } catch {
    snackbar.error(t("common.search.navigationError"));
  }
};

const handlePublisherClick = async (item: Publisher) => {
  try {
    await publisherStore.setCurrentPublisher(item);
    router.push({ name: RouteName.PublisherEdit });
  } catch {
    snackbar.error("common.search.navigationError");
  }
};
</script>
