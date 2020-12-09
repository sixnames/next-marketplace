import { sendEmail, SendEmailInterface } from './mailer';

interface SignUpEmailTemplateInterface {
  userName: string;
}

export const signUpEmailTemplate = ({ userName }: SignUpEmailTemplateInterface): string => {
  return `
  <div>
    <h2>Здравствуйте ${userName}!</h2>
    <h3>Вы удачно зарегистрировались.</h3>
  </div>
  `;
};

interface SignUpEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'>,
    SignUpEmailTemplateInterface {}

export const signUpEmail = async ({ to, userName }: SignUpEmailInterface) => {
  await sendEmail({
    to,
    text: `Здравствуйте ${userName}! Вы удачно зарегистрировались.`,
    subject: 'Регистрация',
    content: signUpEmailTemplate({ userName }),
  });
};
