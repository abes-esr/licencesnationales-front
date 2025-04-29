import { LicencesNationalesApiService } from "@/core/service/licencesnationales/LicencesNationalesApiService";
import Editeur from "@/core/Editeur";
import { ContactType } from "@/core/CommonDefinition";
import ContactEditeur from "@/core/ContactEditeur";
import { AxiosResponse } from "axios";

export class EditeurService extends LicencesNationalesApiService {
  /**
   * Appel API pour créer un editeur
   * @param editeur Editeur à créer
   * @param token Jeton de session
   * @return Vrai si la création a fonctionné, sinon on lève une exception
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  createEditeur(editeur: Editeur, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const contactsCommerciaux: Array<JsonCreationContactEditeurRequest> = [];
      const contactsTechniques: Array<JsonCreationContactEditeurRequest> = [];

      for (let index = 0; index < editeur.contacts.length; index++) {
        if (editeur.contacts[index].type == ContactType.COMMERCIAL) {
          const jsonContact: JsonCreationContactEditeurRequest = {
            nom: editeur.contacts[index].nom,
            prenom: editeur.contacts[index].prenom,
            mail: editeur.contacts[index].mail
          };
          contactsCommerciaux.push(jsonContact);
        } else if (editeur.contacts[index].type == ContactType.TECHNIQUE) {
          const jsonContact: JsonCreationContactEditeurRequest = {
            nom: editeur.contacts[index].nom,
            prenom: editeur.contacts[index].prenom,
            mail: editeur.contacts[index].mail
          };
          contactsTechniques.push(jsonContact);
        }
      }
      const json: JsonCreationEditeurRequest = {
        nom: editeur.nom,
        identifiantBis: editeur.identifiantBis,
        typesEtablissements: editeur.groupesEtabRelies,
        adresse: editeur.adresse,
        contactsCommerciaux: contactsCommerciaux,
        contactsTechniques: contactsTechniques
      };
      return this.client
        .put("/editeurs/", json, token)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  /**
   * Appel API pour mettre àjour un editeur
   * @param editeur Editeur à mettre àjour
   * @param token Jeton de session
   * @return Vrai si la modification a fonctionné, sinon on lève une exception
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  updateEditeur(editeur: Editeur, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const contactsCommerciaux: Array<JsonModificationContactEditeurRequest> = [];
      const contactsTechniques: Array<JsonModificationContactEditeurRequest> = [];

      for (let index = 0; index < editeur.contacts.length; index++) {
        if (editeur.contacts[index].type == ContactType.COMMERCIAL) {
          const jsonContact: JsonModificationContactEditeurRequest = {
            id: editeur.contacts[index].id,
            nom: editeur.contacts[index].nom,
            prenom: editeur.contacts[index].prenom,
            mail: editeur.contacts[index].mail
          };
          contactsCommerciaux.push(jsonContact);
        } else if (editeur.contacts[index].type == ContactType.TECHNIQUE) {
          const jsonContact: JsonModificationContactEditeurRequest = {
            id: editeur.contacts[index].id,
            nom: editeur.contacts[index].nom,
            prenom: editeur.contacts[index].prenom,
            mail: editeur.contacts[index].mail
          };
          contactsTechniques.push(jsonContact);
        }
      }
      const json: JsonModificationEditeurRequest = {
        id: editeur.id,
        nom: editeur.nom,
        identifiantBis: editeur.identifiantBis,
        typesEtablissements: editeur.groupesEtabRelies,
        adresse: editeur.adresse,
        contactsCommerciaux: contactsCommerciaux,
        contactsTechniques: contactsTechniques
      };
      return this.client
        .post("/editeurs/" + editeur.id, json, token)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  /**
   * Appel API pour récupérer la liste de tous les éditeurs
   * @param token Jeton de session
   * @return Liste d'éditeurs
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  getEditeurs(token: string): Promise<Array<Editeur>> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/editeurs", token)
        .then(result => {
          const response: Array<JsonSimpleEditeurResponse> = result.data;
          const editeurs: Array<Editeur> = [];
          response.forEach(element => {
            const editeur: Editeur = new Editeur();
            editeur.id = element.id;
            editeur.nom = element.nom;
            editeur.dateCreation = new Date(element.dateCreation);
            editeurs.push(editeur);
          });
          resolve(editeurs);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  /**
   * Appel API pour récupérer un éditeur
   * @param id Identifiant de l'éditeur
   * @param token Jeton de session
   * @return Un éditeur
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  getEditeur(id: number, token: string): Promise<Editeur> {
    return new Promise((resolve, reject) => {
      return this.client
        .get("/editeurs/" + id, token)
        .then(result => {
          const response: JsonEditeurResponse = result.data;
          const editeur: Editeur = new Editeur();
          editeur.id = response.id;
          editeur.nom = response.nom;
          editeur.dateCreation = new Date(response.dateCreation);
          editeur.groupesEtabRelies = response.typesEtablissements;
          editeur.identifiantBis = response.identifiantBis;
          editeur.adresse = response.adresse;

          // On vide les contacts et on les regénère à partir du JSON
          editeur.contacts = [];
          response.contactsCommerciaux.forEach(element => {
            const contact: ContactEditeur = new ContactEditeur();
            contact.id = element.id;
            contact.nom = element.nom;
            contact.type = ContactType.COMMERCIAL;
            contact.prenom = element.prenom;
            contact.mail = element.mail;
            editeur.addContact(contact);
          });

          response.contactsTechniques.forEach(element => {
            const contact: ContactEditeur = new ContactEditeur();
            contact.id = element.id;
            contact.nom = element.nom;
            contact.type = ContactType.TECHNIQUE;
            contact.prenom = element.prenom;
            contact.mail = element.mail;
            editeur.addContact(contact);
          });
          resolve(editeur);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  /**
   * Appel API pour supprimer un éditeur
   * @param id Identifiant de l'éditeur
   * @param token Jeton de session
   * @return  Vrai si la suppresion a fonctionné, sinon on lève une exception
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  deleteEditeur(id: number, token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.client
        .delete("/editeurs/" + id, null, token)
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  /**
   * Appel API pour telecharger la liste éditeurs
   * @param ids id des editeurs a telecharger
   * @param token Jeton de session
   * @return  Vrai si la suppresion a fonctionné, sinon on lève une exception
   * @exception LicencesNationalesApiError si l'appel API a échoué
   */
  downloadEditeurs(ids: Array<number>, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.client
        .post("/editeurs/export", ids, token)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(this.buildException(err));
        });
    });
  }

  search(criteres: Array<string>, token: string): Promise<AxiosResponse> {
    return this.client.post("/editeurs/search/", criteres, token);
  }

  envoiEditeurs(token: string): Promise<AxiosResponse> {
    return this.client.get("/editeurs/exportMensuelEditeur/", token);
  }

  getDatesEnvoiEditeurs(token: string): Promise<AxiosResponse> {
    return this.client.get("/editeurs/getDateEnvoiEditeur/", token);
  }
}

export const editeurService = new EditeurService();

/* JSON entrée / sortie */

// Création
export interface JsonCreationContactEditeurRequest {
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonCreationEditeurRequest {
  nom: string;
  identifiantBis: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonCreationContactEditeurRequest>;
  contactsTechniques: Array<JsonCreationContactEditeurRequest>;
}

//Liste
export interface JsonSimpleEditeurResponse {
  id: number;
  nom: string;
  dateCreation: string;
}

export interface JsonContactEditeurResponse {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonEditeurResponse {
  id: number;
  nom: string;
  identifiantBis: string;
  dateCreation: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonContactEditeurResponse>;
  contactsTechniques: Array<JsonContactEditeurResponse>;
}

//Modification
export interface JsonModificationContactEditeurRequest {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

export interface JsonModificationEditeurRequest {
  id: number;
  nom: string;
  identifiantBis: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonModificationContactEditeurRequest>;
  contactsTechniques: Array<JsonModificationContactEditeurRequest>;
}

export interface JsonExportRequest {
  ids: Array<number>;
}
