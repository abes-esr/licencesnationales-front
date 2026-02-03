<template>
  <div>
    <v-container class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col xl="5" lg="7" md="9" xs="11">
          <LoginForm />
          <div id="noAccount" class="mt-6 d-flex justify-space-around flex-column flex-md-row flex-wrap pb-8">
            <span class="d-block full-width">
              <h2 class="pb-2">
                {{ $t("auth.login.noAccountTitle") }}
              </h2>
            </span>
            <v-btn variant="tonal" href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
              target="_blank">{{ $t("auth.login.verifyEligibility") }}
              <FontAwesomeIcon :icon="faCircleQuestion" class="mx-2" style="font-size: 1.1rem" />
            </v-btn>
            <v-btn variant="tonal" :to="{ name: RouteName.InstitutionCreate }">{{ $t("auth.login.createAccount") }}
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
import { usePageMeta } from "@/composables/usePageMeta";
import { RouteName } from "@/router";
import { faCirclePlus, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

usePageMeta({
  titleKey: "auth.login.meta.title",
  descriptionKey: "auth.login.meta.description"
});
</script>


<style scoped lang="scss">
.full-width {
  width: 100%;
}
</style>
