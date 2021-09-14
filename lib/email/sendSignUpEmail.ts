import { sendEmail, SendEmailInterface } from 'lib/email/mailer';

interface SendSignUpEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'> {
  userName: string;
  password: string;
}

export const sendSignUpEmail = async ({
  to,
  userName,
  password,
  companySiteSlug,
  city,
  locale,
}: SendSignUpEmailInterface) => {
  await sendEmail({
    to,
    companySiteSlug,
    city,
    locale,
    text: `Здравствуйте ${userName}! Вы удачно зарегистрировались. Ваш пароль для авторизации ${password}`,
    subject: 'Регистрация',
    content: `
      <div>
        <h2>Здравствуйте ${userName}!</h2>
        <h3>Вы удачно зарегистрировались.</h3>
        <h3>Ваш пароль для авторизации ${password}</h3>
      </div>
      `,
  });
};
