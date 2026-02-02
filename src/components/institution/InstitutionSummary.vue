<template>
  <div>
    <h1>{{ $t("institution.card.title", { name: institution.name }) }}</h1>
    <v-col cols="12" class="d-flex align-content-start justify-space-between flex-wrap mx-0 px-0 py-0">
      <v-card-title class="px-0">
        <v-btn variant="text" class="bouton-simple" @click="downloadInstitution()" :loading="isExportLoading">
          <h2 class="mb-0">{{ $t("institution.card.accountInfo") }}</h2>
          <FontAwesomeIcon :icon="faDownload" size="lg" class="mx-2" />
        </v-btn>
      </v-card-title>

      <v-btn variant="tonal" class="mt-3" :to="{ name: RouteName.IpList }">
        {{ $t("institution.card.viewIpList") }}
        <v-icon class="ml-2">mdi-ip-network</v-icon>
      </v-btn>
    </v-col>
    <span class="d-block">
      {{ $t("institution.card.accountCreatedOn") }}
      {{ institution.createdAt.toLocaleDateString() }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { RouteName } from "@/router";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  institution: Institution;
}>();

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionService = useInstitutionService();
const { loading: isExportLoading, startLoading, stopLoading } = useLoading();

const downloadInstitution = async () => {
  try {
    startLoading();
    const response = await institutionService
      .downloadInstitutions([props.institution.siren], authStore.user.token);
    const fileURL = URL.createObjectURL(
      new Blob([response.data], { type: "application/csv" })
    );
    const fileLink = document.createElement("a");
    fileLink.href = fileURL;
    fileLink.setAttribute("download", "export.csv");
    document.body.appendChild(fileLink);
    fileLink.click();
  } catch (err) {
    snackbar.error(err);
  } finally {
    stopLoading()
  }
};
</script>
