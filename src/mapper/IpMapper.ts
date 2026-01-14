import Ip from "@/entity/Ip";

export interface JsonIpResponse {
  id: number;
  ip: string;
  dateCreation: string;
  dateModification: string | null;
  commentaires: string;
  statut: string;
}

export class IpMapper {
  static toDomain(response: JsonIpResponse): Ip {
    const ip = new Ip();
    ip.id = response.id;
    ip.ip = response.ip;
    ip.dateCreation = new Date(response.dateCreation);
    ip.dateModification = response.dateModification ? new Date(response.dateModification) : new Date();
    ip.commentaires = response.commentaires;
    ip.statut = response.statut;
    return ip;
  }
}

