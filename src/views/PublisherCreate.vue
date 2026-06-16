<template>
  <PublisherForm :action="RouteAction.CREATION" />
</template>

<script setup lang="ts">
import PublisherForm from "@/components/publisher/PublisherForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";
import { RouteAction } from "@/router";

usePageMeta({
  titleKey: "publisher.form.meta.createTitle",
  descriptionKey: "publisher.form.meta.description"
});
</script>
