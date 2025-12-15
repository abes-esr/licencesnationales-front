<template>
  <div>
    <v-form ref="formRef">
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="2" xs="0" />
            <v-col cols="8" xs="12">
              <v-card-title>Scission d'établissements</v-card-title>
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-card-title>
                      Siren de l'établissement à scinder
                    </v-card-title>
                    <v-col cols="3">
                      <v-text-field
                        variant="outlined"
                        label="SIREN"
                        placeholder="SIREN"
                        v-model="sirenEtab"
                        :rules="rulesForms.siren"
                        class="pt-6"
                        required
                        @keyup.enter="validateForm"
                      />
                    </v-col>
                  </v-row>

                  <v-card-actions>
                    <h3>Nombre d'établissements : {{ etablissementNumber }}</h3>
                    <v-btn variant="flat" @click="increaseEtablissementNumber">
                      Ajouter un etablissement
                    </v-btn>
                    <v-btn variant="flat" @click="decreaseEtablissementNumber">
                      Supprimer un etablissement
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
              <form-etablissement
                :action="Action.SCISSION"
                :trigger-scission="triggerScission"
                @send="send"
                v-for="n in etablissementNumber"
                :key="n"
              ></form-etablissement>
              <v-card-actions class="v-card-actions">
                <v-row>
                  <v-spacer class="hidden-sm-and-down"></v-spacer>
                  <v-col
                    cols="12"
                    md="3"
                    lg="3"
                    xl="3"
                    class="d-flex justify-space-around mr-16 flex-wrap"
                  >
                    <v-btn
                      @click="triggerChildrenForm"
                      :loading="buttonLoading"
                      size="large"
                      color="button"
                    >
                      Enregistrer
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <br />
  </div>
</template>
<style src="./style.css"></style>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import FormEtablissement from "@/components/etablissement/FormEtablissement.vue";
import { Logger } from "@/utils/Logger";
import { etablissementService } from "@/core/service/licencesnationales/EtablissementService";
import { rulesForms } from "@/core/RulesForm";
import { Action, Message, MessageType } from "@/core/CommonDefinition";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";

const authStore = useAuthStore();
const messageStore = useMessageStore();
const router = useRouter();

const sirenEtab = ref("");
const etablissementNumber = ref(2);
const etablissementDTOS = ref<Array<any>>([]);
const buttonLoading = ref(false);
const triggerScission = ref(false);
const formRef = ref();

function triggerChildrenForm(): void {
  triggerScission.value = true;
}

async function send(payload: any): Promise<void> {
  buttonLoading.value = true;
  etablissementDTOS.value.push(payload);

  if (etablissementDTOS.value.length !== etablissementNumber.value) {
    return;
  }

  const validation = await formRef.value?.validate();
  const isValid =
    typeof validation === "boolean" ? validation : validation?.valid;

  if (isValid) {
    etablissementService
      .scission(authStore.getToken, {
        sirenScinde: sirenEtab.value.trim(),
        nouveauxEtabs: etablissementDTOS.value
      })
      .then(() => {
        const message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = "Scission effectuée.";
        message.isSticky = true;
        messageStore.openDisplayedMessage(message);
        router.push({ name: "ListeEtab" }).catch(err => {
          Logger.error(err);
        });
      })
      .catch((err: any) => {
        const message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err.response?.data?.message ?? err.message;
        message.isSticky = true;
        messageStore.openDisplayedMessage(message);
        const messageBox = document.getElementById("messageBox");
        if (messageBox) {
          window.scrollTo(0, messageBox.offsetTop);
        }
      })
      .finally(() => {
        buttonLoading.value = false;
        triggerScission.value = false;
        etablissementDTOS.value = [];
      });
  } else {
    buttonLoading.value = false;
    triggerScission.value = false;
    etablissementDTOS.value = [];
  }
}

function validateForm() {
  formRef.value?.validate();
}

function increaseEtablissementNumber() {
  etablissementNumber.value++;
}

function decreaseEtablissementNumber() {
  if (etablissementNumber.value > 2) etablissementNumber.value--;
}

defineExpose({ formRef });
</script>
