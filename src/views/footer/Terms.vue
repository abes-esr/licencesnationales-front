<template>
  <div>
    <v-container fill-height class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <div style="padding: 20px;">
            <h1>{{ $t("footer.terms.title") }}</h1>
            <h2>{{ $t("footer.terms.section1Title") }}</h2>
            <p>
              {{ $t("footer.terms.section1P1") }}
              <a href="licencesnationales.fr" target="_blank">(licencesnationales.fr)</a>
              {{ $t("footer.terms.section1P2") }}
            </p>
            <p>{{ $t("footer.terms.section1P3") }}</p>

            <h2>{{ $t("footer.terms.section2Title") }}</h2>
            <p>
              {{ $t("footer.terms.section2P1") }}
              <a href="https://fr.wikipedia.org/wiki/Netiquette" target="_blank">(Netiquette)</a>.
            </p>
            <p>
              {{ $t("footer.terms.section2P2") }}
              <a href="licencesnationales.fr" target="_blank">(licencesnationales.fr)</a>
              {{ $t("footer.terms.section2P3") }}
            </p>

            <h2>{{ $t("footer.terms.section3Title") }}</h2>
            <p>{{ $t("footer.terms.section3P1") }}</p>

            <h2>{{ $t("footer.terms.section4Title") }}</h2>
            <p>
              {{ $t("footer.terms.section4P1") }}
              <a href="licencesnationales.fr" target="_blank">(licencesnationales.fr)</a>
              {{ $t("footer.terms.section4P2") }}
            </p>
            <p>{{ $t("footer.terms.section4P3") }}</p>

            <h2>{{ $t("footer.terms.section5Title") }}</h2>
            <p>{{ $t("footer.terms.section5P1") }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "footer.terms.meta.title",
  descriptionKey: "footer.terms.meta.description"
});
</script>

<style scoped>
h2 {
  padding-top: 40px;
  padding-bottom: 10px;
}
</style>
