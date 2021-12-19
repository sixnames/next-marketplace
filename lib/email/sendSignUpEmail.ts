import { sendEmail, SendEmailInterface } from './mailer';

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
  citySlug,
  locale,
}: SendSignUpEmailInterface) => {
  await sendEmail({
    to,
    companySiteSlug,
    citySlug,
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
