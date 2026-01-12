import { useApiService } from "@/composables/useApiService";
import ContactEtablissement from "@/core/ContactEtablissement";
import Etablissement from "@/core/Etablissement";
import Notification from "@/core/Notification";
import { DateUtils } from "@/utils/DateUtils";

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

interface JsonCreateContactEtablissement {
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

interface JsonUpdateContactEtablissement {
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

interface JsonUpdateEtablissement {
  nom: string;
  siren: string;
  typeEtablissement: string;
  contact: JsonUpdateContactEtablissement;
  role: string;
}

interface JsonTypeEtablissementResponse {
  libelle: string;
}

interface JsonNotificationAdminResponse {
  siren: string;
  dateEvent: Date;
  typeNotif: string;
  nomEtab: string;
}

interface JsonNotificationUserResponse {
  message: string;
  description: string;
}

interface NotificationUser {
  index: number;
  message: string;
  description: string;
}

export const useEtablissementService = () => {
  const api = useApiService();

  const creerEtablissement = async (
    etablissement: Etablissement,
    tokenrecaptcha: string
  ): Promise<boolean> => {
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
    await api.put("/etablissements", json);
    return true;
  };

  const listeType = async (): Promise<Array<string>> => {
    const result = await api.get("/etablissements/getType");
    const response: Array<JsonTypeEtablissementResponse> = result.data;
    return response.map(element => element.libelle);
  };

  const getEtablissements = async (token: string): Promise<Array<Etablissement>> => {
    const result = await api.get("/etablissements/", token, {}, true);
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
      etablissement.dateModificationDerniereIp = element.dateModificationDerniereIp;
      etablissement.typeEtablissement = element.typeEtablissement;
      etablissement.statut = element.statut;
      etablissement.statutIP = element.statutIps;
      etablissement.idAbes = element.idAbes;
      etabs.push(etablissement);
    });
    return etabs;
  };

  const getEtablissement = async (siren: string, token: string): Promise<Etablissement> => {
    const result = await api.get("/etablissements/" + siren, token);
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
    return etablissement;
  };

  const updateEtablissement = async (
    etablissement: Etablissement,
    token: string,
    isAdmin: boolean
  ): Promise<boolean> => {
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
      role: etablissement.contact.role
    };
    const json: JsonUpdateEtablissement = {
      nom: etablissement.nom,
      siren: etablissement.siren,
      typeEtablissement: etablissement.typeEtablissement,
      contact: jsonContact,
      role: isAdmin ? "admin" : "etab"
    };

    await api.post("/etablissements/" + etablissement.siren, json, token);
    return true;
  };

  const deleteEtab = async (siren: string, token: string): Promise<boolean> => {
    await api.del("/etablissements/" + siren, null, token);
    return true;
  };

  const validerEtablissement = (siren: string, token: string) =>
    api.post("/etablissements/validation/" + siren, null, token);

  const devaliderEtablissement = (siren: string, token: string) =>
    api.post("/etablissements/devalidation/" + siren, null, token);

  const fusion = (token: string, data: any) => api.post("/etablissements/fusion", data, token);

  const scission = (token: string, data: any) =>
    api.post("/etablissements/scission", data, token);

  const downloadEtablissements = async (sirens: Array<string>, token: string) => {
    const response = await api.post("/etablissements/export", sirens, token);
    return response;
  };

  const getNotificationsAdmin = async (token: string): Promise<Array<Notification>> => {
    const result = await api.get("/etablissements/notificationsAdmin/", token, {}, true);
    const response: Array<JsonNotificationAdminResponse> = result.data["notifications"];
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
      return new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime();
    });
    return notifs;
  };

  const getNotificationsEtab = async (
    siren: string,
    token: string
  ): Promise<Array<NotificationUser>> => {
    const result = await api.get("/etablissements/notifications/" + siren, token);
    const response: Array<JsonNotificationUserResponse> = result.data["notifications"];
    const notifs: Array<NotificationUser> = [];
    response.forEach(function(element, i) {
      notifs.push({
        index: i,
        message: element.message,
        description: element.description
      });
    });
    return notifs;
  };

  const search = (criteres: Array<string>, token: string) =>
    api.post("/etablissements/search/", criteres, token);

  const getHisto = (siren: string, token: string) =>
    api.get("/etablissements/histo/" + siren, token);

  const getStats = (dateDebut: string, dateFin: string, token: string) =>
    api.get(
      "/etablissements/stats?dateDebut=" + dateDebut + "&dateFin=" + dateFin,
      token
    );

  return {
    creerEtablissement,
    listeType,
    getEtablissements,
    getEtablissement,
    updateEtablissement,
    deleteEtab,
    validerEtablissement,
    devaliderEtablissement,
    fusion,
    scission,
    downloadEtablissements,
    getNotificationsAdmin,
    getNotificationsEtab,
    search,
    getHisto,
    getStats
  };
};
