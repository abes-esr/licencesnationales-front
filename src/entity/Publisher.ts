import PublisherContact from "@/entity/PublisherContact";
import { ValueError } from "@/exception/ValueError";

export default class Publisher {
  id: number = -999;
  name: string = "";
  secondaryId: string = "";
  createdAt: Date = new Date();
  relatedInstitutionTypes: Array<string> = [];
  address: string = "";
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
      x => x.id === item.id && x.lastName === item.lastName
    );
    if (index == -1) {
      throw new ValueError("Contact " + item + " not found");
    }
    // On supprime l'indice
    this.contacts.splice(index, 1);
  }

  clear(): void {
    this.id = -999;
    this.name = "";
    this.secondaryId = "";
    this.createdAt = new Date();
    this.relatedInstitutionTypes = [];
    this.address = "";
    this.contacts = [];
  }
}

