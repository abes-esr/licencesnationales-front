<template>
  <v-btn v-if="!editState.disabled" class="mt-3" variant="tonal" color="success" style="margin-right: 1em"
    :loading="isSaving" @click="save">
    {{ $t("institution.card.validateChanges") }}
  </v-btn>
</template>

<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";

const props = defineProps<{
  institution: Institution;
  editState: { disabled: boolean };
}>();

const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const institutionService = useInstitutionService();
const snackbar = useSnackbar();
const { loading: isSaving, startLoading, stopLoading } = useLoading();

const save = () => {
  startLoading();
  institutionService
    .updateInstitution(props.institution, authStore.token, authStore.isAdmin)
    .then(() => {
      institutionStore.updateCurrentInstitution(props.institution);
    })
    .catch((err: any) => {
      snackbar.error(err);
    })
    .finally(() => {
      props.editState.disabled = true;
      stopLoading();
    });
};
</script>
