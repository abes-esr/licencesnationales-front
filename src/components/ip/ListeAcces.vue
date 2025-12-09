<template>
  <div>
    <ConfirmPopup ref="confirm"></ConfirmPopup>
    <v-card flat>
      <v-row>
        <v-col lg="12" md="12" xs="12">
          <v-row>
            <v-col cols="12" sm="12">
              <v-row>
                <h1>Liste des IP déclarées par {{ currentEtabNom }}</h1>
              </v-row>
              <v-row>
                <v-col cols="4" sm="4">
                  <a v-if="isAdmin" @click="revenirInfosEtab()">
                    <FontAwesomeIcon :icon="['fas', 'reply']" />&nbsp;Revenir
                    aux informations de l'établissement
                  </a>
                </v-col>
                <v-col cols="8">
                  <v-btn id="addIpButton" @click="$router.push({ path: '/ajouterAcces/' })"><span class="btnText">Ajouter
                      une IP ou une plage IP</span>
                    <FontAwesomeIcon :icon="['fas', 'plus-circle']" style="font-size:1.1rem" />
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-alert dense :value="error !== ''" type="error" v-html="error">
                  </v-alert>
                  <v-alert dense :value="notification !== ''" type="success">
                    {{ notification }}
                  </v-alert>
                  <v-card-text class="fondGris">
                    <v-row>
                      <v-col>
                        <v-data-table id="mytable" :key="refreshKey" :headers="headers" :items="filteredAccesByStatut"
                          :items-per-page="10" :footer-props="{
                            showFirstLastPage: true,
                            'items-per-page-options': [10, 25, 50, 75, -1]
                          }" :item-class="RowClasses" :search="rechercher" :loading="dataLoading"
                          noDataText="Aucune IP déclarée pour l’instant. Déclarez une adresse ou une plage IP."
                          class="row-height-50" flat>
                          <template v-slot:header.statut="{ header }">
                            {{ header.texte }}
                            <v-menu offset-y :close-on-content-click="false">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn text class="bouton-simple" style="text-decoration: none;" v-bind="attrs" v-on="on">
                                  <v-icon small :color="statut ? 'primary' : ''">
                                    mdi-filter
                                  </v-icon>
                                  Statut
                                </v-btn>
                              </template>
                              <div style="background-color: white" class="pl-4 pr-8">
                                <ul>
                                  <li v-for="item in selectStatut" :key="item.id" @click="eventStatutChoice(item)">
                                    <a>{{ item }}</a>
                                  </li>
                                </ul>
                              </div>
                            </v-menu>
                          </template>
                          <template v-slot:header.typeIp="{ header }">
                            {{ header.texte }}
                            <v-menu offset-y :close-on-content-click="false">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn text class="bouton-simple" style="text-decoration: none;" v-bind="attrs" v-on="on">
                                  <v-icon small :color="statut ? 'primary' : ''">
                                    mdi-filter
                                  </v-icon>
                                  Type d'IP
                                </v-btn>
                              </template>
                              <div style="background-color: white;" class="pl-4 pr-8">
                                <ul>
                                  <li v-for="item in selectType" :key="item.id" @click="eventTypeChoice(item)">
                                    <a>{{ item }}</a>
                                  </li>
                                </ul>
                              </div>
                            </v-menu>
                          </template>
                          <template v-slot:top>
                            <v-row>
                              <v-col cols="12" sm="6" class="px-0">
                                <v-tooltip top max-width="20vw" open-delay="100">
                                  <template v-slot:activator="{ on }">
                                    <v-btn text @click="downloadIPs()" class="bouton-simple pl-0" v-on="on"
                                      :loading="isExportLoading">
                                      <h2>Télécharger la liste des IP</h2>
                                      <FontAwesomeIcon :icon="['fas', 'download']" class="mx-2" size="2x" />
                                    </v-btn>
                                  </template>
                                  <span>Le téléchargement correspond à la vue
                                    filtrée</span>
                                </v-tooltip>
                              </v-col>
                              <v-col cols="0" sm="3"></v-col>
                              <v-col cols="12" sm="3" class="px-0">
                                <v-text-field v-model="rechercher" label="Chercher dans les colonnes"
                                  prepend-inner-icon="mdi-magnify" outlined filled clearable></v-text-field>
                              </v-col>
                            </v-row>
                          </template>
                          <template v-slot:[`item.commentaires`]="{ item }">
                            <td class="truncate">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <span v-bind="attrs" v-on="on">{{
                                    item.commentaires
                                  }}</span>
                                </template>
                                <span>{{ item.commentaires }}</span>
                              </v-tooltip>
                            </td>
                          </template>
                          <template v-slot:[`item.statut`]="{ item }">
                            <span class="pr-2">{{ item.statut }}</span>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on">
                                  <FontAwesomeIcon :icon="['fas', 'info-circle']" />
                                </span>
                              </template>
                              <span v-if="item.statut.includes('Validé')">{{
                                infobulleValid
                              }}</span>
                              <span v-if="item.statut.includes('Attestation')">{{ infobulleAttestation }}</span>
                              <span v-if="item.statut.includes('attente')">{{
                                infobulleAttente
                              }}</span>
                            </v-tooltip>
                          </template>
                          <template v-slot:[`item.action`]="{ item }">
                            <v-btn v-if="isAdmin &&
                              $store.getters.getCurrentEtablissement()
                                .statut == 'Validé'
                              " class="ma-0 pa-0 bouton-simple " icon title="Examiner" @click.stop="openDialog(item)">
                              <FontAwesomeIcon :icon="['fas', 'search']" />
                            </v-btn>
                            <v-btn v-if="!isAdmin" class="ma-0 pa-0 bouton-simple " icon :loading="buttlonLoading"
                              title="Supprimer" @click="supprimerIP(item.id, item.ip)">
                              <FontAwesomeIcon :icon="['fas', 'times']" class="fa-orange" />
                            </v-btn>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col>
                        <div style="float: right;" class="actions" v-if="isAdmin">
                          <v-btn @click="clearActions" class="btn-6"><span class="btnText">Annuler</span>
                          </v-btn>
                          <v-btn @click="dispatchAllAction" :loading="buttlonLoading"><span class="btnText">Enregistrer
                              mes actions</span>
                            <FontAwesomeIcon :icon="faArrowCircleRight" />
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-col cols="12" style="padding: 24px;" v-if="!isAdmin">
      <v-row>
        <v-col cols="1" xs="0" />
        <v-col cols="10" xs="12">
          <infos-i-ps v-if="!isAdmin" :class="[$vuetify.breakpoint.mdAndDown ? 'compact-form' : '']"></infos-i-ps>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          Analyse de l'adresse IP
        </v-card-title>
        <v-card-text>
          <h3>Commentaire</h3>
          <span>{{ currentIP.commentaires }}</span>
          <span v-if="currentIP.commentaires === null">Aucun commentaire</span>
          <br />
          <h3>Whois</h3>
          <v-expansion-panels focusable accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <span v-if="checkIfWhoIsRenater(whoIs)">L'adresse <span v-if="whoIs2 !== ''">de début </span>fait
                  partie du réseau RENATER
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="['fas', 'check']" />
                </span>
                <span v-else>L'adresse <span v-if="whoIs2 !== ''">de début </span> ne fait
                  pas partie du réseau RENATER<span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="['fas', 'times']" />
                </span>
                Afficher/Cacher WhoIS
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p><span v-html="highlightRenater(whoIs)"></span></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="whoIs2 !== ''">
              <v-expansion-panel-header>
                <span v-if="checkIfWhoIsRenater(whoIs2)">L'adresse de fin fait partie du réseau RENATER
                  <span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="['fas', 'check']" />
                </span>
                <span v-else>L'adresse de fin ne fait pas partie du réseau RENATER<span style="padding: 5px;" />
                  <FontAwesomeIcon :icon="['fas', 'times']" />
                </span>
                Afficher/Cacher WhoIS
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p><span v-html="highlightRenater(whoIs2)"></span></p>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <br />
          <h3>Commentaire admin</h3>
          <v-textarea outlined auto-grow counter="4000" :rules="rulesForm.commentaireAdmin" rows="2"
            label="Raisons de la suppression" v-model="commentaires" clearable></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <div style="float: right" class="actions">
                <v-btn @click="
                  dialog = false;
                currentIPid = '';
                commentaires = '';
                " class="btn-6">
                  Annuler
                </v-btn>
                <v-btn @click="addActionToBuffer('SUPPRIMER')" class="btn-5">
                  Supprimer
                </v-btn>
                <v-btn @click="addActionToBuffer('REJETER')" class="btn-2">
                  Rejeter
                </v-btn>
                <v-btn @click="addActionToBuffer('VALIDER')" class="btn-4">
                  Valider
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { Logger } from "@/utils/Logger";
import { iPService } from "@/core/service/licencesnationales/IPService";
import { Message, MessageType } from "@/core/CommonDefinition";
import ConfirmPopup from "@/components/common/ConfirmPopup.vue";
import { LicencesNationalesBadRequestApiError } from "@/core/service/licencesnationales/exception/LicencesNationalesBadRequestApiError";
import { AxiosResponse } from "axios";
import { rulesForms } from "@/core/RulesForm";
import InfosIPs from "@/components/ip/InfosIPs.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

