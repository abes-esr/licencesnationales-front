<template>
  <div>
    <h1>{{ $t("institution.card.title", { name: institution.nom }) }}</h1>
    <v-col cols="12" class="d-flex align-content-start justify-space-between flex-wrap mx-0 px-0 py-0">
      <v-card-title class="px-0">
        {{ $t("institution.card.accountInfo") }}
        <v-tooltip :text="$t('institution.card.exportAccountInfo')" location="top" open-delay="100" theme="dark"
          content-class="text-white">
          <template #activator="{ props }">
            <v-btn icon class="bouton-simple" v-bind="props" :loading="isExportLoading" @click="downloadInstitution">
              <FontAwesomeIcon :icon="faDownload" class="mx-2 fa-lg" />
            </v-btn>
          </template>
        </v-tooltip>
      </v-card-title>

      <v-btn variant="tonal" class="mt-3" :to="{ name: RouteName.IpList }">
        {{ $t("institution.card.viewIpList") }}
        <v-icon class="ml-2">mdi-ip-network</v-icon>
      </v-btn>
    </v-col>
    <span class="d-block">
      {{ $t("institution.card.accountCreatedOn") }}
      {{ institution.dateCreation.toLocaleDateString() }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { RouteName } from "@/router";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  institution: Institution;
}>();

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionService = useInstitutionService();
const { loading: isExportLoading, startLoading, stopLoading } = useLoading();

const downloadInstitution = () => {
  startLoading();
  const siren = [props.institution.siren];
  institutionService
    .downloadInstitutions(siren, authStore.user.token)
    .then(response => {
      const fileURL = URL.createObjectURL(
        new Blob([response.data], { type: "application/csv" })
      );
      const fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "export.csv");
      document.body.appendChild(fileLink);

      fileLink.click();
      stopLoading();
    })
    .catch(err => {
      snackbar.error(err);
      stopLoading();
    });
};
</script>




