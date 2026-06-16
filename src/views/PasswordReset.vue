<template>
  <PasswordResetForm />
</template>

<script setup lang="ts">
import PasswordResetForm from "@/components/authentication/login/PasswordResetForm.vue";
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "auth.resetPassword.meta.title",
  descriptionKey: "auth.resetPassword.meta.description"
});
</script>
