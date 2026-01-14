<template>
  <v-container variant="flat">
    <v-col cols="12" md="6" lg="6" xl="6" class="pa-1">
      <ConfirmPopup ref="confirmRef" />
    </v-col>
    <v-container class="elevation-0 pt-0">
      <InstitutionSummary :institution="institution" />
      <EditInstitutionButton :edit-state="editState" />
      <SaveInstitutionButton :edit-state="editState" :institution="institution" />
      <ResetInstitutionButton :edit-state="editState" :institution="institution" />
      <ValidateInstitutionButton :institution="institution" :is-edit-mode-disabled="editState.disabled"
        :status="currentInstitution.status" :validated-status="validatedStatus" :confirm-ref="confirmRef" />
      <InvalidateInstitutionButton :institution="institution" :is-edit-mode-disabled="editState.disabled"
        :status="currentInstitution.status" :validated-status="validatedStatus" :confirm-ref="confirmRef" />
      <DeleteInstitutionButton :institution="institution" :confirm-ref="confirmRef" />
      <v-row class="d-flex justify-space-between flex-wrap ma-0 pa-0">
        <v-col cols="12" md="6" lg="6" xl="6" class="d-flex align-content-start justify-center flex-wrap px-0 pr-2">
          <InstitutionDetailsForm :institution="institution" :institution-types="institutionTypes"
            :is-edit-mode-disabled="editState.disabled" :is-admin="isAdmin" />
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" class="d-flex align-content-start justify-center flex-wrap px-0 pl-2">
          <ContactDetailsForm :institution="institution" :is-edit-mode-disabled="editState.disabled" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import DeleteInstitutionButton from "@/components/institution/buttons/DeleteInstitutionButton.vue";
import EditInstitutionButton from "@/components/institution/buttons/EditInstitutionButton.vue";
import InvalidateInstitutionButton from "@/components/institution/buttons/InvalidateInstitutionButton.vue";
import ResetInstitutionButton from "@/components/institution/buttons/ResetInstitutionButton.vue";
import SaveInstitutionButton from "@/components/institution/buttons/SaveInstitutionButton.vue";
import ValidateInstitutionButton from "@/components/institution/buttons/ValidateInstitutionButton.vue";
import ContactDetailsForm from "@/components/institution/ContactDetailsForm.vue";
import InstitutionDetailsForm from "@/components/institution/InstitutionDetailsForm.vue";
import InstitutionSummary from "@/components/institution/InstitutionSummary.vue";
import { useInstitutionService } from "@/composables/service/useInstitutionService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { useSnackbar } from "@/composables/useSnackbar";
import Institution from "@/entity/Institution";
import { RouteName } from "@/router";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const snackbar = useSnackbar();
const institutionStore = useInstitutionStore();
const router = useRouter();
const institutionService = useInstitutionService();
const { t } = useI18n();

const confirmRef = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const institution = ref<Institution>(institutionStore.getCurrentInstitution);
const institutionTypes = ref<Array<string>>([]);
const editState = reactive({ disabled: true });
const { isAdmin } = storeToRefs(authStore);
const { currentInstitution } = storeToRefs(institutionStore);
const validatedStatus = "Validé";

onMounted(() => {
  fetchInstitutionTypes();
  if (!isAdmin.value) {
    snackbar.error(t("institution.card.unauthorized"));
    router.push({ name: RouteName.Home });
  }
});

async function fetchInstitutionTypes() {
  try {
    institutionTypes.value = await institutionService.listInstitutionTypes();
  } catch (err: any) {
    snackbar.error(err);
  }
}






</script>

