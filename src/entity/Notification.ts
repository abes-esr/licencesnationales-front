export class Notification {
  constructor(
    n = 0,
    s = "",
    date = new Date(),
    notificationType = "Non spécifié",
    institutionName = "Défaut"
  ) {
    this.index = n;
    this.siren = s;
    this.eventDate = date;
    this.notificationType = notificationType;
    this.institutionName = institutionName;
  }

  index: number;
  siren: string = "";
  eventDate: Date = new Date();
  notificationType: string = "";
  institutionName: string = "";
}
export default Notification;