const ListeAccesProps = Vue.extend({
  props: {
    sirenEtabSiAdmin: {
      type: String,
      default: ""
    }
  }
});

@Component({
  components: { InfosIPs, ConfirmPopup }
})
export default class ListeAcces extends ListeAccesProps {
  public metaInfo(): any {
    return {
      meta: [
        {
          name: "description",
          content: "Liste des IPs de l'application des Licences Nationales"
        }
      ],
      title: "Mes IPs - Licences Nationales"
    };
  }

  rulesForm: any = rulesForms;
  refreshKey: number = 0;
  statut: string = "";
  type: string = "";
  selectStatut: Array<string> = [
    "En attente d'attestation",
    "IP Validée par l'Abes",
    "En attente d'examen par l'Abes",
    "Tous"
  ];
  selectType: Array<string> = [
    "IPV4",
    "IPV6",
    "Plage IPV4",
    "Plage IPV6",
    "Tous"
  ];
  rechercher: string = "";
  acces: Array<any> = [];
  title: string = "";
  id: string = "";
  whoIs: string = "";
  whoIs2: string = "";
  currentIP: any = "";
  bufferActions: Array<any> = [];
  error: string = "";
  dialog: boolean = false;
  isExportLoading: boolean = false;
  buttlonLoading: boolean = false;
  notification: string = "";
  commentaires: string = "";
  headers = [{}];
  dataLoading: boolean = true;

