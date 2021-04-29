import { sendEmail, SendEmailInterface } from './mailer';

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

export const signUpEmail = async ({ to, userName, password }: SignUpEmailInterface) => {
  await sendEmail({
    to,
    text: `Здравствуйте ${userName}! Вы удачно зарегистрировались.`,
    subject: 'Регистрация',
    content: signUpEmailTemplate({ userName, password }),
  });
};
