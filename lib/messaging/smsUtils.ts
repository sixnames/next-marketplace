import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES, COL_CONFIGS, COL_USERS } from 'db/collectionNames';
import { CompanyModel, ConfigModel, UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import fetch from 'node-fetch';
import qs from 'qs';

interface SmsSenderInterface {
  text: string;
  numbers: string[];
  companySlug: string;
  city: string;
  locale: string;
}

export async function smsSender({ text, numbers, companySlug, city, locale }: SmsSenderInterface) {
  try {
    // get sms api configs for current company
    const { db } = await getDatabase();
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const smsApiConfigs = await configsCollection
      .find({
        slug: {
          $in: ['smsApiKey', 'smsApiEmail'],
        },
        companySlug,
      })
      .toArray();
    const configs = castConfigs({
      configs: smsApiConfigs,
      locale,
      city,
    });
    const apiKey = getConfigStringValue({
      configs,
      slug: 'emailApiHost',
    });
    const apiEmail = getConfigStringValue({
      configs,
      slug: 'emailApiLogin',
    });
    const sign = getConfigStringValue({
      configs,
      slug: 'smsApiSign',
    });
    if (!apiKey || !apiEmail || numbers.length < 1) {
      return;
    }

    // params
    const params = {
      text,
      sign,
      shortLink: 1,
    };
    const paramsAsString = qs.stringify(params);

    // numbers
    const numbersAsString = numbers
      .reduce((acc: string[], number) => {
        return [...acc, `numbers[]=${number}`];
      }, [])
      .join('&');

    // final url params
    const finalParamsArray = [paramsAsString, numbersAsString];
    const finalParamsAsString = finalParamsArray.join('&');

    const url = `https://${apiEmail}:${apiKey}@gate.smsaero.ru/v2/sms/send?${finalParamsAsString}`;
    await fetch(url);
  } catch (e) {
    console.log(`smsSender Error`);
    console.log(e);
  }
}

interface SendSmsInterface extends Omit<SmsSenderInterface, 'text' | 'numbers'> {
  orderItemId: string;
  customer: UserModel;
}

export async function sendNewOrderSms({
  locale,
  orderItemId,
  customer,
  city,
  companySlug,
}: SendSmsInterface) {
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserModel>(COL_USERS);
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const company = await companiesCollection.findOne({
    slug: companySlug,
  });

  const text = `
        Здравствуйте ${customer.name}!
        Спасибо за заказ!
        Номер вашего заказа ${orderItemId}
        Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали.
    `;

  // customer
  if (customer && customer.notifications?.newOrder?.sms) {
    await smsSender({
      text,
      numbers: [customer.phone],
      locale,
      city,
      companySlug,
    });
  }

  // company admins
  if (company) {
    const adminIds = [...company.staffIds, company.ownerId];
    const users = await usersCollection
      .find({
        _id: {
          $in: adminIds,
        },
        'notifications.companyNewOrder.sms': true,
      })
      .toArray();
    const numbers = users.map(({ phone }) => phone);
    await smsSender({
      text,
      numbers,
      locale,
      city,
      companySlug,
    });
  }

  // site admins
  const users = await usersCollection
    .find({
      'notifications.adminNewOrder.sms': true,
    })
    .toArray();
  const numbers = users.map(({ phone }) => phone);
  await smsSender({
    text,
    numbers,
    locale,
    city,
    companySlug: DEFAULT_COMPANY_SLUG,
  });
}
