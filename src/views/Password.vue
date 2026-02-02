<template>
  <v-container class="d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col lg="9" md="10" xs="12">
        <ChangePasswordForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ChangePasswordForm from "@/components/authentication/login/ChangePasswordForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "auth.changePassword.meta.title",
  descriptionKey: "auth.changePassword.meta.description"
});
</script>
