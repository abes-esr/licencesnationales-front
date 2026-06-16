<template>
  <PublisherForm :action="RouteAction.MODIFICATION" />
</template>

<script setup lang="ts">
import PublisherForm from "@/components/publisher/PublisherForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";
import { RouteAction } from "@/router";

usePageMeta({
  titleKey: "publisher.form.meta.editTitle",
  descriptionKey: "publisher.form.meta.description"
});
</script>
