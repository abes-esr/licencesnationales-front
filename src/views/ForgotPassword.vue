<template>
  <v-container class="fill-height d-flex justify-center">
    <v-row align="center" justify="center">
      <v-col xl="5" lg="7" md="9" cols="11">
        <ForgotPasswordForm />
        <v-row id="row_RevenirAccueil" class="mt-4">
          <v-col cols="12" class="text-center">
            <a @click="goToLogin()">
              <v-icon icon="mdi-reply"></v-icon>&nbsp;Revenir à la page
              d'accueil
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useSnackbar } from "@/composables/useSnackbar";
import { RouteName } from "@/router";
import { useRouter } from "vue-router";
import ForgotPasswordForm from "../components/authentication/login/ForgotPasswordForm.vue";

const router = useRouter();
const snackbar = useSnackbar();

function goToLogin(): void {
  snackbar.hide();
  router.push({ name: RouteName.Login });
}
</script>

<style scoped lang="scss">
h4 {
  display: inline;
}

.full-width {
  width: 100%;
}

#row_RevenirAccueil {
  margin: auto;
}

p {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 0;
}

strong {
  font-weight: 900;
}

h4 {
  font-size: 18px;
}
</style>
