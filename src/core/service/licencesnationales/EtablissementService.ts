import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import Etablissement from "@/core/Etablissement";
import Notification from "@/core/Notification";
import ContactEtablissement from "@/core/ContactEtablissement";
import { AxiosResponse } from "axios";
import { DateUtils } from "@/utils/DateUtils";
import NotificationUser from "@/core/service/NotificationUser";

export class EtablissementService extends LicencesNationalesApiService {
  /**
   * Appel API pour créer un nouveau compte
   *
   */
  creerEtablissement(
    etablissement: Etablissement,
    tokenrecaptcha: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const jsonContact: JsonCreateContactEtablissement = {
        nom: etablissement.contact.nom,
        prenom: etablissement.contact.prenom,
        adresse: etablissement.contact.adresse,
        boitePostale: etablissement.contact.boitePostale,
        codePostal: etablissement.contact.codePostal,
        ville: etablissement.contact.ville,
        cedex: etablissement.contact.cedex,
        telephone: etablissement.contact.telephone,
        mail: etablissement.contact.mail,
        motDePasse: etablissement.contact.motDePasse
      };
      const json: JsonCreateEtablissement = {
        nom: etablissement.nom,
        siren: etablissement.siren,
        typeEtablissement: etablissement.typeEtablissement.toString(),
        contact: jsonContact,
        recaptcha: tokenrecaptcha
      };
      return this.client
        .put("/etablissements", json)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  listeType(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/getType")
        .then(result => {
          const response: Array<JsonTypeEtablissementResponse> = result.data; //TODO il faut des index !
          const typesEtablissement: Array<string> = [];
          response.forEach(element => typesEtablissement.push(element.libelle));
          resolve(typesEtablissement);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getEtablissements(token: string): Promise<Array<Etablissement>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/", token, {}, true)
        .then(result => {
          const response: Array<JsonSimpleEtablissementResponse> = result.data;
          const etabs: Array<Etablissement> = [];
          response.forEach(element => {
            const etablissement: Etablissement = new Etablissement();
            etablissement.id = element.id;
            etablissement.nom = element.nom;
            etablissement.siren = element.siren;
            etablissement.dateCreation = DateUtils.stringToDate(
              element.dateCreation,
              "dd-MM-yyyy",
              "-"
            );
            etablissement.dateModificationDerniereIp =
              element.dateModificationDerniereIp;
            etablissement.typeEtablissement = element.typeEtablissement;
            etablissement.statut = element.statut;
            etablissement.statutIP = element.statutIps;
            etablissement.idAbes = element.idAbes;
            etabs.push(etablissement);
          });
          resolve(etabs);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getEtablissement(siren: string, token: string): Promise<Etablissement> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/" + siren, token)
        .then(result => {
          const response: JsonEtablissementResponse = result.data;
          const etablissement: Etablissement = new Etablissement();
          etablissement.id = response.id;
          etablissement.nom = response.nom;
          etablissement.siren = response.siren;
          etablissement.dateCreation = DateUtils.stringToDate(
            response.dateCreation,
            "dd-MM-yyyy",
            "-"
          );
          etablissement.typeEtablissement = response.typeEtablissement;
          etablissement.statut = response.statut;
          etablissement.statutIP = response.statutIps;
          etablissement.idAbes = response.idAbes;

          const contact: ContactEtablissement = new ContactEtablissement();
          contact.id = response.contact.id;
          contact.nom = response.contact.nom;
          contact.prenom = response.contact.prenom;
          contact.adresse = response.contact.adresse;
          contact.boitePostale = response.contact.boitePostale;
          contact.codePostal = response.contact.codePostal;
          contact.ville = response.contact.ville;
          contact.cedex = response.contact.cedex;
          contact.telephone = response.contact.telephone;
          contact.mail = response.contact.mail;

          etablissement.contact = contact;
          resolve(etablissement);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  updateEtablissement(
    etablissement: Etablissement,
    token: string,
    isAdmin: boolean
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const jsonContact: JsonUpdateContactEtablissement = {
        nom: etablissement.contact.nom,
        prenom: etablissement.contact.prenom,
        adresse: etablissement.contact.adresse,
        boitePostale: etablissement.contact.boitePostale,
        codePostal: etablissement.contact.codePostal,
        ville: etablissement.contact.ville,
        cedex: etablissement.contact.cedex,
        telephone: etablissement.contact.telephone,
        mail: etablissement.contact.mail,
        role: etablissement.contact.role //role du contact de l'etablissement à modifier
      };
      const json: JsonUpdateEtablissement = {
        nom: etablissement.nom,
        siren: etablissement.siren,
        typeEtablissement: etablissement.typeEtablissement,
        contact: jsonContact,
        role: isAdmin ? "admin" : "etab"
      };

      return this.client
        .post("/etablissements/" + etablissement.siren, json, token)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  deleteEtab(siren: string, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.client
        .delete("/etablissements/" + siren, null, token)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  validerEtablissement(siren: string, token: string): Promise<AxiosResponse> {
    return this.client.post("/etablissements/validation/" + siren, null, token);
  }

  devaliderEtablissement(siren: string, token: string): Promise<AxiosResponse> {
    return this.client.post(
      "/etablissements/devalidation/" + siren,
      null,
      token
    );
  }

  fusion(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/fusion", data, token);
  }

  scission(token: string, data: any): Promise<AxiosResponse> {
    return this.client.post("/etablissements/scission", data, token);
  }

  /**
   * Appel API pour telecharger la liste établissements
   * @param sirens siren des etab concerné, si sirens est vide : télécharge les info compte connecté
   * @param token Jeton de session
   * @return  Vrai si la suppresion a fonctionné, sinon on lève une exception
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  downloadEtablissements(sirens: Array<string>, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // const json: JsonExportRequest = {
      //   ids: ids
      // };
      return this.client
        .post("/etablissements/export", sirens, token)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getNotificationsAdmin(token: string): Promise<Array<Notification>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/notificationsAdmin/", token, {}, true)
        .then(result => {
          const response: Array<JsonNotificationAdminResponse> =
            result.data["notifications"];
          const notifs: Array<Notification> = [];
          response.forEach(function(element, i) {
            const notification: Notification = new Notification();
            notification.index = i;
            notification.siren = element.siren;
            notification.dateEvent = element.dateEvent;
            notification.typeNotif = element.typeNotif;
            notification.nomEtab = element.nomEtab;
            notifs.push(notification);
          });
          notifs.sort(function(a, b) {
            return (
              new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime()
            );
          });
          resolve(notifs);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  getNotificationsEtab(
    siren: string,
    token: string
  ): Promise<Array<NotificationUser>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/etablissements/notifications/" + siren, token)
        .then(result => {
          const response: Array<JsonNotificationUserResponse> =
            result.data["notifications"];
          const notifs: Array<NotificationUser> = [];
          response.forEach(function(element, i) {
            const notification: NotificationUser = new NotificationUser();
            notification.index = i;
            notification.message = element.message;
            notification.description = element.description;
            notifs.push(notification);
          });
          resolve(notifs);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  search(criteres: Array<string>, token: string): Promise<AxiosResponse> {
    return this.client.post("/etablissements/search/", criteres, token);
  }

  getHisto(siren: string, token: string): Promise<AxiosResponse> {
    return this.client.get("/etablissements/histo/" + siren, token);
  }

  getStats(
    dateDebut: string,
    dateFin: string,
    token: string
  ): Promise<AxiosResponse> {
    return this.client.get(
      "/etablissements/stats?dateDebut=" + dateDebut + "&dateFin=" + dateFin,
      token
    );
  }
}

export const etablissementService = new EtablissementService();

/* JSON  entrée / sortie */

interface JsonEtablissementResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  typeEtablissement: string;
  statut: string;
  statutIps: string;
  idAbes: string;
  contact: JsonContactEtablissementResponse;
}

interface JsonSimpleEtablissementResponse {
  id: number;
  nom: string;
  siren: string;
  dateCreation: string;
  dateModificationDerniereIp: string;
  typeEtablissement: string;
  statut: string;
  statutIps: string;
  idAbes: string;
}

interface JsonContactEtablissementResponse {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
}

interface JsonCreateEtablissement {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonCreateContactEtablissement;
  recaptcha: string;
}

export interface JsonCreateContactEtablissement {
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
  motDePasse: string;
}

export interface JsonUpdateContactEtablissement {
  nom: string;
  prenom: string;
  adresse: string;
  boitePostale: string;
  codePostal: string;
  ville: string;
  cedex: string;
  telephone: string;
  mail: string;
  role: string;
}

export interface JsonUpdateEtablissement {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonUpdateContactEtablissement;
  role: string;
}

export interface JsonTypeEtablissementResponse {
  libelle: string;
}

export interface JsonNotificationAdminResponse {
  siren: string;
  dateEvent: Date;
  typeNotif: string;
  nomEtab: string;
}

export interface JsonNotificationUserResponse {
  message: string;
  description: string;
}
