<template>
  <div>
    <v-container fill-height class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <div style="padding: 20px;">
            <h1>{{ $t("footer.accessibility.title") }}</h1>
            <h2>{{ $t("footer.accessibility.introTitle") }}</h2>
            <p>{{ $t("footer.accessibility.introP1") }}</p>
            <p>{{ $t("footer.accessibility.introP2") }}</p>
            <ul>
              <li>
                <a
                  href="https://abes.fr/schema-pluriannuel-rgaa-abes-2022-2024/"
                  target="_blank"
                >
                  {{ $t("footer.accessibility.planMulti") }}
                </a>
              </li>
              <li>
                <a
                  href="https://abes.fr/plan-annuel-rgaa-abes-2022/"
                  target="_blank"
                >
                  {{ $t("footer.accessibility.planAnnual") }}
                </a>
              </li>
            </ul>

            <h2>{{ $t("footer.accessibility.siteTitle") }}</h2>
            <h3>{{ $t("footer.accessibility.declarationTitle") }}</h3>
            <p>
              {{ $t("footer.accessibility.declarationP1") }}
              <a href="https://acces.licencesnationales.fr" target="_blank">(acces.licencesnationales.fr)</a>
              {{ $t("footer.accessibility.declarationP2") }}
            </p>

            <h2>{{ $t("footer.accessibility.complianceTitle") }}</h2>
            <p>
              {{ $t("footer.accessibility.complianceP1") }}
              <a href="https://acces.licencesnationales.fr" target="_blank">(acces.licencesnationales.fr)</a>
              {{ $t("footer.accessibility.complianceP2") }}
              <a
                href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/"
                target="_blank"
              >
                {{ $t("footer.accessibility.complianceLink") }}
              </a>
              {{ $t("footer.accessibility.complianceP3") }}
            </p>

            <h2>{{ $t("footer.accessibility.nonAccessibleTitle") }}</h2>
            <ul>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.imageDecor") }}</li>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.imageInfo") }}</li>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.contrast") }}</li>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.scripts") }}</li>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.color") }}</li>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.linkTitles") }}</li>
              <li>{{ $t("footer.accessibility.nonAccessibleItems.formLabels") }}</li>
            </ul>

            <h2>{{ $t("footer.accessibility.siteFeaturesTitle") }}</h2>
            <h3>{{ $t("footer.accessibility.techTitle") }}</h3>
            <ul>
              <li>{{ $t("footer.accessibility.tech.vue") }}</li>
              <li>{{ $t("footer.accessibility.tech.html") }}</li>
              <li>{{ $t("footer.accessibility.tech.css") }}</li>
              <li>{{ $t("footer.accessibility.tech.js") }}</li>
            </ul>

            <h2>{{ $t("footer.accessibility.evaluationTitle") }}</h2>
            <h3>{{ $t("footer.accessibility.toolsTitle") }}</h3>
            <ul>
              <li>{{ $t("footer.accessibility.tools.checker") }}</li>
              <li>{{ $t("footer.accessibility.tools.contrast") }}</li>
              <li>{{ $t("footer.accessibility.tools.lighthouse") }}</li>
              <li>{{ $t("footer.accessibility.tools.wave") }}</li>
              <li>{{ $t("footer.accessibility.tools.inspector") }}</li>
            </ul>
            <br />

            <h3>{{ $t("footer.accessibility.testEnvTitle") }}</h3>
            <ul>
              <li>{{ $t("footer.accessibility.testEnv.browsers") }}</li>
            </ul>

            <h2>{{ $t("footer.accessibility.assistanceTitle") }}</h2>
            <p>{{ $t("footer.accessibility.assistanceP1") }}</p>
            <p>{{ $t("footer.accessibility.assistanceP2") }}</p>
            <p>{{ $t("footer.accessibility.assistanceP3") }}</p>
            <ul>
              <li>
                <a href="https://stp.abes.fr/node/3?origine=abescom/" target="_blank">
                  {{ $t("footer.accessibility.assistanceLink") }}
                </a>
                {{ $t("footer.accessibility.assistanceDomain") }}
              </li>
            </ul>
            <br />
            <p>{{ $t("footer.accessibility.recoursP1") }}</p>
            <ul>
              <li>
                {{ $t("footer.accessibility.recoursP2") }}
                <a
                  href="https://formulaire.defenseurdesdroits.fr/code/afficher.php?ETAPE=accueil_2016"
                  target="_blank"
                >
                  {{ $t("footer.accessibility.recoursLink") }}
                </a>
              </li>
              <li>
                <a href="https://www.defenseurdesdroits.fr/saisir/delegues" target="_blank">
                  {{ $t("footer.accessibility.recoursDelegue") }}
                </a>
              </li>
              <li>{{ $t("footer.accessibility.recoursMail") }}</li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
h2 {
  padding-top: 40px;
  padding-bottom: 10px;
}
</style>
