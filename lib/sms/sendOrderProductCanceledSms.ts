import { ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDbCollections } from '../../db/mongodb';
import { DEFAULT_COMPANY_SLUG } from '../config/common';
import { smsSender, SmsSenderInterface } from './smsUtils';

interface SendOrderProductCanceledSmsInterface
  extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  productOriginalName: string;
  customer: UserModel;
  companyId: ObjectIdModel;
}

export async function sendOrderProductCanceledSms({
  locale,
  orderItemId,
  customer,
  citySlug,
  companyId,
  companySiteSlug,
  productOriginalName,
}: SendOrderProductCanceledSmsInterface) {
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();
  const companiesCollection = collections.companiesCollection();
  const company = await companiesCollection.findOne({
    _id: companyId,
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
      citySlug,
      companySiteSlug,
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
        citySlug,
        companySiteSlug,
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
      citySlug,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
    });
  }
}
