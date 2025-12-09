<template>
  <div>
    <ConfirmPopup ref="confirm"></ConfirmPopup>
    <v-form ref="formAjouterAcces" lazy-validation>
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
              <a @click="$router.push({ path: '/listeAcces' })">
                <FontAwesomeIcon :icon="['fas', 'reply']" />&nbsp;Revenir à la
                liste complète des IP
              </a>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" class="pa-0">
              <MessageBox class="mr-2"></MessageBox>
              <v-card-title class="pb-0">
                Choisir le type d'IP à déclarer
              </v-card-title>
            </v-col>
            <v-col cols="12" md="4" class="pa-3">
              <v-card-text class="fondGris">
                <FontAwesomeIcon
                  :icon="['fas', 'info-circle']"
                  size="2x"
                  style="color: #478dcb;"
                /><a
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
              <v-divider></v-divider>
              <div id="radioIP">
                <v-radio-group
                  v-model="typeIp"
                  @change="
                    clearChild(true);
                    clearChild(false);
                  "
                  mandatory
                  row
                >
                  <v-radio
                    v-for="n in 2"
                    :key="n"
                    :label="typesIp[n - 1]"
                    :value="typesIp[n - 1]"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col cols="8">
              <module-segments-ip-plage
                :typeIp="typeIp"
                typeAcces="ip"
                ref="ip"
                v-on:FormModuleSegmentsIpPlageEvent="validate"
                v-on:alertSuccess="alertSuccess"
                v-on:alertError="alertError"
                v-on:focus="clearChild(false)"
              >
              </module-segments-ip-plage>
              <br />
              <module-segments-ip-plage
                :typeIp="typeIp"
                typeAcces="plage"
                ref="plage"
                v-on:FormModuleSegmentsIpPlageEvent="validate"
                v-on:alertSuccess="alertSuccess"
                v-on:alertError="alertError"
                v-on:focus="clearChild(true)"
              >
              </module-segments-ip-plage>
            </v-col>
            <v-col cols="4">
              <v-card-text flat class="overflow-auto fondGris">
                <h2 class="pb-4">Nouvelles IP ou plages IP ajoutées</h2>
                <v-simple-table dense>
                  <template v-slot:default>
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
                        :key="item.ip"
                      >
                        <td>{{ item.typeIp }}</td>
                        <td>{{ item.ip }}</td>
                        <td>
                          <v-btn
                            class="ma-0 pa-0 bouton-simple "
                            icon
                            title="Supprimer"
                            @click="supprimerIP(item.id, index)"
                          >
                            <FontAwesomeIcon
                              :icon="['fas', 'times']"
                              class="fa-orange"
                            />
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
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
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ModuleSegmentsIpPlage from "@/components/ip/ModuleSegmentsIpPlage.vue";
import { iPService } from "@/core/service/licencesnationales/IPService";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { Logger } from "@/utils/Logger";
import MessageBox from "@/components/common/MessageBox.vue";
import { Message, MessageType } from "@/core/CommonDefinition";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

@Component({
  components: { ModuleSegmentsIpPlage, ConfirmPopup, MessageBox }
})
export default class AjouterAcces extends Vue {
  public metaInfo(): any {
    return {
      meta: [
        {
          name: "description",
          content:
            "Page de déclaration d'IP de l'application des Licences Nationales"
        }
      ],
      title: "Ajout d'IP - Licences Nationales"
    };
  }

  id: string = "";
  ip: string = "";
  typeAcces: string = "";
  typesIp: Array<string> = ["IPV4", "IPV6"];
  typeIp: string = "IPV4";
  arrayAjouterIp: Array<string> = [];

  validate(payloadFromModuleSegmentsIpPlage): void {
    this.arrayAjouterIp.push(payloadFromModuleSegmentsIpPlage);
  }
  clear() {
    this.arrayAjouterIp = [];
  }
  async supprimerIP(idIP: string, index: number) {
    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de supprimer définitivement une adresse IP ou une plage d'adresses IP.

                Etes-vous sûr de vouloir effectuer cette action ?`
    );
    if (confirmed) {
      iPService
        .deleteIP(this.$store.getters.getToken(), idIP)
        .then(response => {
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

          setTimeout(() => {
            this.$store.dispatch("closeDisplayedMessage");
          }, 5000);
          this.arrayAjouterIp.splice(index, 1);
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
        });
    }
  }

  alertSuccess(evt) {
    const message: Message = new Message();
    message.type = MessageType.VALIDATION;
    message.texte = evt;
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
    }, 5000);
  }

  alertError(evt) {
    const message: Message = new Message();
    message.type = MessageType.ERREUR;
    message.texte = evt;
    message.isSticky = true;
    this.$store.dispatch("openDisplayedMessage", message).catch(err => {
      Logger.error(err.toString());
    });
    // On glisse sur le message d'erreur
    const messageBox = document.getElementById("messageBox");
    if (messageBox) {
      window.scrollTo(0, messageBox.offsetTop);
    }
  }

  clearChild(isPlage: boolean) {
    if (isPlage) {
      const child = this.$refs.ip as any;
      child.clear(false);
      child.$refs.formModuleSegmentsIpPlage.resetValidation();
    } else {
      const child = this.$refs.plage as any;
      child.clear(false);
      child.$refs.formModuleSegmentsIpPlage.resetValidation();
    }
  }
}
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
