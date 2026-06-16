import InstitutionContact from "@/entity/InstitutionContact";
import Ip from "@/entity/Ip";

export class Institution {
  id: number = -999;
  name: string = "";
  siren: string = "";
  createdAt: Date = new Date();
  createdAtFormatted: string = "";
  lastIpUpdateDate?: string;
  institutionType: string = "";
  status?: string;
  abesId?: string;
  contact: InstitutionContact = new InstitutionContact();
  ips: Array<Ip> = [];
  ipStatus?: string;

  addIp(item: Ip): void {
    this.ips.push(item);
  }

  findIpById(id: number): Ip {
    const index = this.ips.findIndex((x) => x.id === id);
    if (index == -1) {
      throw new Error("ip with id " + id + " not found");
    } else {
      return this.ips[index];
    }
  }

  removeIp(item: Ip): void {
    const index = this.ips.findIndex((x) => x.id === item.id && x.ip === item.ip);
    if (index == -1) {
      throw new Error("Ip " + item.id + " not found");
    }
    this.ips.splice(index, 1);
  }

  reset(): void {
    this.name = "";
    this.siren = "";
    this.institutionType = "";
    this.contact.reset();
  }
}
export default Institution;
