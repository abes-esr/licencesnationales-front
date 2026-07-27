<template>
  <v-btn
    v-if="!editState.disabled"
    class="mt-3"
    variant="tonal"
    color="success"
    style="margin-right: 1em"
    :loading="isSaving"
    @click="save"
  >
    {{ t("institution.card.validateChanges") }}
  </v-btn>
</template>

<script setup lang="ts">
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  institution: Institution;
  editState: { disabled: boolean };
}>();

const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const institutionService = useInstitutionService();
const snackbar = useSnackbar();
const { loading: isSaving, startLoading, stopLoading } = useLoading();
const { t } = useI18n();
const { currentInstitution } = storeToRefs(institutionStore);

/**
 * Sauvegarde les modifications apportées à l'institution en appelant le service d'API.
 * Envoie le SIREN actuel (non modifié) comme identifiant dans l'URL et l'objet institution (avec les nouvelles valeurs dont le SIREN modifié) dans le corps.
 * En cas de succès, met à jour le store global et désactive le mode édition.
 */
const save = async () => {
  try {
    startLoading();
    await institutionService.updateInstitution(
      currentInstitution.value.siren,
      props.institution,
      authStore.token,
      authStore.isAdmin
    );
    institutionStore.updateCurrentInstitution(props.institution);
  } catch (err) {
    snackbar.error(err);
  } finally {
    props.editState.disabled = true;
    stopLoading();
  }
};
</script>