  infobulleAttente: string =
    "IP transmise aux éditeurs et à l'Inist si validée par l'Abes";
  infobulleAttestation: string =
    "IP transmise aux éditeurs et à l'Inist après réception de l'attestation";
  infobulleValid: string =
    "IP transmise aux éditeurs et à l’Inist à chaque fin de mois";

  get getUserSiren() {
    return this.$store.state.user.siren;
  }

  get currentEtabNom() {
    return this.$store.getters.getCurrentEtablissement().nom;
  }

  get isAdmin() {
    return this.$store.getters.isAdmin();
  }

  get filteredAccesByStatut(): string[] {
    const conditions = [] as any;
    if (this.statut) {
      conditions.push(this.filterStatut);
    }
    if (conditions.length > 0) {
      return this.filteredAccesByType.filter(acces => {
        return conditions.every(condition => {
          return condition(acces);
        });
      });
    }
    return this.filteredAccesByType;
  }

  get filteredAccesByType(): string[] {
    const conditions = [] as any;
    if (this.type) {
      conditions.push(this.filterType);
    }
    if (conditions.length > 0) {
      return this.acces.filter(acces => {
        return conditions.every(condition => {
          return condition(acces);
        });
      });
    }
    return this.acces;
  }

  mounted() {
    moment.locale("fr");
    this.collecterAcces();
    this.id = this.getIdAcces(this.acces);
    this.setHeaders();
  }

  setHeaders() {
    if (this.isAdmin) {
      this.headers = [
        {
          text: "Date de saisie",
          align: "start",
          value: "dateCreation",
          sortable: true,
          width: "9%"
        },
        {
          text: "Type d'IP",
          value: "typeIp",
          sortable: true,
          width: "9%"
        },
        { text: "Valeur", value: "ip", sortable: true, width: "20%" },
        { text: "Statut", value: "statut", sortable: true, width: "13%" },
        { text: "Action", value: "buffer", sortable: false, width: "13%" },
        {
          text: "Dernière action de l’Abes",
          value: "dateModification",
          sortable: true,
          width: "10%"
        },
        {
          text: "Précision sur l’IP",
          value: "commentaires",
          sortable: true,
          width: "17%"
        },
        { text: "Examiner", value: "action", sortable: false, width: "9%" }
      ];
    } else {
      this.headers = [
        {
          text: "Date de saisie",
          align: "start",
          value: "dateCreation",
          sortable: true,
          width: "9%"
        },
        {
          text: "Type d'IP",
          value: "typeIp",
          sortable: true,
          width: "20%"
        },
        { text: "Valeur", value: "ip", sortable: true, width: "15%" },
        { text: "Statut", value: "statut", sortable: true, width: "15%" },
        {
          text: "Dernière action de l’Abes",
          value: "dateModification",
          sortable: true,
          width: "15%"
        },
        {
          text: "Précision sur l’IP",
          value: "commentaires",
          sortable: true,
          width: "17%"
        },
        { text: "Supprimer", value: "action", sortable: false, width: "10%" }
      ];
    }
  }

