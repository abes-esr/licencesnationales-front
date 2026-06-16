<template>
  <Search />
</template>

<script setup lang="ts">
import Search from "@/components/common/Search.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "common.search.meta.title",
  descriptionKey: "common.search.meta.description"
});
</script>
