import { sendEmail, SendEmailInterface } from './mailer';

interface PasswordUpdatedEmailTemplateInterface {
  userName: string;
}

export const passwordUpdatedEmailTemplate = ({
  userName,
}: PasswordUpdatedEmailTemplateInterface): string => {
  return `
  <div>
    <h2>Здравствуйте ${userName}!</h2>
    <h3>Ваш пароль обновлён.</h3>
  </div>
  `;
};

interface SendPasswordUpdatedEmailInterface
  extends Omit<SendEmailInterface, 'content' | 'text' | 'subject'>,
    PasswordUpdatedEmailTemplateInterface {}

export const sendPasswordUpdatedEmail = async ({
  to,
  userName,
}: SendPasswordUpdatedEmailInterface) => {
  await sendEmail({
    to,
    text: `Здравствуйте ${userName}! Ваш пароль обновлён.`,
    subject: 'Обновление пароля',
    content: passwordUpdatedEmailTemplate({ userName }),
  });
};
