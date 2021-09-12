import {
  DEFAULT_LOCALE,
  NOTIFICATIONS_GROUP_ADMIN,
  NOTIFICATIONS_GROUP_COMPANY,
  NOTIFICATIONS_GROUP_CUSTOMER,
  SECONDARY_LOCALE,
} from '../../config/common';
import { NotificationConfigModel, UserNotificationsModel } from '../../db/dbModels';
import { NotificationConfigInterface, UserNotificationsInterface } from '../../db/uiInterfaces';
import { getFieldStringLocale } from '../../lib/i18n';
import { get, set } from 'lodash';

export function getUserNotificationsTemplate(
  userNotifications?: UserNotificationsModel | null,
): UserNotificationsModel {
  return {
    // customer
    newOrder: {
      group: NOTIFICATIONS_GROUP_CUSTOMER,
      sms: userNotifications?.newOrder?.sms,
      email: userNotifications?.newOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Новый заказ',
        [SECONDARY_LOCALE]: 'New order',
      },
    },
    confirmedOrder: {
      group: NOTIFICATIONS_GROUP_CUSTOMER,
      sms: userNotifications?.confirmedOrder?.sms,
      email: userNotifications?.confirmedOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Подтверждение заказа',
        [SECONDARY_LOCALE]: 'Confirmed order',
      },
    },
    canceledOrder: {
      group: NOTIFICATIONS_GROUP_CUSTOMER,
      sms: userNotifications?.canceledOrder?.sms,
      email: userNotifications?.canceledOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена заказа',
        [SECONDARY_LOCALE]: 'Canceled order',
      },
    },
    canceledOrderProduct: {
      group: NOTIFICATIONS_GROUP_CUSTOMER,
      sms: userNotifications?.canceledOrderProduct?.sms,
      email: userNotifications?.canceledOrderProduct?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена товара заказа',
        [SECONDARY_LOCALE]: 'Canceled order product',
      },
    },

    // company
    companyNewOrder: {
      group: NOTIFICATIONS_GROUP_COMPANY,
      sms: userNotifications?.companyNewOrder?.sms,
      email: userNotifications?.companyNewOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Новый заказ для сотрудника компании',
        [SECONDARY_LOCALE]: 'New order for company manager',
      },
    },
    companyConfirmedOrder: {
      group: NOTIFICATIONS_GROUP_COMPANY,
      sms: userNotifications?.companyConfirmedOrder?.sms,
      email: userNotifications?.companyConfirmedOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Подтверждение заказа для сотрудника компании',
        [SECONDARY_LOCALE]: 'Confirmed order for company manager',
      },
    },
    companyCanceledOrder: {
      group: NOTIFICATIONS_GROUP_COMPANY,
      sms: userNotifications?.companyCanceledOrder?.sms,
      email: userNotifications?.companyCanceledOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена заказа для сотрудника компании',
        [SECONDARY_LOCALE]: 'Canceled order for company manager',
      },
    },
    companyCanceledOrderProduct: {
      group: NOTIFICATIONS_GROUP_COMPANY,
      sms: userNotifications?.companyCanceledOrderProduct?.sms,
      email: userNotifications?.companyCanceledOrderProduct?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена товара заказа для сотрудника компании',
        [SECONDARY_LOCALE]: 'Canceled order product for company manager',
      },
    },

    // admin
    adminNewOrder: {
      group: NOTIFICATIONS_GROUP_ADMIN,
      sms: userNotifications?.adminNewOrder?.sms,
      email: userNotifications?.adminNewOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Новый заказ для сотрудника сайта',
        [SECONDARY_LOCALE]: 'New order for site manager',
      },
    },
    adminConfirmedOrder: {
      group: NOTIFICATIONS_GROUP_ADMIN,
      sms: userNotifications?.adminConfirmedOrder?.sms,
      email: userNotifications?.adminConfirmedOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Подтверждение заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Confirmed order for site manager',
      },
    },
    adminCanceledOrder: {
      group: NOTIFICATIONS_GROUP_ADMIN,
      sms: userNotifications?.adminCanceledOrder?.sms,
      email: userNotifications?.adminCanceledOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Canceled order for site manager',
      },
    },
    adminCanceledOrderProduct: {
      group: NOTIFICATIONS_GROUP_ADMIN,
      sms: userNotifications?.adminCanceledOrderProduct?.sms,
      email: userNotifications?.adminCanceledOrderProduct?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена товара заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Canceled order product for site manager',
      },
    },
  };
}

export function getUserInitialNotificationsConf(): UserNotificationsModel {
  const notifications = getUserNotificationsTemplate();
  set(notifications, 'newOrder.email', true);
  set(notifications, 'newOrder.sms', true);
  set(notifications, 'confirmedOrder.email', true);
  set(notifications, 'confirmedOrder.sms', true);
  set(notifications, 'canceledOrder.email', true);
  set(notifications, 'canceledOrder.sms', true);
  set(notifications, 'canceledOrderProduct.email', true);
  set(notifications, 'canceledOrderProduct.sms', true);
  return notifications;
}

export interface GetUserNotificationsInterface {
  userNotifications?: UserNotificationsModel | null;
  locale: string;
}

export function getUserNotifications({
  userNotifications,
  locale,
}: GetUserNotificationsInterface): UserNotificationsInterface {
  const notifications = getUserNotificationsTemplate(userNotifications);

  return Object.keys(notifications).reduce((acc: UserNotificationsInterface, key) => {
    const config: NotificationConfigModel = get(notifications, key);
    if (!config) {
      return acc;
    }
    const castedConfig: NotificationConfigInterface = {
      ...config,
      name: getFieldStringLocale(config.nameI18n, locale),
    };
    set(acc, key, castedConfig);
    return acc;
  }, {});
}

export interface GetUserNotificationsGroupInterface extends GetUserNotificationsInterface {
  group: string;
}

export function getUserNotificationsGroup({
  userNotifications,
  locale,
  group,
}: GetUserNotificationsGroupInterface): NotificationConfigInterface[] {
  const notifications = getUserNotificationsTemplate(userNotifications);
  const castedNotifications = getUserNotifications({ userNotifications, locale });

  return Object.keys(castedNotifications).reduce((acc: NotificationConfigInterface[], key) => {
    const config: NotificationConfigInterface = get(notifications, key);
    if (!config || config.group !== group) {
      return acc;
    }
    return [...acc, config];
  }, []);
}
