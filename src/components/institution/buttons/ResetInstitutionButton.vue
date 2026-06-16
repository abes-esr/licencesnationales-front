<template>
  <v-btn v-if="!editState.disabled" class="mt-3" style="margin-right: 1em" variant="tonal" @click="reset">
    {{ t("institution.card.resetFields") }}
  </v-btn>
</template>

<script setup lang="ts">
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import Institution from "@/entity/Institution";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  institution: Institution;
  editState: { disabled: boolean };
}>();

const institutionStore = useInstitutionStore();

const { t } = useI18n();

const reset = () => {
  Object.assign(props.institution, institutionStore.currentInstitution);
  props.editState.disabled = true;
};
</script>
