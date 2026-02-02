<template>
  <div>
    <v-container fill-height class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <div style="padding: 20px;">
            <h1>{{ $t("footer.legal.title") }}</h1>
            <h2>{{ $t("footer.legal.responsibilityTitle") }}</h2>
            <v-divider></v-divider>

            <h3>{{ $t("footer.legal.publisherTitle") }}</h3>
            <p>{{ $t("footer.legal.publisherLine1") }}<br />
              {{ $t("footer.legal.publisherLine2") }}<br />
              {{ $t("footer.legal.publisherLine3") }}<br />
              {{ $t("footer.legal.publisherLine4") }}</p>

            <h3>{{ $t("footer.legal.directorTitle") }}</h3>
            <p>{{ $t("footer.legal.directorText") }}</p>

            <h3>{{ $t("footer.legal.creditsTitle") }}</h3>
            <p>{{ $t("footer.legal.creditsText1") }}<br />
              {{ $t("footer.legal.creditsText2") }}</p>

            <h3>{{ $t("footer.legal.presentationTitle") }}</h3>
            <p>{{ $t("footer.legal.presentationText") }}</p>

            <h3>{{ $t("footer.legal.contactTitle") }}</h3>
            <p>{{ $t("footer.legal.contactText1") }}</p>
            <p>{{ $t("footer.legal.contactText2") }}</p>
            <p>
              {{ $t("footer.legal.contactText3") }}
              <a href="https://stp.abes.fr/node/3?origine=LicencesNationales" target="_blank">
                {{ $t("footer.legal.contactLink") }}
              </a>
            </p>

            <h3>{{ $t("footer.legal.ipTitle") }}</h3>
            <p>{{ $t("footer.legal.ipText1") }}</p>
            <p>{{ $t("footer.legal.ipText2") }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "footer.legal.meta.title",
  descriptionKey: "footer.legal.meta.description"
});
</script>

<style scoped>
h2 {
  padding-bottom: 10px;
}

h3 {
  padding-top: 20px;
}
</style>
