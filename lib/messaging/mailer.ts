import { COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from 'lib/messaging/emailTemplate';

export interface SendEmailInterface {
  subject: string;
  content: string;
  text: string;
  to: string | string[];
  companySlug: string;
  city: string;
  locale: string;
}

export const sendEmail = async ({
  content,
  subject,
  text,
  to,
  companySlug,
  city,
  locale,
}: SendEmailInterface) => {
  try {
    const { db } = await getDatabase();
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const emailApiConfigs = await configsCollection
      .find({
        slug: {
          $in: ['emailApiHost', 'emailApiLogin', 'emailApiPassword'],
        },
        companySlug,
      })
      .toArray();
    const configs = castConfigs({
      configs: emailApiConfigs,
      locale,
      city,
    });
    const emailApiHost = getConfigStringValue({
      configs,
      slug: 'emailApiHost',
    });
    const emailApiLogin = getConfigStringValue({
      configs,
      slug: 'emailApiLogin',
    });
    const emailApiPassword = getConfigStringValue({
      configs,
      slug: 'emailApiPassword',
    });
    if (!emailApiHost || !emailApiLogin || !emailApiPassword) {
      return;
    }

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // const testAccount = await nodemailer.createTestAccount();

    const config = {
      host: emailApiHost,
      port: 465,
      secure: true,
      auth: {
        user: emailApiLogin,
        pass: emailApiPassword,
      },
    };

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(config);

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
