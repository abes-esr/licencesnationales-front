<template>
  <v-card class="elevation-0">
    <v-form
      ref="formEditeurRef"
      validate-on="lazy"
      class="elevation-0"
      :disabled="isDisableForm"
    >
      <h1 v-if="action === Action.CREATION">Créer un éditeur</h1>
      <h1 v-else-if="action === Action.MODIFICATION">Modifier un éditeur</h1>
      <v-card-text class="elevation-0">
        <v-col cols="12" md="6" lg="6" xl="6"><MessageBox /> </v-col>
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
                  variant="outlined"
                  label="NOM DE L'EDITEUR"
                  placeholder="NOM DE L'EDITEUR"
                  v-model="editeur.nom"
                  :rules="rulesForms.nom"
                  required
                  @keyup.enter="validate"
                />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  variant="outlined"
                  label="Identifiant éditeur"
                  placeholder="Identifiant éditeur"
                  v-model="editeur.identifiantBis"
                />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select
                  v-model="editeur.groupesEtabRelies"
                  :items="typesEtab"
                  label="Groupes d'établissements reliés"
                  placeholder="Groupes d'établissements reliés"
                  persistent-placeholder
                  multiple
                  variant="outlined"
                >
                  <template #prepend-item>
                    <v-list-item @click="toggle">
                      <template #prepend>
                        <v-icon
                          :color="
                            editeur.groupesEtabRelies.length > 0
                              ? 'indigo darken-4'
                              : ''
                          "
                        >
                          {{ iconEtab }}
                        </v-icon>
                      </template>
                      <v-list-item-title>Tout sélectionner</v-list-item-title>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  variant="outlined"
                  label="Adresse postale"
                  placeholder="Adresse postale"
                  v-model="editeur.adresse"
                  :rules="rulesForms.adresse"
                  required
                  @keyup.enter="validate"
                />
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
                :ref="el => contactRefs[index] = el"
                :contact="contact"
                @onChange="removeContact(contact)"
              />
            </v-col>
          </v-row>
        </div>
        <v-card variant="flat">
          <v-card-title> {{ editeur.contacts.length }} contact(s)</v-card-title>
          <v-card-text> </v-card-text>

          <v-card-actions class="v-card-actions">
            <v-btn class="ma-2" variant="tonal" @click="addContact">
              <FontAwesomeIcon :icon="faPlus" class="mx-2" />
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
            size="large"
            @click="clear"
            variant="outlined"
            :disabled="isDisableForm"
          >
            Annuler
          </v-btn>
          <v-btn
            color="button"
            :loading="buttonLoading"
            :disabled="isDisableForm"
            size="large"
            @click="validate"
            variant="elevated"
          >
            Enregistrer
            <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
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
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useEditeurStore } from "@/stores/editeurStore";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
  action: Action;
}>();

const authStore = useAuthStore();
const messageStore = useMessageStore();
const editeurStore = useEditeurStore();
const router = useRouter();

const editeur = ref<Editeur>(editeurStore.getCurrentEditeur);
const typesEtab = ref<Array<string>>([]);
const buttonLoading = ref(false);
const isDisableForm = ref(false);
const formEditeurRef = ref();
const contactRefs = ref<any[]>([]);

const iconEtab = computed(() => {
  if (tousTypesEtab.value) return "mdi-close-box";
  if (certainsTypesEtab.value) return "mdi-minus-box";
  return "mdi-checkbox-blank-outline";
});

const tousTypesEtab = computed(
  () => editeur.value.groupesEtabRelies.length === typesEtab.value.length
);
const certainsTypesEtab = computed(
  () => editeur.value.groupesEtabRelies.length > 0 && !tousTypesEtab.value
);

onMounted(() => {
  fetchListeType();
});

async function fetchListeType() {
  messageStore.closeDisplayedMessage();
  try {
    const result = await etablissementService.listeType();
    isDisableForm.value = false;
    typesEtab.value = result;
  } catch (err: any) {
    Logger.error(err.toString());
    const message = new Message();
    message.type = MessageType.ERREUR;
    if (err instanceof LicencesNationalesApiError) {
      isDisableForm.value = true;
      message.texte =
        "Fonctionnalité momentanement indisponible pour le moment. Réessayer plus tard";
    } else {
      message.texte = "Impossible d'exécuter l'action : " + err.message;
    }
    message.isSticky = true;
    messageStore.openDisplayedMessage(message);
  }
}

