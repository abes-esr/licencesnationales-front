<template>
  <div>
    <v-container variant="flat">
      <h1>{{ $t("institution.stats.title") }}</h1>
      <v-alert v-if="message" type="error" density="compact" class="mt-4">
        {{ message }}
      </v-alert>

      <h2 class="mt-6">
        {{ $t("institution.stats.periodTitle") }}
      </h2>

      <v-form ref="formRef" class="mt-4">
        <v-row>
          <v-col cols="12" sm="4" md="3" lg="2">
            <v-menu v-model="isStartDateMenuOpen" :close-on-content-click="false" transition="scale-transition"
              offset-y>
              <template #activator="{ props }">
                <v-text-field v-bind="props" ref="startDateRef" v-model="formattedStartDate"
                  :label="$t('institution.stats.startDate')" prepend-icon="mdi-calendar" :rules="dateRules" readonly
                  variant="outlined" />
              </template>
              <v-date-picker v-model="startDate" :show-current="false" color="primary"
                @update:model-value="isStartDateMenuOpen = false">
                <template #actions>
                  <v-btn variant="outlined" @click="isStartDateMenuOpen = false">
                    {{ $t("institution.stats.cancel") }}
                  </v-btn>
                </template>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="4" md="3" lg="2">
            <v-menu v-model="isEndDateMenuOpen" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template #activator="{ props }">
                <v-text-field v-bind="props" ref="endDateRef" v-model="formattedEndDate"
                  :label="$t('institution.stats.endDate')" prepend-icon="mdi-calendar" :rules="dateRules" readonly
                  variant="outlined" />
              </template>
              <v-date-picker v-model="endDate" :show-current="false" color="primary"
                @update:model-value="isEndDateMenuOpen = false">
                <template #actions>
                  <v-btn variant="outlined" @click="isEndDateMenuOpen = false">
                    {{ $t("institution.stats.cancel") }}
                  </v-btn>
                </template>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" sm="4" md="2">
            <v-btn class="mt-2" @click="getStats">
              {{ $t("institution.stats.validate") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-card v-if="institutionStats.length > 0" class="mt-4 pa-4">
        <v-row>
          <h3>
            {{ $t("institution.stats.resultsTitle", { start: formattedStartDate, end: formattedEndDate }) }}
          </h3>
        </v-row>
        <v-row class="mt-2">
          <v-list subheader class="mr-4">
            <v-subheader>{{ $t("institution.stats.institutions") }}</v-subheader>
            <v-list-item v-for="item in institutionStats" :key="item.index">
              <div v-for="(value, name) in item" :key="name">
                {{ name }} : {{ value }}
              </div>
            </v-list-item>
            <v-divider />
          </v-list>
          <v-list subheader>
            <v-subheader>{{ $t("institution.stats.ips") }}</v-subheader>
            <v-list-item v-for="item in ipStats" :key="item.index">
              <div v-for="(value, name) in item" :key="name">
                {{ name }} : {{ value }}
              </div>
            </v-list-item>
          </v-list>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useIpService } from "@/composables/service/useIpService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useSnackbar } from "@/composables/useSnackbar";
import { useValidationRules } from "@/composables/useValidationRules";
import moment from "moment";
import { computed, ref } from "vue";
import { VDatePicker } from "vuetify/components";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionService = useInstitutionService();
const ipService = useIpService();

const { dateRules } = useValidationRules();
const message = ref("");
const institutionStats = ref<Array<any>>([]);
const ipStats = ref<Array<any>>([]);
const startDate = ref<string>("");
const endDate = ref<string>("");
const isStartDateMenuOpen = ref(false);
const isEndDateMenuOpen = ref(false);
const formRef = ref();
const startDateRef = ref();
const endDateRef = ref();

const formattedStartDate = computed({
  get: () => (startDate.value ? moment(startDate.value).format("DD-MM-YYYY") : ""),
  set: value => {
    startDate.value = value ? moment(value, "DD-MM-YYYY").format("YYYY-MM-DD") : "";
  },
});

const formattedEndDate = computed({
  get: () => (endDate.value ? moment(endDate.value).format("DD-MM-YYYY") : ""),
  set: value => {
    endDate.value = value ? moment(value, "DD-MM-YYYY").format("YYYY-MM-DD") : "";
  },
});

async function getStats() {
  const validation = await formRef.value?.validate();
  const isValid = typeof validation === "boolean" ? validation : validation?.valid;

  if (!isValid) {
    return;
  }

  try {
    const institutionsResponse = await institutionService.getStats(
      formattedStartDate.value,
      formattedEndDate.value,
      authStore.token
    );
    institutionStats.value = institutionsResponse.data.stats;

    const ipResponse = await ipService.getStats(
      formattedStartDate.value,
      formattedEndDate.value,
      authStore.token
    );
    ipStats.value = ipResponse.data.stats;
  } catch (err: any) {
    snackbar.error(err);
  }
}
</script>
