import Institution from "./Institution";

export class Ip {
  id: number = -999;
  ip: string = "";
  createdAt: Date = new Date();
  updatedAt: Date | null = null;
  comments: Array<string> = [];
  status?: string = "";
  typeAcces?: string = "";
  typeIp?: string = "";
  institution?: Institution = new Institution();
}
export default Ip;
