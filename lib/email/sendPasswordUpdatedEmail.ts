import { sendEmail, SendEmailInterface } from 'lib/email/mailer';

interface SendPasswordUpdatedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'> {
  userName: string;
}

export const sendPasswordUpdatedEmail = async ({
  to,
  userName,
  companySlug,
  city,
  locale,
}: SendPasswordUpdatedEmailInterface) => {
  await sendEmail({
    to,
    city,
    locale,
    companySlug,
    text: `Здравствуйте ${userName}! Ваш пароль обновлён.`,
    subject: 'Обновление пароля',
    content: `
      <div>
        <h2>Здравствуйте ${userName}!</h2>
        <h3>Ваш пароль обновлён.</h3>
      </div>
      `,
  });
};
