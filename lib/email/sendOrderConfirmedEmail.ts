import { ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDbCollections } from '../../db/mongodb';
import { DEFAULT_COMPANY_SLUG } from '../config/common';
import { sendEmail, SendEmailInterface } from './mailer';

interface SendOrderConfirmedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
}

export const sendOrderConfirmedEmail = async ({
  customer,
  orderItemId,
  companyId,
  companySiteSlug,
  citySlug,
  locale,
}: SendOrderConfirmedEmailInterface) => {
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();
  const companiesCollection = collections.companiesCollection();
  const company = await companiesCollection.findOne({
    _id: companyId,
  });

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
      citySlug,
      locale,
      companySiteSlug,
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
      'notifications.adminConfirmedOrder.email': true,
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
