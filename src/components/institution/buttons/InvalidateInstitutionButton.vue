<template>
  <v-btn v-if="isEditModeDisabled && status === validatedStatus" class="btn-5 mt-3" style="margin-right: 1em"
    :loading="isLoading" @click="invalidate">
    {{ $t("institution.card.invalidateAccount") }}
  </v-btn>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  institution: Institution;
  isEditModeDisabled: boolean;
  status: string;
  validatedStatus: string;
  confirmRef: InstanceType<typeof ConfirmPopup> | null;
}>();

const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const institutionService = useInstitutionService();
const snackbar = useSnackbar();
const { t } = useI18n();
const { loading: isLoading, startLoading, stopLoading } = useLoading();

const invalidate = async () => {
  const confirmed = await props.confirmRef?.open(
    t("institution.card.confirmInvalidate", { name: props.institution.name })
  );
  if (confirmed) {
    try {
      props.institution.status = "Nouveau";
      startLoading();
      const response = await institutionService
        .invalidateInstitution(props.institution.siren, authStore.token)

      institutionStore.updateCurrentInstitution(props.institution);
      snackbar.success(response.data.message);
    } catch (err) {
      snackbar.error(err);
    } finally {
      stopLoading();
    }
  }
};
</script>
