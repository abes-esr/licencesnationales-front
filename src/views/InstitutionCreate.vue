<template>
  <InstitutionForm :action="RouteAction.CREATION" />
</template>

<script setup lang="ts">
import InstitutionForm from "@/components/institution/InstitutionForm.vue";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import Institution from "@/entity/Institution";
import { RouteAction } from "@/router";
import { onMounted } from "vue";

const institutionStore = useInstitutionStore();

onMounted(() => {
  institutionStore.setCurrentInstitution(new Institution());
});
</script>
