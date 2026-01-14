import PublisherContact from "@/entity/PublisherContact";
import { ValueError } from "@/exception/ValueError";

export default class Publisher {
  id: number = -999;
  nom: string = "";
  identifiantBis: string = "";
  dateCreation: Date = new Date();
  groupesEtabRelies: Array<string> = [];
  adresse: string = "";
  contacts: Array<PublisherContact> = [];

  addContact(item: PublisherContact): void {
    this.contacts.push(item);
  }

  findContactById(id: number): PublisherContact {
    const index = this.contacts.findIndex(x => x.id === id);
    if (index == -1) {
      throw new ValueError("Contact width id " + id + " not found");
    } else {
      return this.contacts[index];
    }
  }

  removeContact(item: PublisherContact): void {
    const index = this.contacts.findIndex(
      x => x.id === item.id && x.nom === item.nom
    );
    if (index == -1) {
      throw new ValueError("Contact " + item + " not found");
    }
    // On supprime l'indice
    this.contacts.splice(index, 1);
  }

  clear(): void {
    this.id = -999;
    this.nom = "";
    this.identifiantBis = "";
    this.dateCreation = new Date();
    this.groupesEtabRelies = [];
    this.adresse = "";
    this.contacts = [];
  }
}

