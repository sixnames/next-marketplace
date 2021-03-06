import { ObjectIdModel, UserModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { getOrderLink } from 'lib/links/linkUtils';
import { DEFAULT_COMPANY_SLUG } from '../config/common';
import { smsSender, SmsSenderInterface } from './smsUtils';

interface SendOrderCreatedSmsInterface extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
  orderObjectId: ObjectIdModel;
}

export async function sendOrderCreatedSms({
  locale,
  orderItemId,
  customer,
  companySiteSlug,
  orderObjectId,
  citySlug,
  companyId,
}: SendOrderCreatedSmsInterface) {
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();
  const companiesCollection = collections.companiesCollection();
  const company = await companiesCollection.findOne({
    _id: companyId,
  });
  const domain = company?.domain;

  // customer
  if (customer && customer.notifications?.newOrder?.sms) {
    const url = getOrderLink({
      orderObjectId,
      domain,
    });
    const text = `Здравствуйте ${customer.name}! Спасибо за заказ! Номер вашего заказа ${orderItemId} ${url}`;

    await smsSender({
      text,
      numbers: [customer.phone],
      locale,
      citySlug,
      companySiteSlug,
    });
  }

  // company admins
  const text = (url: string) => {
    return `Поступил новый заказ № ${orderItemId} ${url}`;
  };
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyNewOrder.sms': true,
      })
      .toArray();
    const numbers = users.map(({ phone }) => phone);
    const url = getOrderLink({
      variant: 'companyManager',
      orderObjectId,
      companyId,
      domain,
    });
    if (numbers.length > 0) {
      await smsSender({
        text: text(url),
        numbers,
        locale,
        citySlug,
        companySiteSlug,
      });
    }
  }

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminNewOrder.sms': true,
    })
    .toArray();
  const numbers = users.map(({ phone }) => phone);
  const url = getOrderLink({
    variant: 'siteAdmin',
    orderObjectId,
  });

  if (numbers.length > 0) {
    await smsSender({
      text: text(url),
      numbers,
      locale,
      citySlug,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
    });
  }
}
