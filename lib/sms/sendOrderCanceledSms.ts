import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { smsSender, SmsSenderInterface } from 'lib/sms/smsUtils';

interface SendOrderCanceledSmsInterface extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  customer: UserModel;
}

export async function sendOrderCanceledSms({
  locale,
  orderItemId,
  customer,
  city,
  companySlug,
}: SendOrderCanceledSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    slug: companySlug,
  });

  // customer
  if (customer && customer.notifications?.canceledOrder?.sms) {
    const text = `
        Здравствуйте ${customer.name}!
        Заказ № ${orderItemId} отменён.
    `;

    await smsSender({
      text,
      numbers: [customer.phone],
      locale,
      city,
      companySlug,
    });
  }

  // company admins
  const text = `Заказ № ${orderItemId} отменён.`;
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
    if (numbers.length > 0) {
      await smsSender({
        text,
        numbers,
        locale,
        city,
        companySlug,
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
  if (numbers.length > 0) {
    await smsSender({
      text,
      numbers,
      locale,
      city,
      companySlug: DEFAULT_COMPANY_SLUG,
    });
  }
}