  getIdAcces(acces): any {
    return {
      id: acces.id
    };
  }

  filterStatut(statutRecherche) {
    return statutRecherche.statut.toString().includes(this.statut);
  }

  filterType(typeRecherche) {
    return typeRecherche.typeIp.toString() === this.type;
  }

  getAll() {
    if (this.isAdmin)
      return iPService.getListIPEtab(
        this.$store.getters.getToken(),
        this.$store.getters.getCurrentEtablissement().siren
      );
    else
      return iPService.getListIP(
        this.$store.getters.getToken(),
        this.getUserSiren
      );
  }

  collecterAcces(): void {
    this.getAll()
      .then(response => {
        this.acces = response.data.map(this.affichageAcces);
      })
      .catch(err => {
        Logger.error(err);
        this.error = err.response.data.message;
      })
      .finally(() => {
        this.dataLoading = false;
      });
  }

  affichageAcces(acces) {
    let typeAcces = "";
    if (acces.typeAcces === "range") typeAcces = "Plage ";
    return {
      id: acces.id,
      dateCreation: moment(acces.dateCreation).format("L"),
      dateModification: this.getDateModification(acces),
      typeIp: typeAcces + acces.typeIp,
      typeAcces: acces.typeAcces,
      ip: acces.ip,
      statut: acces.statut,
      commentaires: acces.commentaires
    };
  }

  getDateModification(acces) {
    if (acces.dateModification === null) return acces.dateModification;
    else return moment(acces.dateModification).format("L");
  }

  openDialog(item): void {
    this.clearAlerts();
    this.fetchwhoIs(item);
    this.dialog = true;
    this.currentIP = item;
  }

  fetchwhoIs(item): void {
    this.whoIs = "";
    this.whoIs2 = "";

    if (item.typeAcces === "ip") {
      iPService
        .getWhoIs(this.$store.getters.getToken(), item.ip)
        .then(res => {
          this.whoIs = res.data;
        })
        .catch(() => {
          Logger.error("Impossible d'exécuter le WhoIS");
        });
    } else {
      const ips = this.splitRangeIntoIPs(item.typeIp, item.ip);
      iPService
        .getWhoIs(this.$store.getters.getToken(), ips[0])
        .then(res => {
          this.whoIs = res.data;
        })
        .catch(() => {
          Logger.error("Impossible d'exécuter le WhoIS");
        });
      iPService
        .getWhoIs(this.$store.getters.getToken(), ips[1])
        .then(res => {
          this.whoIs2 = res.data;
        })
        .catch(() => {
          Logger.error("Impossible d'exécuter le WhoIS");
        });
    }
  }

  splitRangeIntoIPs(typeIP: string, range: string): string[] {
    let ip1 = "";
    let ip2 = "";

    if (typeIP === "Plage IPV4") {
      range.split(".").forEach(element => {
        if (element.includes("-")) {
          const tabSplit = element.split("-");
          ip1 += "." + tabSplit[0];
          ip2 += "." + tabSplit[1];
        } else {
          ip1 += "." + element;
          ip2 += "." + element;
        }
      });
    } else {
      range.split(":").forEach(element => {
        if (element.includes("-")) {
          const tabSplit = element.split("-");
          ip1 += ":" + tabSplit[0];
          ip2 += ":" + tabSplit[1];
        } else {
          ip1 += ":" + element;
          ip2 += ":" + element;
        }
      });
    }

    ip1 = ip1.substring(1);
    ip2 = ip2.substring(1);
    return [ip1, ip2];
  }

