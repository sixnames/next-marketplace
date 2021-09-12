import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { sendEmail, SendEmailInterface } from 'lib/email/mailer';

interface SendOrderCreatedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  customer: UserModel;
}

export const sendOrderConfirmedEmail = async ({
  customer,
  orderItemId,
  companySlug,
  city,
  locale,
}: SendOrderCreatedEmailInterface) => {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

  // customer
  if (customer && customer.notifications?.confirmedOrder?.email) {
    const text = `
        Здравствуйте ${customer.name}!
        Заказ № ${orderItemId} подтверждён.
    `;
    const content = `
      <div>
        <h2>Здравствуйте ${customer.name}!</h2>
        <h4>Заказ № ${orderItemId} подтверждён.</h4>
      </div>
      `;
    const subject = 'Заказ подтверждён.';

    await sendEmail({
      text,
      to: customer.email,
      city,
      locale,
      companySlug,
      subject,
      content,
    });
  }

  // admin email content
  const subject = 'Заказ подтверждён.';
  const text = `Заказ № ${orderItemId} подтверждён.`;
  const content = `
      <div>
        <h1>Заказ № ${orderItemId} подтверждён.</h1>
      </div>
      `;

  // company admins
  const company = await companiesCollection.findOne({
    slug: companySlug,
  });
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyConfirmedOrder.email': true,
      })
      .toArray();
    const emails = users.map(({ email }) => email);

    if (emails.length > 0) {
      await sendEmail({
        text,
        to: emails,
        city,
        locale,
        companySlug,
        subject,
        content,
      });
    }
  }

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminConfirmedOrder.email': true,
    })
    .toArray();
  const emails = users.map(({ email }) => email);
  if (emails.length > 0) {
    await sendEmail({
      text,
      to: emails,
      city,
      locale,
      companySlug: DEFAULT_COMPANY_SLUG,
      subject,
      content,
    });
  }
};
