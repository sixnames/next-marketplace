import { sendEmail, SendEmailInterface } from 'lib/messaging/mailer';

interface SignUpEmailTemplateInterface {
  userName: string;
  password: string;
}

export const signUpEmailTemplate = ({
  userName,
  password,
}: SignUpEmailTemplateInterface): string => {
  return `
  <div>
    <h2>Здравствуйте ${userName}!</h2>
    <h3>Вы удачно зарегистрировались.</h3>
    <h3>Ваш пароль для авторизации ${password}</h3>
  </div>
  `;
};

interface SignUpEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'>,
    SignUpEmailTemplateInterface {}

export const signUpEmail = async ({
  to,
  userName,
  password,
  companySlug,
  city,
  locale,
}: SignUpEmailInterface) => {
  await sendEmail({
    to,
    companySlug,
    city,
    locale,
    text: `Здравствуйте ${userName}! Вы удачно зарегистрировались. Ваш пароль для авторизации ${password}`,
    subject: 'Регистрация',
    content: signUpEmailTemplate({ userName, password }),
  });
};
