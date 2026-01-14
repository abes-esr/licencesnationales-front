export class Notification {
  constructor(
    n = 0,
    s = "",
    date = new Date(),
    typeNotif = "Non spécifié",
    nomEtablissement = "Défaut"
  ) {
    this.index = n;
    this.siren = s;
    this.dateEvent = date;
    this.typeNotif = typeNotif;
    this.nomEtab = nomEtablissement;
  }

  index: number;
  siren: string = "";
  dateEvent: Date = new Date();
  typeNotif: string = "";
  nomEtab: string = "";
}
export default Notification;
