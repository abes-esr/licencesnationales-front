<template>
  <v-card flat>
    <h1>Etablissement {{ etablissement.nom }}</h1>
    <v-col cols="12" md="6" lg="6" xl="6" class="pa-1">
      <MessageBox></MessageBox>
      <ConfirmPopup ref="confirm"></ConfirmPopup>
    </v-col>
    <v-container class="mx-9 elevation-0 pt-0">
      <v-col
        cols="12"
        class="d-flex align-content-start justify-space-between flex-wrap mx-0 px-0 py-0"
      >
        <v-card-title class="px-0"
          >Information du compte
          <v-tooltip top max-width="20vw" open-delay="100">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                @click="downloadEtablissement"
                class="bouton-simple"
                v-on="on"
                :loading="isExportLoading"
              >
                <FontAwesomeIcon
                  :icon="['fas', 'download']"
                  class="mx-2 fa-lg"
                />
              </v-btn>
            </template>
            <span>Exporter les infos du compte</span>
          </v-tooltip>
        </v-card-title>

        <v-btn class="btn-2 mt-3" @click="allerAIPs()"
          >Voir la liste des IPs
          <v-icon class="ml-2">mdi-ip-network</v-icon></v-btn
        >
      </v-col>
      <span class="d-block"
        >Compte créé le :
        {{ etablissement.dateCreation.toLocaleDateString() }}</span
      >
      <v-btn
        v-if="this.modificationModeDisabled"
        class="btn-2 mt-3"
        style="margin-right: 1em"
        @click="entrerEnModification()"
        >Modifier le compte</v-btn
      >
      <v-btn
        v-if="!this.modificationModeDisabled"
        class="btn-2 mt-3"
        @click="validerModifications()"
        style="margin-right: 1em"
        color="success"
        >Valider les modifications du compte</v-btn
      >
      <v-btn
        v-if="!this.modificationModeDisabled"
        class="btn-2 mt-3"
        @click="annulerModifications()"
        >Réinitialiser les champs d'origine</v-btn
      >
      <v-btn
        v-if="
          this.modificationModeDisabled && getEtablissement.statut !== 'Validé'
        "
        class="btn-2  mt-3"
        style="margin-right: 1em"
        :loading="buttonValidationLoading"
        @click="validerEtablissement()"
        >Valider le compte</v-btn
      >
      <v-btn
        v-if="
          this.modificationModeDisabled && getEtablissement.statut === 'Validé'
        "
        class="btn-5  mt-3"
        :loading="buttonValidationLoading"
        @click="devaliderEtablissement()"
        >Dévalider le compte</v-btn
      >
      <v-row class="d-flex justify-space-between flex-wrap ma-0">
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="mb-3">Etablissement</h2>
              <v-tooltip top max-width="20vw" open-delay="100" v-if="!isAdmin">
                <template v-slot:activator="{ on }">
                  <FontAwesomeIcon
                    v-on="on"
                    :icon="['fas', 'lock']"
                    class="fa-2x mx-2"
                  />
                </template>
                <span>Non modifiable par l'utilisateur</span>
              </v-tooltip>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <v-text-field
                label="Siren"
                placeholder="Siren"
                outlined
                v-model="etablissement.siren"
                :readonly="true"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Nom de l'établissement"
                placeholder="Nom de l'établissement"
                outlined
                v-model="etablissement.nom"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="ID Abes"
                placeholder="ID Abes"
                outlined
                v-model="etablissement.idAbes"
                :readonly="true"
                class="mt-1"
              ></v-text-field>
              <v-select
                label="Type d'établissement"
                :items="typesEtab"
                outlined
                v-model="etablissement.typeEtablissement"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-select>
              <div class="mt-1">
                <h3 class="d-inline">Statut de l'établissement:</h3>
                {{ etablissement.statut }}
              </div>
              <div class="mt-1">
                <h3 class="d-inline">Statut IP :</h3>
                {{ etablissement.statutIP }}
              </div>
            </div>
          </v-card-text>
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
          class="d-flex align-content-start justify-center flex-wrap"
        >
          <v-card-text class="d-flex justify-space-between flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="mb-3">Contact</h2>
            </div>
            <div class="d-flex flex-column justify-start mx-3 my-3 bloc-info">
              <v-text-field
                label="Nom du contact"
                placeholder="Nom du contact"
                outlined
                v-model="etablissement.contact.nom"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Prénom du contact"
                placeholder="Prénom du contact"
                outlined
                v-model="etablissement.contact.prenom"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Téléphone du contact"
                placeholder="Téléphone du contact"
                outlined
                v-model="etablissement.contact.telephone"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Mail du contact"
                placeholder="Mail du contact"
                outlined
                v-model="etablissement.contact.mail"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Adresse du contact"
                placeholder="Adresse du contact"
                outlined
                v-model="etablissement.contact.adresse"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="BP du contact"
                placeholder="BP du contact"
                outlined
                v-model="etablissement.contact.boitePostale"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Code Postal du contact"
                placeholder="Code Postal du contact"
                outlined
                v-model="etablissement.contact.codePostal"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Ville du contact"
                placeholder="Ville du contact"
                outlined
                v-model="etablissement.contact.ville"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
              <v-text-field
                label="Cedex du contact"
                placeholder="Cedex du contact"
                outlined
                v-model="etablissement.contact.cedex"
                :readonly="this.modificationModeDisabled"
                class="mt-1"
              ></v-text-field>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="button"
            class="bouton-supprimer"
            :loading="buttonSuppresionLoading"
            @click="supprimerEtablissement()"
            >Supprimer le compte
          </v-btn></v-col
        >
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageBox from "@/components/common/MessageBox.vue";
import Etablissement from "@/core/Etablissement";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

