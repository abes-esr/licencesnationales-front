<template>
  <InstitutionForm :action="RouteAction.MODIFICATION" />
</template>

<script setup lang="ts">
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { RouteAction } from "@/router";
import { storeToRefs } from "pinia";
import { watchEffect } from "vue";

const authStore = useAuthStore();
const institutionStore = useInstitutionStore();
const { connectedInstitution } = storeToRefs(authStore);

usePageMeta({
  titleKey: "institution.form.meta.editTitle",
  descriptionKey: "institution.form.meta.description"
});

watchEffect(() => {
  if (connectedInstitution.value) {
    institutionStore.setCurrentInstitution(connectedInstitution.value);
  }
});
</script>
