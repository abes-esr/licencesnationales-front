<template>
  <v-card class="pa-8 w-100 login-card">
    <v-card-title class="text-center">
      <h1>Connexion</h1>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-form ref="form">
        <v-row>
          <v-col cols="12" class="pa-2">
            <v-text-field v-model="siren" label="SIREN" placeholder="SIREN" :rules="rulesForms.siren" variant="outlined"
              maxLength="9" required @keyup.enter="validate"></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-2">
            <v-text-field v-model="password" :append-inner-icon="appendIcon" :type="inputType" label="Mot de passe"
              placeholder="Mot de passe" :rules="rulesForms.motDePasse" variant="outlined" required
              @click:append-inner="toggleShow" @keyup.enter="validate" autocomplete="current-password"></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-2 d-flex justify-end">
            <v-btn :loading="buttonLoading" size="x-large" class="bouton-connexion" @click="validate">
              Se connecter
              <v-icon class="pl-2">mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-text class="pa-0 pt-4">
      <v-btn variant="text" class="text-none" :to="{ name: RouteName.ForgotPassword }">
        Mot de passe oublie ?
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useSnackbar } from "@/composables/useSnackbar";
import { rulesForms } from "@/core/RulesForm";
import { RouteName } from "@/router";
import { useAuthStore } from "@/stores/authStore";
import { useToggle } from "@/utils/useToggle";
import { computed, ref } from "vue";
import type { VForm } from "vuetify/components";

const snackbar = useSnackbar();
const authStore = useAuthStore();

const siren = ref("");
const password = ref("");

const buttonLoading = ref(false);

const form = ref<VForm | null>(null);
const { value: show, toggle: toggleShow } = useToggle(false);
const inputType = computed(() => (show.value ? "text" : "password"));
const appendIcon = computed(() => (show.value ? "mdi-eye" : "mdi-eye-off"));

const validate = async () => {
  snackbar.hide();
  const validation = await form.value?.validate();
  if (!validation?.valid) {
    return;
  }
  await login();
};

const login = async () => {
  buttonLoading.value = true;

  try {
    await authStore.login({
      login: siren.value,
      password: password.value
    });
  } catch (err: any) {
    snackbar.error(err);
  } finally {
    buttonLoading.value = false;
  }
};

</script>

<style scoped>
.login-card {
  width: 350px;
}

h1 {
  text-align: center;
  padding-bottom: 20px;
}

.bouton-connexion {
  width: 100%;
}
</style>
