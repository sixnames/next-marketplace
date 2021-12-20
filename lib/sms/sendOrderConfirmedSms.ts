import { DEFAULT_COMPANY_SLUG } from '../../config/common';
import { COL_COMPANIES, COL_USERS } from '../../db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { smsSender, SmsSenderInterface } from './smsUtils';

interface SendOrderConfirmedSmsInterface extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
}

export async function sendOrderConfirmedSms({
  locale,
  orderItemId,
  companySiteSlug,
  customer,
  citySlug,
  companyId,
}: SendOrderConfirmedSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });

  // customer
  if (customer && customer.notifications?.confirmedOrder?.sms) {
    const text = `
        Здравствуйте ${customer.name}!
        Заказ № ${orderItemId} подтверждён.
    `;

    await smsSender({
      text,
      numbers: [customer.phone],
      locale,
      citySlug,
      companySiteSlug,
    });
  }

  // company admins
  const text = `Заказ № ${orderItemId} подтверждён.`;
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyConfirmedOrder.sms': true,
      })
      .toArray();
    const numbers = users.map(({ phone }) => phone);
    if (numbers.length > 0) {
      await smsSender({
        text,
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
      'notifications.adminConfirmedOrder.sms': true,
    })
    .toArray();
  const numbers = users.map(({ phone }) => phone);
  if (numbers.length > 0) {
    await smsSender({
      text,
      numbers,
      locale,
      citySlug,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
    });
  }
}
