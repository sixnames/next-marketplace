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
    // get email api configs for current company
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

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: emailApiHost,
      port: 465,
      secure: true,
      auth: {
        user: emailApiLogin,
        pass: emailApiPassword,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: `<${emailApiLogin}>`, // sender address '"Fred Foo 👻" <foo@example.com>'
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      // html body
      html: getEmailTemplate({
        content,
      }),
    });
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Email message not sent\n', e);
    }
  }
};
