import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { sendEmail, SendEmailInterface } from 'lib/email/mailer';

interface SendOrderCanceledEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
}

export const sendOrderCanceledEmail = async ({
  customer,
  orderItemId,
  companyId,
  city,
  locale,
  companySiteSlug,
}: SendOrderCanceledEmailInterface) => {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });
  const subject = 'Заказ отменён.';

  // customer
  if (customer && customer.notifications?.canceledOrder?.email) {
    const text = `
        Здравствуйте ${customer.name}!
        Заказ № ${orderItemId} отменён.
    `;
    const content = `
      <div>
        <h2>Здравствуйте ${customer.name}!</h2>
        <h4>Заказ № ${orderItemId} подтверждён.</h4>
      </div>
      `;

    await sendEmail({
      text,
      to: customer.email,
      city,
      locale,
      companySiteSlug,
      subject,
      content,
    });
  }

  // admin email content
  const text = `Заказ № ${orderItemId} отменён.`;
  const content = `
      <div>
        <h1>Заказ № ${orderItemId} отменён.</h1>
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
        'notifications.companyCanceledOrder.email': true,
      })
      .toArray();
    const emails = users.map(({ email }) => email);

    if (emails.length > 0) {
      await sendEmail({
        text,
        to: emails,
        city,
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
      'notifications.adminCanceledOrder.email': true,
    })
    .toArray();
  const emails = users.map(({ email }) => email);
  if (emails.length > 0) {
    await sendEmail({
      text,
      to: emails,
      city,
      locale,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
      subject,
      content,
    });
  }
};
