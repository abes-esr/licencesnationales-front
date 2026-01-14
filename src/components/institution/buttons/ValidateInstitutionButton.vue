<template>
  <v-btn v-if="isEditModeDisabled && status !== validatedStatus" class="mt-3" variant="tonal" style="margin-right: 1em"
    :loading="isLoading" @click="validate">
    {{ $t("institution.card.validateAccount") }}
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

const validate = async () => {
  startLoading();
  const confirmed = await props.confirmRef?.open(
    t("institution.card.confirmValidate", { name: props.institution.name })
  );
  if (confirmed) {
    props.institution.status = props.validatedStatus;
    institutionService
      .validateInstitution(props.institution.siren, authStore.token)
      .then(response => {
        institutionStore.updateCurrentInstitution(props.institution);
        snackbar.success(response.data.message);
      })
      .catch((err: any) => {
        snackbar.error(err);
      })
      .finally(() => {
        stopLoading();
      });
  } else {
    stopLoading();
  }
};
</script>
