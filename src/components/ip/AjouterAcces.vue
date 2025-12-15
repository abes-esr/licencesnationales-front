<template>
  <div>
    <ConfirmPopup ref="confirm" />
    <v-form ref="formAjouterAcces">
      <v-row align="center" justify="center">
        <v-col lg="11" md="12" xs="12">
          <v-row>
            <v-card-title>
              <h1>
                Déclarer de nouvelles adresses ou plages IP
              </h1>
            </v-card-title>
          </v-row>
          <v-row>
            <v-col>
              <a @click="allerListeAcces">
                <FontAwesomeIcon :icon="faReply" />&nbsp;Revenir à la
                liste complète des IP
              </a>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" class="pa-0">
              <MessageBox class="mr-2" />
              <v-card-title class="pb-0">
                Choisir le type d'IP à déclarer
              </v-card-title>
            </v-col>
            <v-col cols="12" md="4" class="pa-3">
              <v-card-text class="fondGris">
                <FontAwesomeIcon
                  :icon="faCircleInfo"
                  size="2x"
                  style="color: #478dcb;"
                />
                <a
                  href="https://documentation.abes.fr/aidelicencesnationales/index.html#TutoDeDeclarationDesIP"
                  target="_blank"
                  class="pl-3 pb-6 text-body-1 font-weight-bold"
                  >Consulter l'aide pour la déclaration des IP</a
                >
              </v-card-text>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8" class="pb-0">
              <v-divider />
              <div id="radioIP">
                <v-radio-group
                  v-model="typeIp"
                  inline
                  @change="
                    clearChild(true);
                    clearChild(false);
                  "
                >
                  <v-radio
                    v-for="n in 2"
                    :key="n"
                    :label="typesIp[n - 1]"
                    :value="typesIp[n - 1]"
                  />
                </v-radio-group>
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="8">
              <ModuleSegmentsIpPlage
                :typeIp="typeIp"
                typeAcces="ip"
                ref="ip"
                @FormModuleSegmentsIpPlageEvent="validate"
                @alertSuccess="alertSuccess"
                @alertError="alertError"
                @focus="clearChild(false)"
              />
              <br />
              <ModuleSegmentsIpPlage
                :typeIp="typeIp"
                typeAcces="plage"
                ref="plage"
                @FormModuleSegmentsIpPlageEvent="validate"
                @alertSuccess="alertSuccess"
                @alertError="alertError"
                @focus="clearChild(true)"
              />
            </v-col>
            <v-col cols="4">
              <v-card-text class="overflow-auto fondGris">
                <h2 class="pb-4">Nouvelles IP ou plages IP ajoutées</h2>
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th style="width: 20%">Type</th>
                      <th>Adresse</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in arrayAjouterIp"
                      :key="item.id ?? index"
                    >
                      <td>{{ item.typeIp }}</td>
                      <td>{{ item.ip }}</td>
                      <td>
                        <v-btn
                          class="ma-0 pa-0 bouton-simple"
                          variant="text"
                          icon
                          title="Supprimer"
                          @click="supprimerIP(item.id, index)"
                        >
                          <FontAwesomeIcon
                            :icon="faXmark"
                            class="fa-orange"
                          />
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
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
import ModuleSegmentsIpPlage from "@/components/ip/ModuleSegmentsIpPlage.vue";
import { iPService } from "@/core/service/licencesnationales/IPService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { Logger } from "@/utils/Logger";
import MessageBox from "@/components/common/MessageBox.vue";
import { Message, MessageType } from "@/core/CommonDefinition";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";
import { faCircleInfo, faReply, faXmark } from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const typeIp = ref<string>("IPV4");
const typesIp = ["IPV4", "IPV6"];
const arrayAjouterIp = ref<Array<any>>([]);

const formAjouterAcces = ref<VForm | null>(null);
const confirm = ref<InstanceType<typeof ConfirmPopup> | null>(null);
const ip = ref<InstanceType<typeof ModuleSegmentsIpPlage> | null>(null);
const plage = ref<InstanceType<typeof ModuleSegmentsIpPlage> | null>(null);

const metaInfo = {
  meta: [
    {
      name: "description",
      content:
        "Page de déclaration d'IP de l'application des Licences Nationales"
    }
  ],
  title: "Ajout d'IP - Licences Nationales"
};

const validate = (payloadFromModuleSegmentsIpPlage: any): void => {
  arrayAjouterIp.value.push(payloadFromModuleSegmentsIpPlage);
};

const clear = () => {
  arrayAjouterIp.value = [];
  formAjouterAcces.value?.resetValidation();
};

const supprimerIP = async (idIP: string, index: number) => {
  const confirmed = await confirm.value?.open(
    `Vous êtes sur le point de supprimer définitivement une adresse IP ou une plage d'adresses IP.

                Etes-vous sûr de vouloir effectuer cette action ?`
  );
  if (confirmed) {
    iPService
      .deleteIP(authStore.getToken, idIP)
      .then(response => {
        const message: Message = new Message();
        message.type = MessageType.VALIDATION;
        message.texte = response.data.message;
        message.isSticky = true;
        messageStore.openDisplayedMessage(message);
        scrollToMessage();

        setTimeout(() => {
          messageStore.closeDisplayedMessage();
        }, 5000);
        arrayAjouterIp.value.splice(index, 1);
      })
      .catch(err => {
        Logger.error(err?.toString?.() ?? err);
        const message: Message = new Message();
        message.type = MessageType.ERREUR;
        message.texte = err?.response?.data?.message ?? "";
        message.isSticky = true;
        messageStore.openDisplayedMessage(message);
        scrollToMessage();
      });
  }
};

const alertSuccess = (evt: string) => {
  const message: Message = new Message();
  message.type = MessageType.VALIDATION;
  message.texte = evt;
  message.isSticky = true;
  messageStore.openDisplayedMessage(message);
  scrollToMessage();

  setTimeout(() => {
    messageStore.closeDisplayedMessage();
  }, 5000);
};

const alertError = (evt: string) => {
  const message: Message = new Message();
  message.type = MessageType.ERREUR;
  message.texte = evt;
  message.isSticky = true;
  messageStore.openDisplayedMessage(message);
  scrollToMessage();
};

const clearChild = (isPlage: boolean) => {
  if (isPlage) {
    ip.value?.clear(false);
  } else {
    plage.value?.clear(false);
  }
};

const scrollToMessage = () => {
  const messageBox = document.getElementById("messageBox");
  if (messageBox) {
    window.scrollTo(0, messageBox.offsetTop);
  }
};

const allerListeAcces = () => {
  router.push({ path: "/listeAcces" });
};
</script>
<style scoped>
h1 {
  font-size: 30px;
}

#radioIP {
  padding-left: 20px !important;
}

#fillHeight {
  height: 80%;
}
</style>
