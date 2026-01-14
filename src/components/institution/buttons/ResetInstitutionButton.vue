<template>
  <v-btn v-if="!editState.disabled" class="mt-3" style="margin-right: 1em" variant="tonal" @click="reset">
    {{ $t("institution.card.resetFields") }}
  </v-btn>
</template>

<script setup lang="ts">
import Institution from "@/entity/Institution";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";

const props = defineProps<{
  institution: Institution;
  editState: { disabled: boolean };
}>();

const institutionStore = useInstitutionStore();

const reset = () => {
  Object.assign(props.institution, institutionStore.getCurrentInstitution);
  props.editState.disabled = true;
};
</script>


