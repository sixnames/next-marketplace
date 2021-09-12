import { NotificationConfigModel, UserNotificationsModel } from 'db/dbModels';

const notificationDefaultConfig: NotificationConfigModel = {
  sms: false,
  email: false,
};

export function getUserNotificationsTemplate(
  userNotifications?: UserNotificationsModel,
): UserNotificationsModel {
  return {
    // customer
    newOrder: userNotifications?.newOrder || notificationDefaultConfig,
    confirmedOrder: userNotifications?.confirmedOrder || notificationDefaultConfig,
    canceledOrder: userNotifications?.canceledOrder || notificationDefaultConfig,
    canceledOrderProduct: userNotifications?.canceledOrderProduct || notificationDefaultConfig,

    // admin
    adminNewOrder: userNotifications?.adminNewOrder || notificationDefaultConfig,
    adminConfirmedOrder: userNotifications?.adminConfirmedOrder || notificationDefaultConfig,
    adminCanceledOrder: userNotifications?.adminCanceledOrder || notificationDefaultConfig,
    adminCanceledOrderProduct:
      userNotifications?.adminCanceledOrderProduct || notificationDefaultConfig,

    // company
    companyNewOrder: userNotifications?.companyNewOrder || notificationDefaultConfig,
    companyConfirmedOrder: userNotifications?.companyConfirmedOrder || notificationDefaultConfig,
    companyCanceledOrder: userNotifications?.companyCanceledOrder || notificationDefaultConfig,
    companyCanceledOrderProduct:
      userNotifications?.companyCanceledOrderProduct || notificationDefaultConfig,
  };
}
