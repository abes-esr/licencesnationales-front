<template>
  <InstitutionSplitForm />
</template>

<script setup lang="ts">
import InstitutionSplitForm from "@/components/institution/InstitutionSplitForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "institution.split.meta.title",
  descriptionKey: "institution.split.meta.description"
});
</script>
