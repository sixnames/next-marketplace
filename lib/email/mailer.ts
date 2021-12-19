import nodemailer from 'nodemailer';
import { COL_CONFIGS } from '../../db/collectionNames';
import { ConfigModel } from '../../db/dbModels';
import { getDatabase } from '../../db/mongodb';
import { castConfigs, getConfigStringValue } from '../configsUtils';
import { getEmailTemplate } from './emailTemplate';

export interface SendEmailInterface {
  subject: string;
  content: string;
  text: string;
  to: string | string[];
  companySiteSlug: string;
  citySlug: string;
  locale: string;
}

export const sendEmail = async ({
  content,
  subject,
  text,
  to,
  companySiteSlug,
  citySlug,
  locale,
}: SendEmailInterface) => {
  try {
    // get email api configs for current company
    const isDev = process.env.DEV_ENV;
    const { db } = await getDatabase();
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const emailApiConfigs = await configsCollection
      .find({
        slug: {
          $in: ['emailApiHost', 'emailApiLogin', 'emailApiPassword', 'siteName'],
        },
        companySlug: companySiteSlug,
      })
      .toArray();
    const configs = castConfigs({
      configs: emailApiConfigs,
      locale,
      citySlug,
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
    const siteName = getConfigStringValue({
      configs,
      slug: 'siteName',
    });
    if ((!emailApiHost || !emailApiLogin || !emailApiPassword) && !isDev) {
      return;
    }

    // create reusable transporter object using the default SMTP transport
    const config = isDev
      ? {
          host: 'localhost',
          port: 1025,
          auth: {
            user: 'project.1',
            pass: 'secret.1',
          },
        }
      : {
          host: emailApiHost,
          port: 465,
          secure: true,
          auth: {
            user: emailApiLogin,
            pass: emailApiPassword,
          },
        };
    const transporter = nodemailer.createTransport(config);

    // send mail with defined transport object
    await transporter.sendMail({
      from: `${siteName ? `"${siteName}" ` : ''}<${emailApiLogin}>`, // sender address '"Fred Foo 👻" <foo@example.com>'
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
