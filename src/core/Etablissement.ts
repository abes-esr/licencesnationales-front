import ContactEtablissement from "@/core/ContactEtablissement";
import Ip from "@/core/Ip";
import { ValueError } from "@/exception/ValueError";

export class Etablissement {
  id: number = -999;
  nom: string = "";
  siren: string = "";
  dateCreation: Date = new Date();
  dateCreationFormattedInString: string = "";
  typeEtablissement: string = "";
  statut: string = "";
  idAbes: string = "";
  contact: ContactEtablissement = new ContactEtablissement();
  ips: Array<Ip> = [];
  statutIP: string = "";

  addIp(item: Ip): void {
    this.ips.push(item);
  }

  findIpById(id: number): Ip {
    const index = this.ips.findIndex(x => x.id === id);
    if (index == -1) {
      throw new ValueError("ip with id " + id + " not found");
    } else {
      return this.ips[index];
    }
  }

  removeIp(item: Ip): void {
    const index = this.ips.findIndex(x => x.id === item.id && x.ip === item.ip);
    if (index == -1) {
      throw new ValueError("Ip " + item + " not found");
    }
    // On supprime l'indice
    this.ips.splice(index, 1);
  }

  reset(): void {
    this.nom = "";
    this.siren = "";
    this.typeEtablissement = "";
    this.contact.reset();
  }
}
export default Etablissement;
