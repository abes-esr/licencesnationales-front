<template>
  <v-footer id="footer" color="primary" class="pa-0 text-white">
    <v-card class="flex w-100 footer-card" flat>
      <v-card-title class="teal footer-top align-center pa-0 d-md-flex pa-4 text-white">
        <v-col cols="12" md="4" lg="3" xl="3">
          <div class="left-container d-flex flex-column justify-space-between">
            <div class="raccourci">
              <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="mx-2" />
              <span class="texte text-wrap text-break">{{ $t("common.footer.quickAccess") }}</span>
            </div>

            <v-btn href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank"
              class="footer-btn mx-2 text-center text-white">
              <span class="texte text-wrap text-break">{{ $t("common.footer.assistance") }}</span>
              <FontAwesomeIcon :icon="faComments" class="mx-2" />
            </v-btn>

            <v-btn href="https://www.licencesnationales.fr/" target="_blank"
              class="footer-btn mx-2 text-center text-white">
              <span class="texte text-wrap text-break">{{ $t("common.footer.site") }}</span>
              <FontAwesomeIcon :icon="faCircleArrowRight" class="mx-2" />
            </v-btn>

            <v-btn href="https://documentation.abes.fr/aidelicencesnationales/index.html" target="_blank"
              class="footer-btn mx-2 text-center text-white">
              <span class="texte text-wrap text-break">{{ $t("common.footer.documentation") }}</span>
              <FontAwesomeIcon :icon="faCircleQuestion" class="mx-2" />
            </v-btn>
          </div>
        </v-col>

        <v-divider class="mx-4 hidden-sm-and-down" vertical style="height: auto" />

        <v-spacer />

        <v-divider class="mx-4 hidden-sm-and-down" vertical style="height: auto" />
        <v-divider class="mx-4 hidden-md-and-up" style="height: auto" />

        <v-col cols="12" md="6" lg="4" xl="4" class="d-flex justify-space-around align-center">
          <div class="d-flex flex-column justify-space-between text-right mr-3 right-container text-white">
            <h4 class="mb-2 text-wrap text-break">{{ $t("common.footer.agencyName") }}</h4>
            <div>
              {{ $t("common.footer.addressLine1") }}<br />
              {{ $t("common.footer.addressLine2") }}
            </div>
            <div>{{ $t("common.footer.phone") }}</div>
          </div>

          <div class="d-flex flex-column justify-space-around logos">
            <a href="https://abes.fr/" target="_blank" class="ma-2">
              <v-img src="/logo-abes-blanc.svg" max-width="60" :alt="$t('common.footer.abesLogoAlt')" />
            </a>
            <a href="https://www.enseignementsup-recherche.gouv.fr/" target="_blank" class="ma-2">
              <v-img src="/logo-mesri-2020.svg" max-width="60" :alt="$t('common.footer.mesriLogoAlt')" />
            </a>
          </div>
        </v-col>
      </v-card-title>

      <v-card-text class="py-2 text-white footer-bottom bg-secondary">
        <strong>{{ $t("common.footer.licencesNationales") }} </strong>

        <v-tooltip location="top" theme="dark" content-class="text-white">
          <template #activator="{ props }">
            <span v-bind="props">{{ appVersion }}</span>
          </template>

          <span>
            {{ $t("common.footer.front") }}: {{ appVersion }}<br />
            {{ $t("common.footer.back") }}: {{ backVersion }}
          </span>
        </v-tooltip>

        <div id="mentions">
          <router-link class="text-white" :to="{ name: RouteName.Privacy }">
            {{ $t("common.footer.personalData") }}
          </router-link>
          |
          <router-link class="text-white" :to="{ name: RouteName.Terms }">
            {{ $t("common.footer.terms") }}
          </router-link>
          |
          <router-link class="text-white" :to="{ name: RouteName.Legal }">
            {{ $t("common.footer.legal") }}
          </router-link>
          |
          <router-link class="text-white" :to="{ name: RouteName.Accessibility }">
            {{ $t("common.footer.accessibility") }}
          </router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script setup lang="ts">
import { useAuthService } from "@/composables/service/useAuthService";
import { RouteName } from "@/router";
import { Logger } from "@/utils/Logger";
import {
  faArrowUpRightFromSquare,
  faCircleArrowRight,
  faCircleQuestion,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const authService = useAuthService();
const { t } = useI18n();

const appVersion = import.meta.env.VITE_APP_VERSION as string;
const backVersion = ref("");

onMounted(async () => {
  try {
    const response = await authService.getVersion();
    backVersion.value = response.data;
  } catch (error: any) {
    Logger.error(t("common.footer.versionError", { error: String(error) }));
  }
});
</script>

<style scoped lang="scss">
#footer,
#footer .v-btn__content {
  font-size: 0.6rem;
}

.left-container {
  min-height: 200px;
  padding-left: 4vw;
}

.footer-card {
  background-color: transparent !important;
}

.right-container {
  width: 250px;
  font-size: 0.8rem;
  font-weight: 500;
}

.right-container h4 {
  font-size: 1.1rem;
  font-weight: 900;
}

.footer-btn {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 200px;
}

.footer-btn .texte {
  width: 140px;
  font-size: 12px;
}

#mentions {
  float: right;
}

#mentions a {
  text-decoration: none;
}

.logos {
  width: 30%;
}
</style>
