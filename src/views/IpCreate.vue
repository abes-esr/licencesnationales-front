<template>
  <IpCreate />
</template>

<script setup lang="ts">
import IpCreate from "@/components/ip/IpCreate.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "ip.create.meta.title",
  descriptionKey: "ip.create.meta.description"
});
</script>
