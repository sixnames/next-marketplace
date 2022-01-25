import { sendEmail, SendEmailInterface } from './mailer';

interface SendGiftCertificateEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'> {
  userName: string;
  value: number;
}

export const sendGiftCertificateEmail = async ({
  to,
  userName,
  companySiteSlug,
  citySlug,
  locale,
  value,
}: SendGiftCertificateEmailInterface) => {
  await sendEmail({
    to,
    companySiteSlug,
    citySlug,
    locale,
    text: `Здравствуйте ${userName}! Вам присвоен подарочный сертификат на сумму ${value} р.`,
    subject: 'Подарочный сертификат',
    content: `
      <div>
        <h2>Здравствуйте ${userName}!</h2>
        <h3>Вам присвоен подарочный сертификат на сумму ${value} р.</h3>
      </div>
      `,
  });
};
