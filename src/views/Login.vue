<template>
  <div>
    <v-container class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col xl="5" lg="7" md="9" xs="11">
          <LoginForm @onChange="showForgotPassword()" />

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
            <v-btn variant="tonal" @click="createAccount">Créer un compte
              <FontAwesomeIcon :icon="faCirclePlus" class="mx-2" style="font-size: 1.1rem" />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import LoginForm from "@/components/authentication/login/LoginForm.vue";
import Institution from "@/entity/Institution";
import { RouteName } from "@/router";
import { useInstitutionStore } from "@/composables/store/useInstitutionStore";
import { faCirclePlus, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";

// Store & Router
const institutionStore = useInstitutionStore();
const router = useRouter();
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
async function createAccount() {
  await institutionStore.setCurrentInstitution(new Institution());
  router.push({ name: RouteName.InstitutionCreate });
}

async function showForgotPassword() {
  router.push({ name: RouteName.ForgotPassword });
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