  checkIfWhoIsRenater(whoIs: string): boolean {
    if (whoIs.toLowerCase().includes("renater")) {
      return true;
    }
    return false;
  }

  highlightRenater(whoIs: string) {
    return whoIs
      .replaceAll("renater", "<mark>renater</mark>")
      .replaceAll("RENATER", "<mark>RENATER</mark>");
  }

  dispatchAllAction(): void {
    this.updateIP()
      .then(() => {
        this.notification = "Actions effectuées";
      })
      .catch(err => {
        Logger.debug(err);
        this.error = err.response.data.message;
      })
      .finally(() => {
        this.collecterAcces();
        this.clearActions();
        this.buttlonLoading = false;
      });
  }

  updateIP(): Promise<AxiosResponse> {
    this.buttlonLoading = true;
    return iPService.updateIP(
      this.$store.getters.getToken(),
      this.$store.getters.getCurrentEtablissement().siren,
      this.bufferActions
    );
  }

  addActionToBuffer(action: string): void {
    this.bufferActions.push({
      idIp: this.currentIP.id,
      action: action,
      ip: this.currentIP.ip,
      commentaire: this.commentaires
    });
    this.addActionToDatatable(action, this.currentIP.id);
    this.commentaires = "";
    this.dialog = false;
    this.refreshKey++;
  }

  addActionToDatatable(action: string, id: number) {
    this.acces.forEach(element => {
      if (element.id === id) {
        element.buffer = action;
      }
    });
  }

  // Suppression par un USER
  async supprimerIP(IDip: string, ip: string) {
    const confirmed = await (this.$refs.confirm as ConfirmPopup).open(
      `Vous êtes sur le point de supprimer définitivement l'adresse IP ou plage d'adresses IP ${ip}

                Etes-vous sûr de vouloir effectuer cette action ?`
    );
    if (confirmed) {
      this.buttlonLoading = true;
      this.clearAlerts();

      iPService
        .deleteIP(this.$store.getters.getToken(), IDip)
        .then(() => {
          this.notification = "IP supprimée.";
        })
        .catch(err => {
          Logger.error = err;
          this.error = err.message;
        })
        .finally(() => {
          this.buttlonLoading = false;
          this.collecterAcces();
        });
    }
  }

  RowClasses(item) {
    let action = "";
    this.bufferActions.forEach(element => {
      if (element.ip === item.ip) {
        action = element.action;
      }
    });
    return action;
  }

  clearActions() {
    this.bufferActions = [];
    this.refreshKey++;
    this.acces.forEach(element => {
      if (element.buffer !== undefined) {
        delete element.buffer;
      }
    });
  }

  clearAlerts() {
    this.notification = "";
    this.error = "";
  }

  getSirenEtabSujet() {
    if (this.isAdmin)
      return this.$store.getters.getCurrentEtablissement().siren;
    else return this.getUserSiren;
  }

  downloadIPs(): void {
    this.isExportLoading = true;
    this.$store.dispatch("closeDisplayedMessage");
    iPService
      .downloadIPs(this.getSirenEtabSujet(), this.$store.state.user.token)
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

  revenirInfosEtab(): void {
    this.$router.push({ name: "AfficherEtablissement" }).catch(err => {
      Logger.error(err);
    });
  }

  eventStatutChoice(element: string): void {
    if (element === "Tous") {
      this.statut = "";
    } else {
      this.statut = element;
    }
    this.filteredAccesByStatut;
  }

  eventTypeChoice(element: string): void {
    if (element === "Tous") {
      this.type = "";
    } else {
      this.type = element;
    }
    this.filteredAccesByType;
  }
}
</script>

<style src="./style.css"></style>
<style>
h3 {
  padding-top: 10px;
}

.row {
  margin: 0 !important;
}

.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-data-table.row-height-50 td {
  max-height: 48px !important;
}

.v-data-table {
  background-color: transparent !important;
}

.theme--light .v-data-footer__icons-before .v-btn,
.theme--light .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-after .v-btn,
.theme--dark .v-data-footer__icons-before .v-btn {
  background-color: transparent !important;
}

.btnText {
  padding-right: 5px;
}

.actions .v-btn {
  margin: 5px;
}

#addIpButton {
  float: right;
}

.VALIDER {
  background-color: #1cd74b60 !important;
}

.SUPPRIMER {
  background-color: #ee492e4d !important;
}

.REJETER {
  background-color: #155fab47 !important;
}
</style>
