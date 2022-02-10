import { GiftCertificateModel } from 'db/dbModels';
import { sendEmail, SendEmailInterface } from './mailer';

interface SendGiftCertificateEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'> {
  userName: string;
  giftCertificate: GiftCertificateModel;
}

export const sendGiftCertificateEmail = async ({
  to,
  userName,
  companySiteSlug,
  citySlug,
  locale,
  giftCertificate,
}: SendGiftCertificateEmailInterface) => {
  await sendEmail({
    to,
    companySiteSlug,
    citySlug,
    locale,
    text: `Здравствуйте ${userName}! Вам присвоен подарочный сертификат на сумму ${giftCertificate.value} р. Код сертификата ${giftCertificate.code}.`,
    subject: 'Подарочный сертификат',
    content: `
      <div>
        <h2>Здравствуйте ${userName}!</h2>
        <h3>Вам присвоен подарочный сертификат на сумму ${giftCertificate.value} р.</h3>
        <h3>Код сертификата ${giftCertificate.code}.</h3>
      </div>
      `,
  });
};
