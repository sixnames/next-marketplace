import { DEFAULT_COMPANY_SLUG } from '../../config/common';
import { COL_COMPANIES, COL_USERS } from '../../db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { getOrderLink } from '../linkUtils';
import { sendEmail, SendEmailInterface } from './mailer';

interface SendOrderCreatedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
  orderObjectId: ObjectIdModel;
}

export const sendOrderCreatedEmail = async ({
  customer,
  orderItemId,
  companyId,
  companySiteSlug,
  citySlug,
  locale,
  orderObjectId,
}: SendOrderCreatedEmailInterface) => {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });
  const domain = company?.domain;

  // customer
  if (customer && customer.notifications?.newOrder?.email) {
    const url = getOrderLink({
      orderObjectId,
      domain,
    });
    const text = `
        Здравствуйте ${customer.name}!
        Спасибо за заказ!
        Номер вашего заказа ${orderItemId}
        Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.
    `;
    const content = `
      <div>
        <h2>Здравствуйте ${customer.name}!</h2>
        <h3>Спасибо за заказ!</h3>
        <h4>Номер вашего заказа <a href='${url}'>${orderItemId}</a></h4>
        <p>Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.</p>
      </div>
      `;
    const subject = 'Спасибо за заказ!';

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
  const subject = 'Новый заказ';
  const text = `Поступил новый заказ № ${orderItemId}`;
  const content = (url: string) => {
    return `
      <div>
        <h1>Поступил новый заказ № <a href='${url}'>${orderItemId}</a></h1>
      </div>
      `;
  };

  // company admins
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

    const url = getOrderLink({
      variant: 'companyManager',
      orderObjectId,
      companyId,
      domain,
    });

    if (emails.length > 0) {
      await sendEmail({
        text,
        to: emails,
        citySlug,
        locale,
        companySiteSlug,
        subject,
        content: content(url),
      });
    }
  }

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminNewOrder.email': true,
    })
    .toArray();
  const emails = users.map(({ email }) => email);
  const url = getOrderLink({
    variant: 'siteAdmin',
    orderObjectId,
  });

  if (emails.length > 0) {
    await sendEmail({
      text,
      to: emails,
      citySlug,
      locale,
      companySiteSlug: DEFAULT_COMPANY_SLUG,
      subject,
      content: content(url),
    });
  }
};
