<template>
  <div>
    <v-container class="pb-0">
      <h1>{{ $t("institution.history.title") }}</h1>
      <v-alert v-if="message" type="error" density="compact" class="mt-2">
        {{ message }}
      </v-alert>
    </v-container>

    <v-card variant="flat" class="mt-2">
      <v-form ref="searchFormRef" class="mt-2">
        <v-row>
          <v-col cols="1" class="d-none d-md-flex"></v-col>
          <v-col cols="12" md="10">
            <v-card-text class="fondGris">
              <v-autocomplete
                v-model="selectedSiren"
                :items="etabs"
                item-title="nom"
                item-value="siren"
                :label="$t('institution.history.institutionLabel')"
                :placeholder="$t('institution.history.institutionPlaceholder')"
                persistent-placeholder
                variant="outlined"
                density="comfortable"
                @update:model-value="getHistorique"
              />
            </v-card-text>
          </v-col>
        </v-row>
      </v-form>

      <v-row>
        <v-col cols="1" class="d-none d-md-flex"></v-col>
        <v-col cols="12" md="10">
          <v-tabs v-model="tab" color="primary">
            <v-tab value="etabs">{{ $t("institution.history.tabs.institutions") }}</v-tab>
            <v-tab value="ips">{{ $t("institution.history.tabs.ips") }}</v-tab>
          </v-tabs>

          <v-window v-model="tab" class="mt-4">
            <v-window-item value="etabs">
              <v-table density="comfortable">
                <thead>
                  <tr class="bg-primary">
                    <th class="text-left" scope="col">{{ $t("institution.history.table.date") }}</th>
                    <th class="text-left" scope="col">{{ $t("institution.history.table.action") }}</th>
                    <th class="text-left" scope="col">{{ $t("institution.history.table.information") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in etabHisto" :key="item.date">
                    <td>{{ item.date }}</td>
                    <td>{{ item.event }}</td>
                    <td>
                      <span v-for="(value, name) in item" :key="name">
                        <span
                          v-if="value !== null && name != 'event' && name != 'date' && name != 'siren'"
                        >
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
                  <tr v-for="item in ipHisto" :key="item.date">
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
import { useEtablissementService } from "@/composables/useEtablissementService";
import { useIpService } from "@/composables/useIpService";
import { useSnackbar } from "@/composables/useSnackbar";
import Etablissement from "@/core/Etablissement";
import { useAuthStore } from "@/stores/authStore";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const etablissementService = useEtablissementService();
const iPService = useIpService();

const etabs = ref<Array<Etablissement>>([]);
const message = ref("");
const selectedSiren = ref<string>("");
const etabHisto = ref<Array<any>>([]);
const ipHisto = ref<Array<any>>([]);
const tab = ref<"etabs" | "ips">("etabs");
const searchFormRef = ref();

onMounted(() => {
  collecterEtab();
});

function collecterEtab() {
  snackbar.hide();
  etablissementService
    .getEtablissements(authStore.getToken)
    .then(response => {
      etabs.value = response;
    })
    .catch(err => {
      snackbar.error(err);
    });
}

function getHistorique(siren: string) {
  if (!siren) {
    etabHisto.value = [];
    ipHisto.value = [];
    return;
  }

  etablissementService
    .getHisto(siren, authStore.getToken)
    .then(response => {
      etabHisto.value = response.data;
    })
    .catch(err => {
      snackbar.error(err);
    });

  iPService
    .getHisto(siren, authStore.getToken)
    .then(response => {
      ipHisto.value = response.data;
    })
    .catch(err => {
      snackbar.error(err);
    });
}
</script>
