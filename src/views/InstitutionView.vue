<template>
  <InstitutionCard />
</template>

<script setup lang="ts">
import InstitutionCard from "@/components/institution/InstitutionCard.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "institution.card.meta.title",
  descriptionKey: "institution.card.meta.description"
});
</script>
