<template>
  <div>
    <v-container fill-height class="d-flex justify-center">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <div style="padding: 20px;">
            <h1>Données personnelles</h1>
            <p>
              L’Abes s’engage à ce que la collecte et le traitement de vos
              données, effectués à partir du site Licences nationales
              (licencesnationales.fr) soient conformes au Règlement Général
              européen sur la Protection des Données (RGPD). <br />

              Aucune information personnelle n’est donc collectée à votre insu.
              <br />

              Les informations recueillies dans le formulaire d’inscription sont
              enregistrées dans un fichier informatisé par l'Agence
              Bibliographique de l'Enseignement Supérieur (Abes) pour la gestion
              des accès aux ressources acquises en licence nationale, via les
              plateformes des éditeurs et/ou via les plateformes d’archivage de
              l’Inist-CNRS (ISTEX, PANIST). Elles sont conservées pendant la
              durée d'exercice de l'activité de l'agent concerné, et sont
              destinées aux personnes en charge des accès des établissements
              bénéficiaires aux ressources citées (éditeurs, équipes de l’Abes,
              de l’Inist-CNRS et du consortium Couperin.org).
              <br />
              Conformément au Règlement général sur la protection des données et
              à la loi « informatique et libertés », vous pouvez exercer votre
              droit d'accès aux données vous concernant et les rectifier. Pour
              toute question,
              <a href="https://stp.abes.fr" target="_blank"
                >contacter le guichet d'assistance ABESstp</a
              >.
            </p>
            <h2>A propos des cookies</h2>
            Différents cookies sont utilisés sur le site, afin d’améliorer son
            interactivité et la qualité de ses services. Types de cookies
            déposés sur ce site :
            <br /><br />
            <h4 class="title">
              1) Cookies internes nécessaires au fonctionnement du site
            </h4>
            <p>
              Ces cookies permettent au site de fonctionner de manière optimale.
              Vous pouvez vous y opposer et les supprimer en utilisant les
              paramètres de votre navigateur, cependant votre expérience
              utilisateur risque d’être dégradée.
            </p>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>Nom du cookie</th>
                  <th>Finalité</th>
                  <th>Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cookie-banner-accept</td>
                  <td>Acceptation de l’utilisation de cookies</td>
                  <td>13 mois</td>
                </tr>
                <tr>
                  <td>Cookies Google Recaptcha</td>
                  <td>
                    Ce cookie est utilisé dans le formulaire de création de
                    comptes, afin d’empêcher ou de décourager le spam.
                    L’utilisation de cette technologie implique l’installation
                    du cookie (non de profilage) de la société, Google.
                  </td>
                  <td>7 jours</td>
                </tr>
              </tbody>
            </v-simple-table>
            <br /><br />
            <h4 class="title">2) Cookies de mesure d’audience</h4>
            <p>
              En vue d’adapter le site aux demandes de ses visiteurs, nous
              mesurons le nombre de visites, le nombre de pages vues ainsi que
              l'activité des visiteurs sur le site et leur fréquence de retour.
            </p>
            <p>
              PIWIK, l'outil de statistiques utilisé par l'ABES, génère les
              cookies suivants :
            </p>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>Nom du cookie</th>
                  <th>Finalité</th>
                  <th>Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>pk_session</td>
                  <td>Statistics piwik</td>
                  <td>7 jours</td>
                </tr>
                <tr>
                  <td>pk_id</td>
                  <td>Statistics piwik</td>
                  <td>30 minutes</td>
                </tr>
              </tbody>
            </v-simple-table>
            <br /><br />
            <p>
              Nous collectons également votre adresse IP, anonymisée, afin de
              déterminer la ville depuis laquelle vous vous connectez.
              L'application Licences Nationales ne peut donc en aucun cas
              remonter par ce biais à une personne physique.
            </p>
            <p>
              Les données personnelles recueillies (identifiant du cookie) sont
              conservées par l'ABES pour une durée de 13 mois. Elles ne sont ni
              cédées à des tiers, ni utilisées à d'autres fins.
            </p>
          </div>
        </v-col></v-row
      ></v-container
    >
  </div>
</template>

<style>
h1 {
  padding-bottom: 40px;
}

h2 {
  padding-bottom: 20px;
  padding-top: 20px;
}
</style>
