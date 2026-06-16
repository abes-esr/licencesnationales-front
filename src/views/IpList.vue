<template>
  <IpList />
</template>

<script setup lang="ts">
import IpList from "@/components/ip/IpList.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "ip.list.meta.title",
  descriptionKey: "ip.list.meta.description"
});
</script>
