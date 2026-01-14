<template>
  <div>
    <v-container class="pb-0">
      <h1>{{ $t("institution.history.title") }}</h1>
      <v-alert v-if="message" type="error" density="compact" class="mt-2">
        {{ message }}
      </v-alert>
    </v-container>

    <v-card variant="flat" class="mt-2">
      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="10">
          <v-card-text class="fondGris">
            <v-autocomplete v-model="selectedSiren" :items="institutions" item-title="name" item-value="siren"
              :label="$t('institution.history.institutionLabel')"
              :placeholder="$t('institution.history.institutionPlaceholder')" persistent-placeholder variant="outlined"
              density="comfortable" @update:model-value="loadHistory" />
          </v-card-text>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="10">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="institutions">{{ $t("institution.history.tabs.institutions") }}</v-tab>
            <v-tab value="ips">{{ $t("institution.history.tabs.ips") }}</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4">
            <v-window-item value="institutions">
              <v-table density="comfortable">
                <thead>
                  <tr class="bg-primary">
                    <th class="text-left" scope="col">{{ $t("institution.history.table.date") }}</th>
                    <th class="text-left" scope="col">{{ $t("institution.history.table.action") }}</th>
                    <th class="text-left" scope="col">{{ $t("institution.history.table.information") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in institutionHistory" :key="item.date">
                    <td>{{ item.date }}</td>
                    <td>{{ item.event }}</td>
                    <td>
                      <span v-for="(value, name) in item" :key="name">
                        <span v-if="value !== null && name != 'event' && name != 'date' && name != 'siren'">
                          {{ name }} : {{ value }},&nbsp;
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="ips">
              <v-table density="comfortable">
                <thead>
                  <tr>
                    <th class="text-left bg-primary" scope="col">{{ $t("institution.history.table.date") }}</th>
                    <th class="text-left bg-primary" scope="col">{{ $t("institution.history.table.action") }}</th>
                    <th class="text-left bg-primary" scope="col">{{ $t("institution.history.table.information") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in ipHistory" :key="item.date">
                    <td>{{ item.date }}</td>
                    <td>{{ item.event }}</td>
                    <td>
                      <span v-for="(value, name) in item" :key="name">
                        <span v-if="value !== null && name != 'event' && name != 'date'">
                          {{ name }} : {{ value }},&nbsp;
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useIpService } from "@/composables/service/useIpService";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionService = useInstitutionService();
const ipService = useIpService();

const institutions = ref<Array<Institution>>([]);
const message = ref("");
const selectedSiren = ref<string>("");
const institutionHistory = ref<Array<any>>([]);
const ipHistory = ref<Array<any>>([]);
const activeTab = ref<"institutions" | "ips">("institutions");

onMounted(() => {
  loadInstitutions();
});

const loadInstitutions = async () => {
  try {
    institutions.value = await institutionService.getInstitutions(authStore.getToken);
  } catch (err: any) {
    snackbar.error(err);
  }
};

const loadHistory = async (siren: string) => {
  if (!siren) {
    institutionHistory.value = [];
    ipHistory.value = [];
    return;
  }

  try {
    const [institutionResponse, ipResponse] = await Promise.all([
      institutionService.getHistory(siren, authStore.getToken),
      ipService.getHistory(siren, authStore.getToken)
    ]);
    institutionHistory.value = institutionResponse.data;
    ipHistory.value = ipResponse.data;
  } catch (err: any) {
    snackbar.error(err);
  }
};
</script>




