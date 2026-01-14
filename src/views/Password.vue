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
import ChangePasswordForm from "@/components/authentication/login/ChangePassword.vue";

const metaInfo = {
  meta: [
    {
      name: "description",
      content:
        "Page de modification du mot de passe de l'application des Licences Nationales"
    }
  ],
  title: "Modifier mon mot de passe - Licences Nationales"
};
</script>
