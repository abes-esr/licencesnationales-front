<template>
  <v-btn v-if="editState.disabled" class="mt-3" variant="tonal" style="margin-right: 1em" @click="enableEdit">
    {{ $t("institution.card.editAccount") }}
  </v-btn>
</template>

<script setup lang="ts">
const props = defineProps<{
  editState: { disabled: boolean };
}>();

const enableEdit = () => {
  props.editState.disabled = false;
};
</script>
