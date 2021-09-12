import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { smsSender, SmsSenderInterface } from 'lib/sms/smsUtils';

interface SendOrderCreatedSmsInterface extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  customer: UserModel;
}

export async function sendOrderCreatedSms({
  locale,
  orderItemId,
  customer,
  city,
  companySlug,
}: SendOrderCreatedSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    slug: companySlug,
  });

  const text = `
        Здравствуйте ${customer.name}!
        Спасибо за заказ!
        Номер вашего заказа ${orderItemId}
        Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.
    `;

  // customer
  if (customer && customer.notifications?.newOrder?.sms) {
    await smsSender({
      text,
      numbers: [customer.phone],
      locale,
      city,
      companySlug,
    });
  }

  // company admins
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
    await smsSender({
      text,
      numbers,
      locale,
      city,
      companySlug,
    });
  }

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminNewOrder.sms': true,
    })
    .toArray();
  const numbers = users.map(({ phone }) => phone);
  await smsSender({
    text,
    numbers,
    locale,
    city,
    companySlug: DEFAULT_COMPANY_SLUG,
  });
}
