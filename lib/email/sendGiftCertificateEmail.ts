import { sendEmail, SendEmailInterface } from './mailer';

interface SendGiftCertificateEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'> {
  userName: string;
  code: string;
}

export const sendGiftCertificateEmail = async ({
  to,
  userName,
  companySiteSlug,
  code,
  citySlug,
  locale,
}: SendGiftCertificateEmailInterface) => {
  await sendEmail({
    to,
    companySiteSlug,
    citySlug,
    locale,
    text: `Здравствуйте ${userName}! Вам присвоен подарочный сертификат с кодом ${code}.`,
    subject: 'Подарочный сертификат',
    content: `
      <div>
        <h2>Здравствуйте ${userName}!</h2>
        <h3>Вам присвоен подарочный сертификат с кодом ${code}.</h3>
      </div>
      `,
  });
};
