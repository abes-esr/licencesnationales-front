import Notification from "@/entity/Notification";

export interface JsonNotificationAdminResponse {
  siren: string;
  dateEvent: Date;
  typeNotif: string;
  nomEtab: string;
}

export class NotificationMapper {
  static toDomainList(responses: Array<JsonNotificationAdminResponse>): Array<Notification> {
    const notifications = responses.map((element, index) => {
      const notification = new Notification();
      notification.index = index;
      notification.siren = element.siren;
      notification.eventDate = element.dateEvent;
      notification.notificationType = element.typeNotif;
      notification.institutionName = element.nomEtab;
      return notification;
    });

    notifications.sort((a, b) => {
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });

    return notifications;
  }
}

