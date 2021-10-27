import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getOrderLink } from 'lib/linkUtils';
import { smsSender, SmsSenderInterface } from 'lib/sms/smsUtils';

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
  city,
  companyId,
}: SendOrderCreatedSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });

  // customer
  if (customer && customer.notifications?.newOrder?.sms) {
    const url = getOrderLink({
      orderObjectId,
    });
    const text = `Здравствуйте ${customer.name}! Спасибо за заказ! Номер вашего заказа ${orderItemId} ${url}`;

    await smsSender({
      text,
      numbers: [customer.phone],
      locale,
      city,
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
    });
    if (numbers.length > 0) {
      await smsSender({
        text: text(url),
        numbers,
        locale,
        city,
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
      city,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
    });
  }
}
