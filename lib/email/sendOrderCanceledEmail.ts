import { DEFAULT_COMPANY_SLUG } from '../../config/common';
import { COL_COMPANIES, COL_USERS } from '../../db/collectionNames';
import { CompanyModel, ObjectIdModel, UserModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { getOrderLink } from '../linkUtils';
import { sendEmail, SendEmailInterface } from './mailer';

interface SendOrderCanceledEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject' | 'to'> {
  orderItemId: string;
  customer: UserModel;
  companyId: ObjectIdModel;
  orderObjectId: ObjectIdModel;
}

export const sendOrderCanceledEmail = async ({
  customer,
  orderItemId,
  companyId,
  citySlug,
  locale,
  companySiteSlug,
  orderObjectId,
}: SendOrderCanceledEmailInterface) => {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    _id: companyId,
  });
  const subject = 'Заказ отменён.';
  const domain = company?.domain;

  // customer
  if (customer && customer.notifications?.canceledOrder?.email) {
    const url = getOrderLink({
      orderObjectId,
      domain,
    });
    const text = `
        Здравствуйте ${customer.name}!
        Заказ № ${orderItemId} отменён.
    `;
    const content = `
      <div>
        <h2>Здравствуйте ${customer.name}!</h2>
        <h4>Заказ № <a href='${url}'>${orderItemId}</a> подтверждён.</h4>
      </div>
      `;

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
  const text = `Заказ № ${orderItemId} отменён.`;
  const content = (url: string) => {
    return `
      <div>
        <h1>Заказ № <a href='${url}'>${orderItemId}</a> отменён.</h1>
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
        'notifications.companyCanceledOrder.email': true,
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
      'notifications.adminCanceledOrder.email': true,
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