@Component({
  components: { ConfirmPopup, MessageBox }
})
export default class CardEtablissement extends Vue {
  etablissement: Etablissement;
  Action: any = Action;
  isAdmin: boolean = this.$store.getters.isAdmin();
  buttonValidationLoading: boolean = false;
  buttonSuppresionLoading: boolean = false;
  isExportLoading: boolean = false;
  typesEtab: Array<string> = [];
  modificationModeDisabled: boolean = true;
  selectStatut: Array<string> = ["Nouveau", "Validé"];

  constructor() {
    super();
    this.fetchListeType();
    this.etablissement = this.getEtablissement;
    this.modificationModeDisabled = true;

    if (!this.isAdmin) {
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      message.texte =
        "Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissemnt";
      message.isSticky = true;
      this.$store.dispatch("openDisplayedMessage", message).catch(err => {
        Logger.error(err.toString());
      });
      this.$router.push({ name: "Home" }).catch(err => {
        Logger.error(err);
      });
    }
  }

  async fetchListeType() {
    await etablissementService
      .listeType()
      .then(result => {
        this.typesEtab = result;
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesApiError) {
          message.texte =
            "Fonctionnalité momentanement indisponible pour le moment. Réessayer plus tard";
        } else {
          message.texte = "Impossible d'exécuter l'action : " + err.message;
        }
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
      });
  }

  get getEtablissement(): Etablissement {
    return this.$store.getters.getCurrentEtablissement();
  }

  allerAModifierEtablissement(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "ModifierEtablissement" });
  }

  allerAIPs(): void {
    this.$store.dispatch("closeDisplayedMessage");
    this.$router.push({ name: "ListeIP" });
  }

  async supprimerEtablissement() {
    this.buttonSuppresionLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `ATTENTION : Vous êtes sur le point de supprimer définitivement le compte de l'établissement ${this.etablissement.nom} avec toutes les informations associés (les des IPs,...)


      Etes-vous sûr de vouloir effectuer cette ation ?`
    );
    if (confirmed) {
      etablissementService
        .deleteEtab(this.etablissement.siren, this.$store.getters.getToken())
        .then(() => {
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = "Le compte a bien été créé supprimé";
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          setTimeout(() => {
            this.$store.dispatch("closeDisplayedMessage");
            this.$router.push({ name: "ListeEtab" }).catch(err => {
              Logger.error(err.toString());
            });
          }, 4000);
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = err.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .finally(() => {
          this.buttonSuppresionLoading = false;
        });
    } else {
      this.buttonSuppresionLoading = false;
    }
  }

  async validerEtablissement() {
    this.buttonValidationLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de valider le compte de l'établissement ${this.etablissement.nom}

      Etes-vous sûr de vouloir effectuer cette ation ?`
    );
    if (confirmed) {
      this.etablissement.statut = "Validé";
      etablissementService
        .validerEtablissement(
          this.etablissement.siren,
          this.$store.getters.getToken()
        )
        .then(response => {
          this.$store.dispatch(
            "updateCurrentEtablissement",
            this.etablissement
          );

          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = response.data.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = err.response.data.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .finally(() => {
          this.buttonValidationLoading = false;
        });
    } else {
      this.buttonValidationLoading = false;
    }
  }

  async devaliderEtablissement() {
    this.buttonValidationLoading = true;
    this.$store.dispatch("closeDisplayedMessage");

    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de dévalider le compte de l'établissement ${this.etablissement.nom}

      Etes-vous sûr de vouloir effectuer cette ation ?`
    );
    if (confirmed) {
      this.etablissement.statut = "Nouveau";
      etablissementService
        .devaliderEtablissement(
          this.etablissement.siren,
          this.$store.getters.getToken()
        )
        .then(response => {
          this.$store.dispatch(
            "updateCurrentEtablissement",
            this.etablissement
          );

          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = response.data.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .catch(err => {
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = err.response.data.message;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse sur le message d'erreur
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        })
        .finally(() => {
          this.buttonValidationLoading = false;
        });
    } else {
      this.buttonValidationLoading = false;
    }
  }

  clear() {
    this.$store.dispatch("closeDisplayedMessage");

    this.$router.push({ name: "ListeEtab" }).catch(err => {
      Logger.error(err);
    });
  }

  entrerEnModification(): void {
    this.modificationModeDisabled = false;
  }

  validerModifications(): void {
    etablissementService
      .updateEtablissement(
        this.etablissement,
        this.$store.getters.getToken(),
        this.$store.getters.isAdmin()
      )
      .then(() => {
        this.$store.dispatch("updateCurrentEtablissement", this.etablissement); //Enregistrement en store
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err.message;
        message.isSticky = true;
        this.$store.dispatch("openDisplayedMessage", message).catch(err => {
          Logger.error(err.toString());
        });
        // On glisse sur le message d'erreur
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      })
      .finally(() => {
        this.modificationModeDisabled = true;
      }); //Envoie au back et validation en BDD
  }

  downloadEtablissement(): void {
    this.isExportLoading = true;
    this.$store.dispatch("closeDisplayedMessage");
    const siren = new Array<string>();
    siren.push(this.etablissement.siren);
    etablissementService
      .downloadEtablissements(siren, this.$store.state.user.token)
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

  annulerModifications(): void {
    this.etablissement = this.$store.getters.getCurrentEtablissement();
  }
}
</script>
<style scoped lang="scss">
.container {
  width: auto !important;
}

.block-content {
  height: 100%;
}

.bloc-info div {
  margin-top: 1rem;
}

.titre-block {
  width: 100%;
  min-height: 60px;
}

.multi-line span {
  min-height: 1rem;
}
</style>
