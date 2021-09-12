import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { CompanyModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { sendEmail, SendEmailInterface } from 'lib/messaging/mailer';

interface OrderCreatedEmailTemplateInterface {
  orderItemId: string;
  userName: string;
}

export const orderCreatedEmailTemplate = ({
  orderItemId,
  userName,
}: OrderCreatedEmailTemplateInterface): string => {
  return `
  <div>
    <h2>Здравствуйте ${userName}!</h2>
    <h3>Спасибо за заказ!</h3>
    <h4>Номер вашего заказа ${orderItemId}</h4>
    <p>Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.</p>
  </div>
  `;
};

interface SendOrderCreatedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  customer: UserModel;
}

export const sendOrderCreatedEmail = async ({
  customer,
  orderItemId,
  companySlug,
  city,
  locale,
}: SendOrderCreatedEmailInterface) => {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);

  const text = `
        Здравствуйте ${customer.name}!
        Спасибо за заказ!
        Номер вашего заказа ${orderItemId}
        Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.
    `;
  const content = orderCreatedEmailTemplate({
    userName: customer.name,
    orderItemId,
  });
  const subject = 'Спасибо за заказ!';

  // customer
  if (customer && customer.notifications?.newOrder?.email) {
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
        'notifications.companyNewOrder.email': true,
      })
      .toArray();
    const emails = users.map(({ email }) => email);
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

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminNewOrder.email': true,
    })
    .toArray();
  const emails = users.map(({ email }) => email);
  await sendEmail({
    text,
    to: emails,
    city,
    locale,
    companySlug: DEFAULT_COMPANY_SLUG,
    subject,
    content,
  });
};
