import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { smsSender, SmsSenderInterface } from 'lib/sms/smsUtils';

interface SendOrderProductCanceledSmsInterface
  extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  productOriginalName: string;
  customer: UserModel;
}

export async function sendOrderProductCanceledSms({
  locale,
  orderItemId,
  customer,
  city,
  companySlug,
  productOriginalName,
}: SendOrderProductCanceledSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    slug: companySlug,
  });

  // customer
  if (customer && customer.notifications?.canceledOrderProduct?.sms) {
    const text = `
        Здравствуйте ${customer.name}!
        Товар ${productOriginalName} отменён в заказе № ${orderItemId}.
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
  const text = `Товар ${productOriginalName} отменён в заказе № ${orderItemId}.`;
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyCanceledOrderProduct.sms': true,
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
      'notifications.adminCanceledOrderProduct.sms': true,
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
