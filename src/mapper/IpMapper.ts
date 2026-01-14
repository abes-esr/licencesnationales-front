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
    ip.createdAt = new Date(response.dateCreation);
    ip.updatedAt = response.dateModification ? new Date(response.dateModification) : new Date();
    ip.comments = response.commentaires;
    ip.status = response.statut;
    return ip;
  }
}

