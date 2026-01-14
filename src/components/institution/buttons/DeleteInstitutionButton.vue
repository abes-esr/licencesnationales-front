<template>
  <v-btn color="button" class="bouton-supprimer mt-3" :loading="isLoading" @click="deleteInstitution">
    {{ $t("institution.card.deleteAccount") }}
  </v-btn>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useLoading } from "@/composables/useLoading";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { RouteName } from "@/router";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  institution: Institution;
  confirmRef: InstanceType<typeof ConfirmPopup> | null;
}>();

const authStore = useAuthStore();
const institutionService = useInstitutionService();
const router = useRouter();
const snackbar = useSnackbar();
const { t } = useI18n();
const { loading: isLoading, startLoading, stopLoading } = useLoading();

const deleteInstitution = async () => {
  startLoading();
  const confirmed = await props.confirmRef?.open(
    t("institution.card.confirmDelete", { name: props.institution.name })
  );
  if (confirmed) {
    institutionService
      .deleteInstitution(props.institution.siren, authStore.token)
      .then(() => {
        snackbar.success(t("institution.card.deleteSuccess"), {
          onHide: () => {
            router.push({ name: RouteName.Institutions });
          },
          timeout: 4000,
        });
      })
      .catch(err => {
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
