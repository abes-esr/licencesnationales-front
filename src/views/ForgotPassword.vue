<template>
  <v-container class="fill-height d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col xl="5" lg="7" md="9" cols="11">
        <ForgotPasswordForm />
        <v-row id="row_RevenirAccueil" class="mt-4">
          <v-col cols="12" class="text-center">
            <router-link :to="{ name: RouteName.Login }">
              <v-icon icon="mdi-reply"></v-icon>&nbsp;{{ $t("auth.forgotPassword.backHome") }}
            </router-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { usePageMeta } from "@/composables/usePageMeta";
import { RouteName } from "@/router";
import ForgotPasswordForm from "../components/authentication/login/ForgotPasswordForm.vue";

usePageMeta({
  titleKey: "auth.forgotPassword.meta.title",
  descriptionKey: "auth.forgotPassword.meta.description"
});
</script>

<style scoped lang="scss">
#row_RevenirAccueil {
  margin: auto;
}
</style>
