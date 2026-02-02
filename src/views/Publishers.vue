<template>
  <PublisherList />
</template>

<script setup lang="ts">
import PublisherList from "@/components/publisher/PublisherList.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "publisher.list.meta.title",
  descriptionKey: "publisher.list.meta.description"
});
</script>
