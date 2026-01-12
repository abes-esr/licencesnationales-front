<template>
  <v-card class="pa-8 login-card">
    <v-card-title class="text-center">
      <h1>Connexion</h1>
    </v-card-title>
    <v-card-text class="pa-0">
      <v-form ref="form">
        <v-row>
          <v-col cols="12" class="pa-2">
            <v-text-field
              ref="loginRef"
              v-model="siren"
              label="Siren"
              placeholder="Siren"
              :rules="rulesForms.siren"
              variant="outlined"
              required
              @keyup.enter="validate"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-2">
            <v-text-field
              ref="passwordRef"
              v-model="password"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              label="Mot de passe"
              placeholder="Mot de passe"
              :rules="rulesForms.motDePasse"
              variant="outlined"
              required
              @click:append-inner="show = !show"
              @keyup.enter="validate"
              autocomplete="current-password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-2 d-flex justify-end">
            <v-btn
              :loading="buttonLoading"
              size="x-large"
              class="bouton-connexion"
              @click="validate"
            >
              Se connecter
              <v-icon class="pl-2">mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-text class="pa-0 pt-4">
      <v-btn variant="text" class="text-none" @click="afficherMotDePasseOulie">
        Mot de passe oublie ?
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSnackbar } from "@/composables/useSnackbar";
import { useAuthStore } from "@/stores/authStore";
import { Logger } from "@/utils/Logger";
import { rulesForms } from "@/core/RulesForm";
import type { VForm } from "vuetify/components";

const emit = defineEmits<{
  (e: "onChange"): void;
}>();

const snackbar = useSnackbar();
const authStore = useAuthStore();

const siren = ref("");
const password = ref("");

const buttonLoading = ref(false);
const show = ref(false);

const form = ref<VForm | null>(null);
const loginRef = ref<any>(null);
const passwordRef = ref<any>(null);

const validate = async () => {
  snackbar.hide();
  const validation = await form.value?.validate();
  if (validation?.valid) {
    login();
  }
};

const login = async () => {
  buttonLoading.value = true;
  snackbar.hide();

  try {
    await authStore.login({
      login: siren.value,
      password: password.value
    });
  } catch (err: any) {
    Logger.error(err?.toString?.() ?? err);
    snackbar.error(err);
  } finally {
    buttonLoading.value = false;
  }
};

const afficherMotDePasseOulie = () => {
  emit("onChange");
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
