<template>
  <InstitutionList />
</template>

<script setup lang="ts">
import InstitutionList from "@/components/institution/InstitutionList.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "institution.list.meta.title",
  descriptionKey: "institution.list.meta.description"
});
</script>
