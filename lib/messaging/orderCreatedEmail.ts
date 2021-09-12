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
    <p>Также, мы дарим вам дисконтную карту, по которой вы сможете получать скидки на все последующие заказы.</p>
  </div>
  `;
};

interface SendOrderCreatedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'>,
    OrderCreatedEmailTemplateInterface {}

export const sendOrderCreatedEmail = async ({
  to,
  userName,
  orderItemId,
  companySlug,
  city,
  locale,
}: SendOrderCreatedEmailInterface) => {
  await sendEmail({
    text: `
        Здравствуйте ${userName}!
        Спасибо за заказ!
        Номер вашего заказа ${orderItemId}
        Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.
        Также, мы дарим вам дисконтную карту, по которой вы сможете получать скидки на все последующие заказы.
    `,
    to,
    city,
    locale,
    companySlug,
    subject: 'Спасибо за заказ!',
    content: orderCreatedEmailTemplate({ userName, orderItemId }),
  });
};
