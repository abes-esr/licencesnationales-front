<template>
  <InstitutionForm :action="RouteAction.MODIFICATION" />
</template>

<script setup lang="ts">
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";
import { RouteAction } from "@/router";

usePageMeta({
  titleKey: "institution.form.meta.editTitle",
  descriptionKey: "institution.form.meta.description"
});
</script>
