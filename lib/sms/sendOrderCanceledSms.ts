import { DEFAULT_COMPANY_SLUG } from '../../config/common';
import { COL_COMPANIES, COL_USERS } from '../../db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { getOrderLink } from '../linkUtils';
import { smsSender, SmsSenderInterface } from './smsUtils';

interface SendOrderCanceledSmsInterface extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
  orderObjectId: ObjectIdModel;
}

export async function sendOrderCanceledSms({
  locale,
  orderItemId,
  customer,
  companySiteSlug,
  citySlug,
  companyId,
  orderObjectId,
}: SendOrderCanceledSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });
  const domain = company?.domain;

  // customer
  if (customer && customer.notifications?.canceledOrder?.sms) {
    const url = getOrderLink({
      orderObjectId,
      domain,
    });
    const text = `Здравствуйте ${customer.name}! Заказ № ${orderItemId} отменён. ${url}`;

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
    return `Заказ № ${orderItemId} отменён. ${url}`;
  };
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyCanceledOrder.sms': true,
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
      'notifications.adminCanceledOrder.sms': true,
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
