<template>
  <div>
    <v-container fill-height class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <div style="padding: 20px;">
            <h1>{{ $t("footer.privacy.title") }}</h1>
            <p>{{ $t("footer.privacy.p1") }}</p>
            <p>{{ $t("footer.privacy.p2") }}</p>
            <p>{{ $t("footer.privacy.p3") }}</p>
            <p>{{ $t("footer.privacy.p4") }}</p>
            <p>
              {{ $t("footer.privacy.p5") }}
              <a href="https://stp.abes.fr" target="_blank">{{ $t("footer.privacy.contactLink") }}</a>.
            </p>

            <h2>{{ $t("footer.privacy.cookiesTitle") }}</h2>
            <p>{{ $t("footer.privacy.cookiesIntro") }}</p>

            <h4 class="title">{{ $t("footer.privacy.cookiesInternalTitle") }}</h4>
            <p>{{ $t("footer.privacy.cookiesInternalText") }}</p>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>{{ $t("footer.privacy.cookiesTable.name") }}</th>
                  <th>{{ $t("footer.privacy.cookiesTable.purpose") }}</th>
                  <th>{{ $t("footer.privacy.cookiesTable.duration") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cookie-banner-accept</td>
                  <td>{{ $t("footer.privacy.cookieAcceptPurpose") }}</td>
                  <td>{{ $t("footer.privacy.cookieAcceptDuration") }}</td>
                </tr>
                <tr>
                  <td>{{ $t("footer.privacy.cookieRecaptchaName") }}</td>
                  <td>{{ $t("footer.privacy.cookieRecaptchaPurpose") }}</td>
                  <td>{{ $t("footer.privacy.cookieRecaptchaDuration") }}</td>
                </tr>
              </tbody>
            </v-simple-table>

            <h4 class="title">{{ $t("footer.privacy.cookiesAnalyticsTitle") }}</h4>
            <p>{{ $t("footer.privacy.cookiesAnalyticsText1") }}</p>
            <p>{{ $t("footer.privacy.cookiesAnalyticsText2") }}</p>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>{{ $t("footer.privacy.cookiesTable.name") }}</th>
                  <th>{{ $t("footer.privacy.cookiesTable.purpose") }}</th>
                  <th>{{ $t("footer.privacy.cookiesTable.duration") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>pk_session</td>
                  <td>{{ $t("footer.privacy.cookiePiwikPurpose") }}</td>
                  <td>{{ $t("footer.privacy.cookiePiwikDurationShort") }}</td>
                </tr>
                <tr>
                  <td>pk_id</td>
                  <td>{{ $t("footer.privacy.cookiePiwikPurpose") }}</td>
                  <td>{{ $t("footer.privacy.cookiePiwikDurationLong") }}</td>
                </tr>
              </tbody>
            </v-simple-table>

            <p>{{ $t("footer.privacy.ipNote") }}</p>
            <p>{{ $t("footer.privacy.dataRetention") }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
  titleKey: "footer.privacy.meta.title",
  descriptionKey: "footer.privacy.meta.description"
});
</script>

<style>
h1 {
  padding-bottom: 40px;
}

h2 {
  padding-bottom: 20px;
  padding-top: 20px;
}
</style>
