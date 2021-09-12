import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { NotificationConfigModel, UserNotificationsModel } from 'db/dbModels';
import { NotificationConfigInterface, UserNotificationsInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { get, set } from 'lodash';

export function getUserNotificationsTemplate(
  userNotifications?: UserNotificationsModel | null,
): UserNotificationsModel {
  return {
    // customer
    newOrder: {
      sms: userNotifications?.newOrder?.sms,
      email: userNotifications?.newOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Новый заказ',
        [SECONDARY_LOCALE]: 'New order',
      },
    },
    confirmedOrder: {
      sms: userNotifications?.confirmedOrder?.sms,
      email: userNotifications?.confirmedOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Подтверждение заказа',
        [SECONDARY_LOCALE]: 'Confirmed order',
      },
    },
    canceledOrder: {
      sms: userNotifications?.canceledOrder?.sms,
      email: userNotifications?.canceledOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена заказа',
        [SECONDARY_LOCALE]: 'Canceled order',
      },
    },
    canceledOrderProduct: {
      sms: userNotifications?.canceledOrderProduct?.sms,
      email: userNotifications?.canceledOrderProduct?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена товара заказа',
        [SECONDARY_LOCALE]: 'Canceled order product',
      },
    },

    // admin
    adminNewOrder: {
      sms: userNotifications?.adminNewOrder?.sms,
      email: userNotifications?.adminNewOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Новый заказ для сотрудника сайта',
        [SECONDARY_LOCALE]: 'New order for site manager',
      },
    },
    adminConfirmedOrder: {
      sms: userNotifications?.adminConfirmedOrder?.sms,
      email: userNotifications?.adminConfirmedOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Подтверждение заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Confirmed order for site manager',
      },
    },
    adminCanceledOrder: {
      sms: userNotifications?.adminCanceledOrder?.sms,
      email: userNotifications?.adminCanceledOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Canceled order for site manager',
      },
    },
    adminCanceledOrderProduct: {
      sms: userNotifications?.adminCanceledOrderProduct?.sms,
      email: userNotifications?.adminCanceledOrderProduct?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена товара заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Canceled order product for site manager',
      },
    },

    // company
    companyNewOrder: {
      sms: userNotifications?.companyNewOrder?.sms,
      email: userNotifications?.companyNewOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Новый заказ для сотрудника сайта',
        [SECONDARY_LOCALE]: 'New order for company manager',
      },
    },
    companyConfirmedOrder: {
      sms: userNotifications?.companyConfirmedOrder?.sms,
      email: userNotifications?.companyConfirmedOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Подтверждение заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Confirmed order for company manager',
      },
    },
    companyCanceledOrder: {
      sms: userNotifications?.companyCanceledOrder?.sms,
      email: userNotifications?.companyCanceledOrder?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Canceled order for company manager',
      },
    },
    companyCanceledOrderProduct: {
      sms: userNotifications?.companyCanceledOrderProduct?.sms,
      email: userNotifications?.companyCanceledOrderProduct?.email,
      nameI18n: {
        [DEFAULT_LOCALE]: 'Отмена товара заказа для сотрудника сайта',
        [SECONDARY_LOCALE]: 'Canceled order product for company manager',
      },
    },
  };
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
