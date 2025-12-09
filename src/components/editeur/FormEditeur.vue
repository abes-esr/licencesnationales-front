<template>
  <v-card class="elevation-0">
    <v-form
      ref="formEditeur"
      lazy-validation
      class="elevation-0"
      :disabled="isDisableForm"
    >
      <h1 v-if="action == Action.CREATION">Créer un éditeur</h1>
      <h1 v-else-if="action == Action.MODIFICATION">Modifier un éditeur</h1>
      <v-card-text class="elevation-0">
        <v-col cols="12" md="6" lg="6" xl="6"><MessageBox></MessageBox> </v-col>
        <v-col cols="12" md="6" lg="6" xl="6"> </v-col>
        <div class="mx-9">
          <v-row>
            <v-card-title>Information de l'éditeur</v-card-title>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <div class="mx-9">
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  outlined
                  label="NOM DE L'EDITEUR"
                  placeholder="NOM DE L'EDITEUR"
                  v-model="editeur.nom"
                  :rules="rulesForms.nom"
                  required
                  @keyup.enter="validate()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  outlined
                  label="Identifiant éditeur"
                  placeholder="Identifiant éditeur"
                  v-model="editeur.identifiantBis"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  v-model="editeur.groupesEtabRelies"
                  :items="typesEtab"
                  label="Groupes d'établissements reliés"
                  placeholder="Groupes d'établissements reliés"
                  persistent-placeholder
                  multiple
                  outlined
                >
                  <template v-slot:prepend-item>
                    <v-list-item ripple @click="toggle">
                      <v-list-item-action>
                        <v-icon
                          :color="
                            editeur.groupesEtabRelies.length > 0
                              ? 'indigo darken-4'
                              : ''
                          "
                        >
                          {{ iconEtab }}
                        </v-icon>
                      </v-list-item-action>
                        <v-list-item-title>
                          Tout sélectionner
                        </v-list-item-title>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  outlined
                  label="Adresse postale"
                  placeholder="Adresse postale"
                  v-model="editeur.adresse"
                  :rules="rulesForms.adresse"
                  required
                  @keyup.enter="validate()"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="mx-9">
          <v-card-title>
            Information Contact
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-row>
            <v-col
              cols="12"
              md="3"
              lg="3"
              xl="3"
              v-for="(contact, index) in editeur.contacts"
              :key="index"
            >
              <contact
                :ref="'contactForm_' + index"
                :contact="contact"
                @onChange="removeContact(contact)"
              ></contact>
            </v-col>
          </v-row>
        </div>
        <v-card flat>
          <v-card-title> {{ editeur.contacts.length }} contact(s)</v-card-title>
          <v-card-text> </v-card-text>

          <v-card-actions class="v-card__actions">
            <v-btn class="ma-2 btn-2" @click="addContact()">
              <FontAwesomeIcon :icon="['fas', 'plus']" class="mx-2" />
              Ajouter un contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-col
          cols="12"
          md="3"
          lg="3"
          xl="3"
          class="d-flex justify-space-around mr-16 flex-wrap"
        >
          <v-btn
            x-large
            @click="clear"
            class="bouton-annuler"
            :disabled="isDisableForm"
          >
            Annuler</v-btn
          >
          <v-btn
            color="button"
            :loading="buttonLoading"
            :disabled="isDisableForm"
            x-large
            @click="validate()"
            >Enregistrer
            <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Logger } from "@/utils/Logger";
import {
  Action,
  ContactType,
  Message,
  MessageType
} from "@/core/CommonDefinition";
import Editeur from "@/core/Editeur";
import Contact from "@/components/editeur/Contact.vue";
import ContactEditeur from "@/core/ContactEditeur";
import { editeurService } from "@/core/service/licencesnationales/EditeurService";
import MessageBox from "@/components/common/MessageBox.vue";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import { rulesForms } from "@/core/RulesForm";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

@Component({
  components: { MessageBox, Contact }
})
export default class ComposantEditeur extends Vue {
  editeur: Editeur;
  @Prop() action!: Action;
  Action: any = Action;
  rulesForms: any = rulesForms;
  typesEtab: Array<string> = [];
  buttonLoading: boolean = false;
  isDisableForm: boolean = false;

  constructor() {
    super();
    this.fetchListeType();
    this.editeur = this.getCurrentEditeur;
  }

  get getCurrentEditeur(): Editeur {
    return this.$store.getters.getCurrentEditeur();
  }

  get tousTypesEtab(): any {
    return this.editeur.groupesEtabRelies.length === this.typesEtab.length;
  }

  get certainsTypesEtab(): any {
    return this.editeur.groupesEtabRelies.length > 0 && !this.tousTypesEtab;
  }

  get iconEtab() {
    if (this.tousTypesEtab) return "mdi-close-box";
    if (this.certainsTypesEtab) return "mdi-minus-box";
    return "mdi-checkbox-blank-outline";
  }

