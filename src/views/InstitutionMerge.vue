<template>
  <InstitutionMergeForm />
</template>

<script setup lang="ts">
import InstitutionMergeForm from "@/components/institution/InstitutionMergeForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "institution.merge.meta.title",
  descriptionKey: "institution.merge.meta.description"
});
</script>
