<template>
  <InstitutionForm :action="RouteAction.CREATION" />
</template>

<script setup lang="ts">
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { usePageMeta } from "@/composables/usePageMeta";
import Institution from "@/entity/Institution";
import { RouteAction } from "@/router";
import { onMounted } from "vue";

const institutionStore = useInstitutionStore();

usePageMeta({
  titleKey: "institution.form.meta.createTitle",
  descriptionKey: "institution.form.meta.description"
});

onMounted(() => {
  const institution = new Institution();
  institution.id = -999;
  institutionStore.setCurrentInstitution(institution);
});
</script>