  toggle(): void {
    this.$nextTick(() => {
      if (this.tousTypesEtab) {
        this.editeur.groupesEtabRelies = [];
      } else {
        this.editeur.groupesEtabRelies = this.typesEtab.slice();
      }
    });
  }

  async fetchListeType() {
    this.$store.dispatch("closeDisplayedMessage");
    await etablissementService
      .listeType()
      .then(result => {
        this.isDisableForm = false;
        this.typesEtab = result;
      })
      .catch(err => {
        Logger.error(err.toString());
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        if (err instanceof LicencesNationalesApiError) {
          this.isDisableForm = true;
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

  validate(): void {
    this.$store.dispatch("closeDisplayedMessage");

    // On vérifie le formulaire éditeur
    let isValide: boolean = (this.$refs.formEditeur as Vue & {
      validate: () => boolean;
    }).validate();

    const message: Message = new Message();
    message.type = MessageType.ERREUR;
    message.isSticky = true;

    // On vérifie les formulaires contacts
    let isSubFormValide: boolean = false;
    let countContactTechnique: number = 0;
    let countContactCommercial: number = 0;
    for (let index = 0; index < this.editeur.contacts.length; index++) {
      if (this.editeur.contacts[index].type == ContactType.TECHNIQUE) {
        countContactTechnique++;
      } else if (this.editeur.contacts[index].type == ContactType.COMMERCIAL) {
        countContactCommercial++;
      }
      isSubFormValide = this.$refs["contactForm_" + index][0].validate();
      if (!isValide || !isSubFormValide) {
        // Si le formulaire éditeur n'était pas valide, on garde à non valide
        isValide = false;
      } else {
        isValide = true;
      }
    }
    if (countContactCommercial === 0 || countContactTechnique === 0) {
      isValide = false;
      message.texte =
        " - Vous devez saisir au moins un contact technique et un contact commercial";
    }

    if (isValide) {
      this.send();
    } else {
      this.buttonLoading = false;
      message.texte = `Des champs ne remplissent pas les conditions :
      ${message.texte}`;
      message.isMultiline = true;
      this.$store.dispatch("openDisplayedMessage", message).catch(err => {
        Logger.error(err.toString());
      });
      // On glisse sur le message d'erreur
      const messageBox = document.getElementById("messageBox");
      if (messageBox) {
        window.scrollTo(0, messageBox.offsetTop);
      }
    }
  }

  addContact(): void {
    const contact = new ContactEditeur();
    this.editeur.addContact(contact);
  }

  removeContact(item: ContactEditeur): void {
    this.editeur.removeContact(item);
  }

  send(): void {
    this.buttonLoading = true;

    if (this.action == Action.CREATION) {
      editeurService
        .createEditeur(this.editeur, this.$store.getters.getToken())
        .then(() => {
          this.buttonLoading = false;
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = `L'éditeur a bien été créé`;
          message.isSticky = false;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse jusqu'au message
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          // On redirige après 2 secondes
          setTimeout(() => {
            this.$store.dispatch("closeDisplayedMessage");
            this.$router.push({ path: "/listeEditeurs" });
          }, 2000);
        })
        .catch(err => {
          this.buttonLoading = false;
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = `Impossible d'exécuter l'action :
           ${err.message}`;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse jusqu'au message
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        });
    } else if (this.action == Action.MODIFICATION) {
      editeurService
        .updateEditeur(this.editeur, this.$store.getters.getToken())
        .then(() => {
          this.buttonLoading = false;
          const message: Message = new Message();
          message.type = MessageType.VALIDATION;
          message.texte = `L'éditeur a bien été modifié`;
          message.isSticky = false;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse jusqu'au message
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
          // On redirige après 2 secondes
          setTimeout(() => {
            this.$store.dispatch("closeDisplayedMessage");
            this.$router.push({ path: "/listeEditeurs" });
          }, 2000);
        })
        .catch(err => {
          this.buttonLoading = false;
          Logger.error(err.toString());
          const message: Message = new Message();
          message.type = MessageType.ERREUR;
          message.texte = `Impossible d'exécuter l'action :
           ${err.message}`;
          message.isSticky = true;
          this.$store.dispatch("openDisplayedMessage", message).catch(err => {
            Logger.error(err.toString());
          });
          // On glisse jusqu'au message
          const messageBox = document.getElementById("messageBox");
          if (messageBox) {
            window.scrollTo(0, messageBox.offsetTop);
          }
        });
    }
  }

  clear() {
    this.buttonLoading = false;
    this.$store.dispatch("closeDisplayedMessage");
    // Reset des formulaires de contact
    for (let index = 0; index < this.editeur.contacts.length; index++) {
      // Formulaire contact
      this.$refs["contactForm_" + index][0].clear();
    }
    // Reset du formulaire éditeur
    (this.$refs.formEditeur as HTMLFormElement).resetValidation();

    this.editeur = this.getCurrentEditeur;
    window.scrollTo(0, 0);
  }
}
</script>
<style scoped lang="scss">
.v-card__text {
  border: 0;
}

.v-card__title {
  width: 100%;
}
</style>
