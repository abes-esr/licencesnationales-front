<template>
  <v-container elevation="0">
    <v-form
      ref="formCreationCompte"
      class="elevation-0"
      :disabled="isDisableForm"
      autocomplete="on"
    >
      <h1 v-if="action === Action.CREATION" class="pl-3">
        Créer le compte de votre établissement
      </h1>
      <h1 v-if="action === Action.MODIFICATION" class="pl-3">
        {{ etablissement.nom }}
      </h1>
      <v-card>
      <h2
        v-if="action === Action.CREATION"
        @click="allerAConnexion"
        class="pl-3"
      >
        Votre établissement a déjà un compte ?
        <a class="bouton-simple elevation-0 large">S'authentifier</a>
        <v-icon>mdi-arrow-right-circle-outline </v-icon>
      </h2>
      <v-card-text>
        <v-col cols="12" md="6" lg="6" xl="6">
          <MessageBox />
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6" v-if="returnLink">
          <v-alert variant="outlined">
            <div>
              <a @click="allerPageAccueil()">
                <FontAwesomeIcon :icon="faReply" /> Revenir à la page
                d'accueil
              </a>
            </div>
          </v-alert>
        </v-col>
        <v-row v-if="action === Action.CREATION">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-alert variant="outlined" density="compact">
              <FontAwesomeIcon
                :icon="faTriangleExclamation"
                class="mx-2 icone-attention"
              />
              <h4 class="mb-1">
                Avant de créer votre compte, vérifier l'éligibilité de votre
                établissement
              </h4>
              <p>
                <strong>Attention : </strong>L'accès aux corpus sous licences
                nationales est réservé aux établissements bénéficiaires selon
                les conditions spécifiques négociées avec chaque éditeur. Pour
                permettre la déclaration des adresses IP autorisées, l'Abes met
                à la disposition des professionnels de la documentation cette
                application dédiée à la gestion des accès.
                <a
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#Beneficiaires"
                  target="_blank"
                  >Vérifier l'éligibilité de votre établissement.</a
                >
              </p>
              <v-checkbox
                required
                :rules="rulesForms.checkboxRules"
                label="Je confirme que mon établissement est éligible"
              />
            </v-alert>
          </v-col>
        </v-row>
        <div
          class="mx-9"
          v-if="
            (action === Action.MODIFICATION && isAdmin) ||
              action === Action.CREATION ||
              action === Action.FUSION ||
              action === Action.SCISSION
          "
        >
          <v-row>
            <v-card-title>Informations de l'établissement</v-card-title>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <div class="mx-9">
            <v-row>
              <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                <v-row>
                  <v-text-field
                    variant="outlined"
                    label="Nom de l'établissement"
                    placeholder="Nom de l'établissement"
                    name="organization"
                    autocomplete="organization"
                    v-model="etablissement.nom"
                    :rules="rulesForms.nomEtabRules"
                    :readonly="action === Action.MODIFICATION && !isAdmin"
                    required
                    @keyup.enter="validate"
                  />
                </v-row>
                <v-row>
                  <v-col :cols="12" class="pa-0">
                    <v-text-field
                      variant="outlined"
                      label="SIREN"
                      placeholder="SIREN"
                      maxlength="9"
                      name="siren"
                      autocomplete="on"
                      v-model="etablissement.siren"
                      :rules="rulesForms.siren"
                      required
                      @input="checkSiren"
                      @keyup.enter="validate"
                      :readonly="action === Action.MODIFICATION"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-chip
                    class="ma-2"
                    :class="checkSirenColor"
                    label
                    v-if="
                      action == Action.CREATION ||
                        action == Action.FUSION ||
                        action == Action.SCISSION
                    "
                  >
                    SIREN : {{ checkSirenAPI }}
                  </v-chip>
                </v-row>
                <v-row v-if="action == Action.MODIFICATION">
                  <v-text-field
                    variant="outlined"
                    label="ID Abes"
                    placeholder="ID Abes"
                    v-model="etablissement.idAbes"
                    readonly
                  />
                </v-row>
              </v-col>
              <v-col cols="0" md="1" lg="1" xl="1" class="pa-0"></v-col>
              <v-col cols="12" md="5" lg="5" xl="5" class="pa-1 pt-4">
                <v-row>
                  <v-select
                    variant="outlined"
                    v-model="etablissement.typeEtablissement"
                    :items="typesEtab"
                    label="Type d'établissement"
                    placeholder="Type d'établissement"
                    :readonly="action === Action.MODIFICATION && !isAdmin"
                    :rules="rulesForms.typeEtabRules"
                    required
                  />
                </v-row>
                <v-row>
                  <v-alert
                    variant="outlined"
                    v-if="action == Action.CREATION"
                    style="width: 100%"
                  >
                    <FontAwesomeIcon
                      :icon="faCircleInfo"
                      class="fa-2x mr-5 mb-1 icone-information"
                    />
                    <a
                      class="noUnderlineLink"
                      href="https://annuaire-entreprises.data.gouv.fr/"
                      target="_blank"
                      >Trouver le SIREN de votre établissement</a
                    >
                  </v-alert>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="mx-9">
          <v-card-title>
            Information Contact
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <Contact
            ref="formContact"
            :action="action"
            :contact="etablissement.contact"
            :isDisableForm="isDisableForm"
            class="mx-9"
          />
        </div>
      </v-card-text>
      <v-card-actions v-if="action !== Action.SCISSION">
        <v-spacer class="d-none d-sm-flex"></v-spacer>
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
          class="d-flex justify-space-around flex-wrap"
          style="float: right;"
        >
          <v-row>
            <v-btn
              @click="clear"
              :disabled="isDisableForm"
              variant="text"

            >
              Annuler</v-btn
            >
            
            <v-btn
              class="ml-4"
              :loading="buttonLoading"
              :disabled="isDisableForm"
              @click="validate"
              variant="elevated"
            >
              Enregistrer
              <v-icon class="pl-1">mdi-arrow-right-circle-outline</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Logger } from "@/utils/Logger";
