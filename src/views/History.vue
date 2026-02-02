<template>
  <History />
</template>

<script setup lang="ts">
import History from "@/components/institution/History.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "institution.history.meta.title",
  descriptionKey: "institution.history.meta.description"
});
</script>
