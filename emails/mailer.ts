import nodemailer from 'nodemailer';
import { getEmailTemplate } from './emailTemplate';

export interface SendEmailInterface {
  subject: string;
  content: string;
  text: string;
  to: string | string[];
}

export const sendEmail = async ({ content, subject, text, to }: SendEmailInterface) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      /*host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },*/
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      /*host: 'localhost',
      port: 1025,
      auth: {
        user: 'project.1',
        pass: 'secret.1',
      },*/
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: '"Hello" <order@winepoint.ru>', // sender address '"Fred Foo 👻" <foo@example.com>'
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      // html body
      html: getEmailTemplate({
        content,
      }),
    });

    // console.log(`Message sent: ${info.messageId}`);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Email message not sent\n', e);
    }
  }
};
