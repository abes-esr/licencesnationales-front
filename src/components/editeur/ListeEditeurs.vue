<template>
  <v-card flat :disabled="disableForm">
    <h1>Gestion des éditeurs</h1>
    <v-col cols="12" md="6" lg="6" xl="6">
      <MessageBox></MessageBox>
      <ConfirmPopup ref="confirm"></ConfirmPopup>
    </v-col>
    <v-card-title>
      <v-row class="d-flex flex-row-reverse">
        <v-btn @click="ajouterEditeur()" class="btn-1 mx-2 mr-0"
          >Créer un éditeur
          <FontAwesomeIcon :icon="['fas', 'plus']" class="mx-2"
        /></v-btn>
      </v-row>
    </v-card-title>
    <v-card-text class="mt-3 fondGris">
      <v-data-table
        dense
        :headers="headers"
        :items="editeurs"
        :items-per-page="25"
        :footer-props="{ 'items-per-page-options': [25, 50, 100, -1] }"
        class="elevation-0 ma-3"
        :search="rechercher"
        id="mytable"
      >
        <template v-slot:header.statut="{ header }">
          {{ header.texte }}
        </template>
        <template v-slot:top>
          <v-row class="ma-0">
            <v-col cols="12" sm="6" class="px-0"
              ><v-tooltip top max-width="20vw" open-delay="100">
                <template v-slot:activator="{ on }">
                  <v-btn
                    text
                    @click="downloadEditeurs()"
                    class="bouton-simple pl-0"
                    v-on="on"
                    :loading="isExportLoading"
                    ><h2>
                      Télécharger la liste des éditeurs
                    </h2>
                    <FontAwesomeIcon
                      :icon="['fas', 'download']"
                      class="mx-2"
                      size="2x"
                  /></v-btn>
                </template>
                <span>Le téléchargement correspond à la vue filtrée</span>
              </v-tooltip></v-col
            >
            <v-col cols="0" sm="3" class="px-0"></v-col>
            <v-col cols="12" sm="3" class="px-0">
              <v-text-field
                v-model="rechercher"
                label="Chercher dans les colonnes"
                prepend-inner-icon="mdi-magnify"
                outlined
                filled
                dense
              ></v-text-field></v-col
          ></v-row>
        </template>
        <template v-slot:item.dateCreation="{ item }">
          <span>{{ item.dateCreation.toLocaleDateString() }}</span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            class="ma-0 pa-0 bouton-simple"
            icon
            @click="modifierEditeur(item)"
          >
            <FontAwesomeIcon :icon="['fas', 'edit']" />
          </v-btn>
          <v-btn
            class="ma-0 pa-0 bouton-simple "
            icon
            @click="supprimerEditeur(item)"
          >
            <FontAwesomeIcon :icon="['fas', 'times']" class="fa-orange" />
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import Editeur from "@/core/Editeur";
import { LicencesNationalesUnauthorizedApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesUnauthorizedApiError";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import MessageBox from "@/components/common/MessageBox.vue";
import { Message, MessageType } from "@/core/CommonDefinition";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

@Component({
  components: { MessageBox, ConfirmPopup }
})
export default class ListeEditeurs extends Vue {
  disableForm: boolean = false;
  isExportLoading: boolean = false;
  rechercher: string = "";
  editeurs: Array<Editeur> = [];
  headers: Array<any> = [
    {
      text: "Date de création du compte éditeur",
      align: "start",
      value: "dateCreation",
      sortable: true
    },
    { text: "Nom de l'éditeur", value: "nom", sortable: true },
    { text: "Action", value: "action", sortable: false }
  ];
  confirmDeleteDialog: any = {};
  isAdmin: boolean = this.$store.getters.isAdmin();
  dataLoading: boolean = true;

  constructor() {
    super();
    if (!this.isAdmin) {
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      message.texte =
        "Vous n'êtes pas autorisé à exécuter l'action ListeEditeur";
      message.isSticky = true;
      this.$store.dispatch("openDisplayedMessage", message).catch(err => {
        Logger.error(err.toString());
      });
      this.$router.push({ name: "Home" }).catch(err => {
        Logger.error(err);
      });
    }
    this.fetchEditeurs();
  }

  fetchEditeurs(): void {
    editeurService
      .getEditeurs(this.$store.getters.getToken())
      .then(res => {
        this.editeurs = res;
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else if (err instanceof LicencesNationalesUnauthorizedApiError) {
          this.disableForm = true;
          message.texte =
            "Vous n'êtes pas autorisé à effectuer cette opération";
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          });
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      })
      .finally(() => {
        this.dataLoading = false;
      });
  }

  ajouterEditeur(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEditeur", new Editeur())
      .then(() => {
        this.$router.push({ name: "NouvelEditeur" });
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      });
  }

  modifierEditeur(item: Editeur): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$store
      .dispatch("setCurrentEditeur", item)
      .then(() => {
        this.$router.push({ name: "ModifierEditeur" });
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      });
  }

  downloadEditeurs(): void {
    this.isExportLoading = true;
    this.$store.dispatch("closeDisplayedMessage");
    const ids = new Array<number>();
    this.editeurs.forEach(element => {
      ids.push(element.id);
    });
    editeurService
      .downloadEditeurs(ids, this.$store.state.user.token)
      .then(response => {
        const fileURL = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/csv" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "export.csv");
        document.body.appendChild(fileLink);

        fileLink.click();
        this.isExportLoading = false;
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesBadRequestApiError) {
          message.texte = err.message;
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;

        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });

        this.isExportLoading = false;
      });
  }

  async supprimerEditeur(item: Editeur) {
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de supprimer le compte de l'éditeur ${item.nom}

                Etes-vous sûr de vouloir continuer ?`
    );
    if (confirmed) {
      editeurService
        .deleteEditeur(item.id, this.$store.getters.getToken())
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = `L'éditeur ${item.nom} a bien été supprimé`;
          message.isSticky = false;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse jusqu'au message
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          this.fetchEditeurs();
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          if (err instanceof LicencesNationalesBadRequestApiError) {
            message.texte = err.message;
          } else {
            message.texte = "Impossible d'exécuter l'action : " + err.message;
          }
          message.isSticky = true;

          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
        });
    }
  }
}
</script>
<style>
.v-data-table {
  background-color: transparent !important;
}

.theme--light .v-data-footer__icons-before .v-btn,
.theme--light .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-before .v-btn {
  background-color: transparent !important;
}
</style>
