import { DEFAULT_COMPANY_SLUG } from '../../config/common';
import { COL_COMPANIES, COL_USERS } from '../../db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { sendEmail, SendEmailInterface } from './mailer';

interface SendOrderProductCanceledEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  productOriginalName: string;
  customer: UserModel;
  companyId: ObjectIdModel;
}

export const sendOrderProductCanceledEmail = async ({
  customer,
  orderItemId,
  companyId,
  companySiteSlug,
  productOriginalName,
  citySlug,
  locale,
}: SendOrderProductCanceledEmailInterface) => {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });

  // customer
  if (customer && customer.notifications?.canceledOrderProduct?.email) {
    const text = `
        Здравствуйте ${customer.name}!
        Товар ${productOriginalName} отменён в заказе № ${orderItemId}.
    `;
    const content = `
      <div>
        <h2>Здравствуйте ${customer.name}!</h2>
        <h4>Заказ № ${orderItemId} подтверждён.</h4>
      </div>
      `;
    const subject = 'Товар отменён.';

    await sendEmail({
      text,
      to: customer.email,
      citySlug,
      locale,
      companySiteSlug,
      subject,
      content,
    });
  }

  // admin email content
  const subject = 'Товар отменён.';
  const text = `Товар ${productOriginalName} отменён в заказе № ${orderItemId}.`;
  const content = `
      <div>
        <h1>Товар ${productOriginalName} отменён в заказе № ${orderItemId}.</h1>
      </div>
      `;

  // company admins
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyCanceledOrderProduct.email': true,
      })
      .toArray();
    const emails = users.map(({ email }) => email);

    if (emails.length > 0) {
      await sendEmail({
        text,
        to: emails,
        citySlug,
        locale,
        companySiteSlug,
        subject,
        content,
      });
    }
  }

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminCanceledOrderProduct.email': true,
    })
    .toArray();
  const emails = users.map(({ email }) => email);
  if (emails.length > 0) {
    await sendEmail({
      text,
      to: emails,
      citySlug,
      locale,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
      subject,
      content,
    });
  }
};