import { serviceGouv } from "@/core/service/data.gouv/DataGouvApiService";
import { SirenNotFoundError } from "@/core/service/data.gouv/exception/SirenNotFoundError";
import { DataGouvApiError } from "@/core/service/data.gouv/exception/DataGouvApiError";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import Etablissement from "@/core/Etablissement";
import {
  Action as ActionEnum,
  Message,
  MessageType
} from "@/core/CommonDefinition";
import Contact from "@/components/etablissement/Contact.vue";
import { LicencesNationalesApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesApiError";
import MessageBox from "@/components/common/MessageBox.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useEtablissementStore } from "@/stores/etablissementStore";
import type { VForm } from "vuetify/components";
import { faCircleInfo, faReply, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface Props {
  action: ActionEnum | keyof typeof ActionEnum;
  listeSirenFusion?: Array<string>;
  triggerScission?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  listeSirenFusion: () => [],
  triggerScission: false
});
const emit = defineEmits<{
  (e: "send", value: Etablissement): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();
const etablissementStore = useEtablissementStore();

const action = computed<ActionEnum>(() =>
  typeof props.action === "string"
    ? ActionEnum[props.action as keyof typeof ActionEnum]
    : props.action
);

const etablissement = ref<Etablissement>(new Etablissement());

  etablissement.value = etablissementStore.getCurrentEtablissement;
  watch(
    () => etablissementStore.currentEtablissement,
    () => {
      etablissement.value = etablissementStore.getCurrentEtablissement;
    },
    { immediate: true }
  );

  watch(
    () => authStore.getEtablissementConnecte,
    () => {
      etablissementStore.setCurrentEtablissement(authStore.getEtablissementConnecte);
    },
    { immediate: true }
  );

const Action = ActionEnum;
const isAdmin = computed(() => authStore.isAdmin);
const tokenrecaptcha = ref("");
const typesEtab = ref<Array<string>>([]);
const checkSirenAPI = ref("En attente de vérification");
const checkSirenColor = ref("grey");
const buttonLoading = ref(false);
const isDisableForm = ref(false);
const returnLink = ref(false);

const formCreationCompte = ref<VForm | null>(null);
const formContact = ref<InstanceType<typeof Contact> | null>(null);

const metaInfo = () => {
  const titre =
    action.value === ActionEnum.CREATION
      ? "Inscription"
      : "Modification du compte";
  return {
    meta: [
      {
        name: "description",
        content:
          "Création de compte sur l'application des Licences Nationales"
      }
    ],
    title: `${titre} - Licences Nationales`
  };
};

const loadRecaptcha = async () => {
  const maybeRecaptchaLoaded = (globalThis as any).$recaptchaLoaded;
  if (maybeRecaptchaLoaded) {
    await maybeRecaptchaLoaded();
  }
};

const executeRecaptcha = async (action: string) => {
  const maybeRecaptcha = (globalThis as any).$recaptcha;
  if (maybeRecaptcha) {
    return await maybeRecaptcha(action);
  }
  return "";
};

const fetchListeType = async () => {
  messageStore.closeDisplayedMessage();
  try {
    const result = await etablissementService.listeType();
    isDisableForm.value = false;
    typesEtab.value = result;
  } catch (err: any) {
    Logger.error(err?.toString?.() ?? err);
    const message: Message = new Message();
    message.type = MessageType.ERREUR;
    if (err instanceof LicencesNationalesApiError) {
      isDisableForm.value = true;
      message.texte =
        "Fonctionnalité momentanement indisponible pour le moment. Réessayer plus tard";
    } else {
      message.texte =
        "Impossible d'exécuter l'action : " + (err?.message ?? "");
    }
    message.isSticky = true;
    try {
      messageStore.openDisplayedMessage(message);
    } catch (error: any) {
      Logger.error(error?.toString?.() ?? error);
    }
  }
};

const allerAConnexion = () => {
  messageStore.closeDisplayedMessage();
  router.push({ name: "Login" }).catch(err => {
    Logger.error(err);
  });
};

const allerPageAccueil = () => {
  router.push({ name: "Login" }).catch(err => {
    Logger.error(err);
  });
};

const scrollToMessage = () => {
  const messageBox = document.getElementById("messageBox");
  if (messageBox) {
    window.scrollTo(0, messageBox.offsetTop);
  }
};

const recaptcha = async () => {
  await loadRecaptcha();
  tokenrecaptcha.value = await executeRecaptcha("creationCompte");
};

const validate = async () => {
  buttonLoading.value = true;
  messageStore.closeDisplayedMessage();

  await recaptcha();

  const formValid = await formCreationCompte.value?.validate();
  const isFormValide = formValid?.valid ?? false;

  const isSubFormValide = formContact.value?.validate() ?? true;

  if (tokenrecaptcha.value != null) {
    if (isFormValide && isSubFormValide) {
      await send();
    } else {
      const message: Message = new Message();
      message.type = MessageType.ERREUR;
      message.texte = "Des champs ne remplissent pas les conditions";

      if (
        checkSirenAPI.value === "inconnu" ||
        checkSirenAPI.value === "Inconnu"
      ) {
        message.texte += "<br /> Le SIREN de l'établissement est inconnu";
      }

      message.isSticky = true;
      try {
        messageStore.openDisplayedMessage(message);
      } catch (err: any) {
        Logger.error(err?.toString?.() ?? err);
      }
      scrollToMessage();
    }
  }
  buttonLoading.value = false;
};

const send = async () => {
  buttonLoading.value = true;
  messageStore.closeDisplayedMessage();

  if (action.value == ActionEnum.CREATION) {
    etablissementService
      .creerEtablissement(etablissement.value, tokenrecaptcha.value)
      .then(() => {
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte =
          "Le compte a été enregistré. Pour y accéder, merci de vous authentifier";
        message.isSticky = true;
        returnLink.value = true;
        messageStore.openDisplayedMessage(message);
        router.push("/");
      })
      .catch(err => {
        Logger.error(err?.toString?.() ?? err);
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err?.message ?? "";
        message.isSticky = true;
        try {
          messageStore.openDisplayedMessage(message);
        } catch (error: any) {
          Logger.error(error?.toString?.() ?? error);
        }
        scrollToMessage();
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else if (action.value == ActionEnum.MODIFICATION) {
    etablissementService
      .updateEtablissement(
        etablissement.value,
        authStore.getToken,
        authStore.isAdmin
      )
      .then(() => {
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = "Votre compte a bien été modifié";
        message.isSticky = true;
        returnLink.value = true;
        messageStore.openDisplayedMessage(message);
        scrollToMessage();
        
        if (
          etablissement.value.siren ===
          authStore.getEtablissementConnecte.siren
        ) {
          etablissementStore.setEtablissementConnecte(etablissement.value);
        }
      })
      .catch(err => {
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err?.message ?? "";
        message.isSticky = true;
        try {
          messageStore.openDisplayedMessage(message);
        } catch (error: any) {
          Logger.error(error?.toString?.() ?? error);
        }
        scrollToMessage();
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else if (action.value === ActionEnum.FUSION) {
    etablissementService
      .fusion(authStore.getToken, {
        nouveauEtab: etablissement.value,
        sirenFusionnes: props.listeSirenFusion
      })
      .then(() => {
        clear();
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = "Fusion effectuée.";
        message.isSticky = true;
        returnLink.value = true;
        messageStore.openDisplayedMessage(message);
        router.push({ name: "ListeEtab" }).catch(err => {
          Logger.error(err);
        });
      })
      .catch(err => {
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err?.message ?? "";
        message.isSticky = true;
        try {
          messageStore.openDisplayedMessage(message);
        } catch (error: any) {
          Logger.error(error?.toString?.() ?? error);
        }
        scrollToMessage();
      })
      .finally(() => {
        buttonLoading.value = false;
      });
  } else if (action.value === ActionEnum.SCISSION) {
    emit("send", etablissement.value);
    buttonLoading.value = false;
  }
};

const checkSiren = async () => {
  messageStore.closeDisplayedMessage();
  checkSirenAPI.value = "En attente de vérification";
  if (etablissement.value.siren) {
    checkSirenAPI.value = "Vérification du SIREN en cours...";
    checkSirenColor.value = "siren-default";
    if (etablissement.value.siren.length === 9) {
      try {
        const data = await serviceGouv.checkSiren(etablissement.value.siren);
        checkSirenAPI.value = data;
        checkSirenColor.value = "siren-ok";
      } catch (err: any) {
        Logger.error(err);
        if (err instanceof SirenNotFoundError) {
          checkSirenAPI.value = "Inconnu";
          checkSirenColor.value = "siren-erreur";
        } else if (err instanceof DataGouvApiError) {
          checkSirenAPI.value =
            "Impossible de contacter le service de vérification du numéro SIREN";
          checkSirenColor.value = "siren-erreur";
        } else {
          checkSirenAPI.value = "Erreur interne : " + (err?.message ?? "");
          checkSirenColor.value = "red";
        }
      }
    }
  }
};

const clear = () => {
  messageStore.closeDisplayedMessage();
  formCreationCompte.value?.resetValidation();
  formContact.value?.clear();

  if (action.value === ActionEnum.MODIFICATION) {
    etablissementStore.setCurrentEtablissement(etablissement.value);
    router.push({ name: "Home" }).catch(err => {
      Logger.error(err);
    });
  } else {
    etablissement.value.reset();
    window.scrollTo(0, 0);
  }
};

watch(
  () => props.triggerScission,
  (value) => {
    if (action.value === ActionEnum.SCISSION && value) {
      validate();
    }
  }
);

onMounted(() => {
  fetchListeType();
  window.scrollTo(0, 0);
});
</script>
<style scoped lang="scss">
.v-card-text {
  border: 0;
}

.v-card-title {
  width: 100%;
}

.icone-attention {
  float: left;
}

.row {
  margin: 0 !important;
}
</style>
