import { useApiService } from "@/composables/useApiService";
import { ContactType } from "@/core/CommonDefinition";
import ContactEditeur from "@/core/ContactEditeur";
import Editeur from "@/core/Editeur";

interface JsonCreationContactEditeurRequest {
  nom: string;
  prenom: string;
  mail: string;
}

interface JsonCreationEditeurRequest {
  nom: string;
  identifiantBis: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonCreationContactEditeurRequest>;
  contactsTechniques: Array<JsonCreationContactEditeurRequest>;
}

interface JsonSimpleEditeurResponse {
  id: number;
  nom: string;
  dateCreation: string;
}

interface JsonContactEditeurResponse {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

interface JsonEditeurResponse {
  id: number;
  nom: string;
  identifiantBis: string;
  dateCreation: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonContactEditeurResponse>;
  contactsTechniques: Array<JsonContactEditeurResponse>;
}

interface JsonModificationContactEditeurRequest {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
}

interface JsonModificationEditeurRequest {
  id: number;
  nom: string;
  identifiantBis: string;
  typesEtablissements: Array<string>;
  adresse: string;
  contactsCommerciaux: Array<JsonModificationContactEditeurRequest>;
  contactsTechniques: Array<JsonModificationContactEditeurRequest>;
}

export const useEditeurService = () => {
  const api = useApiService();

  const createEditeur = async (editeur: Editeur, token: string): Promise<boolean> => {
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
    await api.put("/editeurs/", json, token);
    return true;
  };

  const updateEditeur = async (editeur: Editeur, token: string): Promise<boolean> => {
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
    await api.post("/editeurs/" + editeur.id, json, token);
    return true;
  };

  const getEditeurs = async (token: string): Promise<Array<Editeur>> => {
    const result = await api.get("/editeurs", token);
    const response: Array<JsonSimpleEditeurResponse> = result.data;
    const editeurs: Array<Editeur> = [];
    response.forEach(element => {
      const editeur: Editeur = new Editeur();
      editeur.id = element.id;
      editeur.nom = element.nom;
      editeur.dateCreation = new Date(element.dateCreation);
      editeurs.push(editeur);
    });
    return editeurs;
  };

  const getEditeur = async (id: number, token: string): Promise<Editeur> => {
    const result = await api.get("/editeurs/" + id, token);
    const response: JsonEditeurResponse = result.data;
    const editeur: Editeur = new Editeur();
    editeur.id = response.id;
    editeur.nom = response.nom;
    editeur.dateCreation = new Date(response.dateCreation);
    editeur.groupesEtabRelies = response.typesEtablissements;
    editeur.identifiantBis = response.identifiantBis;
    editeur.adresse = response.adresse;

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
    return editeur;
  };

  const deleteEditeur = async (id: number, token: string): Promise<boolean> => {
    await api.del("/editeurs/" + id, null, token);
    return true;
  };

  const downloadEditeurs = async (ids: Array<number>, token: string): Promise<any> => {
    const response = await api.post("/editeurs/export", ids, token);
    return response;
  };

  const search = (criteres: Array<string>, token: string) =>
    api.post("/editeurs/search/", criteres, token);

  const envoiEditeurs = (token: string) => api.get("/editeurs/exportMensuelEditeur/", token);

  const getDatesEnvoiEditeurs = (token: string) =>
    api.get("/editeurs/getDateEnvoiEditeur/", token);

  return {
    createEditeur,
    updateEditeur,
    getEditeurs,
    getEditeur,
    deleteEditeur,
    downloadEditeurs,
    search,
    envoiEditeurs,
    getDatesEnvoiEditeurs
  };
};