function toggle(): void {
  requestAnimationFrame(() => {
    if (tousTypesEtab.value) {
      editeur.value.groupesEtabRelies = [];
    } else {
      editeur.value.groupesEtabRelies = typesEtab.value.slice();
    }
  });
}

async function validate(): Promise<void> {
  messageStore.closeDisplayedMessage();
  buttonLoading.value = true;

  const validationResult = await formEditeurRef.value?.validate();
  let isValide =
    typeof validationResult === "boolean"
      ? validationResult
      : validationResult?.valid;

  const message = new Message();
  message.type = MessageType.ERREUR;
  message.isSticky = true;

  let isSubFormValide = true;
  let countContactTechnique = 0;
  let countContactCommercial = 0;

  editeur.value.contacts.forEach((contact, index) => {
    console.log("🚀 ~ validate ~ contact:", contact)
    if (contact.type == ContactType.TECHNIQUE) {
      countContactTechnique++;
    } else if (contact.type == ContactType.COMMERCIAL) {
      countContactCommercial++;
    }
    const isContactValid = contactRefs.value[index]?.validate?.() ?? false;
    console.log("🚀 ~ validate ~ contactRefs:", contactRefs.value.length)
    console.log("🚀 ~ validate ~ isValide1:", isValide)
    console.log("🚀 ~ validate ~ isContactValid:", isContactValid, contactRefs.value[index])
    if (!isValide || !isContactValid) {
      isValide = false;
      isSubFormValide = false;
    }
  });
  console.log("🚀 ~ validate ~ editeur:", editeur)

  

  if (countContactCommercial === 0 || countContactTechnique === 0) {
    isValide = false;
    message.texte =
      " - Vous devez saisir au moins un contact technique et un contact commercial";
  }

  console.log("🚀 ~ validate ~ isValide2:", isValide)
  console.log("🚀 ~ validate ~ isSubFormValide:", isSubFormValide)
  if (isValide && isSubFormValide) {
    send();
  } else {
    buttonLoading.value = false;
    message.texte = `Des champs ne remplissent pas les conditions :
      ${message.texte}`;
    message.isMultiline = true;
    messageStore.openDisplayedMessage(message);
    const messageBox = document.getElementById("messageBox");
    if (messageBox) {
      window.scrollTo(0, messageBox.offsetTop);
    }
  }
}

function addContact(): void {
  const contact = new ContactEditeur();
  editeur.value.addContact(contact);
}

function removeContact(item: ContactEditeur): void {
  editeur.value.removeContact(item);
}

function send(): void {
  if (props.action === Action.CREATION) {
    editeurService
      .createEditeur(editeur.value, authStore.getToken)
      .then(() => {
        buttonLoading.value = false;
        const message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = `L'éditeur a bien été créé`;
        message.isSticky = false;
        messageStore.openDisplayedMessage(message);
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
        setTimeout(() => {
          messageStore.closeDisplayedMessage();
          router.push({ path: "/listeEditeurs" });
        }, 2000);
      })
      .catch(err => {
        buttonLoading.value = false;
        Logger.error(err.toString());
        const message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = `Impossible d'exécuter l'action :
           ${err.message}`;
        message.isSticky = true;
        messageStore.openDisplayedMessage(message);
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      });
  } else if (props.action === Action.MODIFICATION) {
    editeurService
      .updateEditeur(editeur.value, authStore.getToken)
      .then(() => {
        buttonLoading.value = false;
        const message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = `L'éditeur a bien été modifié`;
        message.isSticky = false;
        messageStore.openDisplayedMessage(message);
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
        setTimeout(() => {
          messageStore.closeDisplayedMessage();
          router.push({ path: "/listeEditeurs" });
        }, 2000);
      })
      .catch(err => {
        buttonLoading.value = false;
        Logger.error(err.toString());
        const message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = `Impossible d'exécuter l'action :
           ${err.message}`;
        message.isSticky = true;
        messageStore.openDisplayedMessage(message);
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      });
  }
}

function clear() {
  buttonLoading.value = false;
  messageStore.closeDisplayedMessage();
  contactRefs.value.forEach(refItem => refItem?.clear?.());
  formEditeurRef.value?.resetValidation?.();
  editeur.value = editeurStore.getCurrentEditeur;
  window.scrollTo(0, 0);
}
</script>

<style scoped lang="scss">
.v-card-text {
  border: 0;
}

.v-card-title {
  width: 100%;
}
</style>
