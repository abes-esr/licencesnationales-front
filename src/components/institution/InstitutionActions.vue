<template>
  <div>
    <v-btn v-if="isEditModeDisabled" class="mt-3" variant="tonal" style="margin-right: 1em" @click="emitEdit">
      {{ $t("institution.card.editAccount") }}
    </v-btn>
    <v-btn v-if="!isEditModeDisabled" class="mt-3" variant="tonal" color="success" style="margin-right: 1em"
      @click="emitSave">
      {{ $t("institution.card.validateChanges") }}
    </v-btn>
    <v-btn v-if="!isEditModeDisabled" class="mt-3" variant="tonal" @click="emitReset">
      {{ $t("institution.card.resetFields") }}
    </v-btn>
    <v-btn v-if="isEditModeDisabled && status !== validatedStatus" class="mt-3" variant="tonal"
      style="margin-right: 1em" :loading="isValidationLoading" @click="emitValidate">
      {{ $t("institution.card.validateAccount") }}
    </v-btn>
    <v-btn v-if="isEditModeDisabled && status === validatedStatus" class="btn-5 mt-3" :loading="isValidationLoading"
      @click="emitInvalidate">
      {{ $t("institution.card.invalidateAccount") }}
    </v-btn>
    <v-row>
      <v-col>
        <v-btn color="button" class="bouton-supprimer" :loading="isDeleteLoading" @click="emitDelete">
          {{ $t("institution.card.deleteAccount") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isEditModeDisabled: boolean;
  isValidationLoading: boolean;
  isDeleteLoading: boolean;
  status: string;
  validatedStatus: string;
}>();

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "save"): void;
  (e: "reset"): void;
  (e: "validate"): void;
  (e: "invalidate"): void;
  (e: "delete"): void;
}>();

const emitEdit = () => emit("edit");
const emitSave = () => emit("save");
const emitReset = () => emit("reset");
const emitValidate = () => emit("validate");
const emitInvalidate = () => emit("invalidate");
const emitDelete = () => emit("delete");
</script>
