<template>
  <div>
    <v-container class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col xl="5" lg="7" md="9" xs="11">
          <form-login @onChange="afficherMotDePasseOublie()" />

          <div id="noAccount" class="
                                                            mt-6
                                                            d-flex
                                                            justify-space-around
                                                            flex-column flex-md-row flex-wrap
                                                            pb-8
                                                          ">
            <span class="d-block full-width">
              <h1 class="pb-2">
                Votre établissement n'a pas encore de compte ?
              </h1>
            </span>
            <v-btn variant="tonal" href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
              target="_blank">Vérifier l'éligibilité
              <FontAwesomeIcon :icon="faCircleQuestion" class="mx-2" style="font-size: 1.1rem" />
            </v-btn>
            <v-btn variant="tonal" @click="creerCompte">Créer un compte
              <FontAwesomeIcon :icon="faCirclePlus" class="mx-2" style="font-size: 1.1rem" />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
 import { Logger } from "@/utils/Logger";
import Etablissement from "@/core/Etablissement";
import FormLogin from "@/components/authentification/login/FormLogin.vue";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCirclePlus, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

// Store & Router
const authStore = useAuthStore();
const etablissementStore = useEtablissementStore();
const messageStore = useMessageStore();
const router = useRouter();

// États locaux
const forgotPasswordVisible = ref(false);

// Méta (si tu utilises vue-meta ou vite-plugin-vue-meta)
const metaInfo = {
  title: "Connexion - Licences Nationales",
  meta: [
    {
      name: "description",
      content: "Page de connexion de l'application des Licences Nationales"
    }
  ]
};

// Fonctions
async function creerCompte() {
  try {
    await etablissementStore.setCurrentEtablissement(new Etablissement());
    router.push({ name: "CreationEtablissement" });
  } catch (err) {
    Logger.error(err);
  }
}

async function afficherMotDePasseOublie() {
  try {
    await messageStore.closeDisplayedMessage();
    router.push({ name: "ForgotPassword" });
  } catch (err) {
    Logger.error(err);
  }
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
