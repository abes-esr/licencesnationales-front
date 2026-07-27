<template>
  <v-btn v-if="!editState.disabled" class="mt-3" style="margin-right: 1em" variant="tonal" @click="reset">
    {{ t("institution.card.resetFields") }}
  </v-btn>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const props = defineProps<{
  editState: { disabled: boolean };
}>();

const emit = defineEmits(["reset"]);

const { t } = useI18n();

/**
 * Réinitialise l'état d'édition en émettant l'événement 'reset' au parent
 * et en désactivant le mode édition.
 */
const reset = () => {
  emit("reset");
  props.editState.disabled = true;
};
</script>

