<template>
  <Statistics />
</template>

<script setup lang="ts">
import Statistics from "@/components/institution/Statistics.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "institution.stats.meta.title",
  descriptionKey: "institution.stats.meta.description"
});
</script>
