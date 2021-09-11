import { DEFAULT_LOCALE, LOCALE_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LOCALE } from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { getFieldStringLocale } from 'lib/i18n';
import fetch from 'node-fetch';
import qs from 'qs';

interface SmsSenderInterface {
  text: string;
  sign: string;
  numbers: string[];
  companySlug: string;
  city: string;
  locale: string;
}

export async function smsSender({
  text,
  sign,
  numbers,
  companySlug,
  city,
  locale,
}: SmsSenderInterface) {
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

interface SendSmsInterface extends Omit<SmsSenderInterface, 'text'> {
  orderId: string;
}

export async function sendNewOrderSms({
  locale,
  sign,
  orderId,
  numbers,
  city,
  companySlug,
}: SendSmsInterface) {
  const messageI18n = {
    [DEFAULT_LOCALE]: `№${orderId}`,
    [SECONDARY_LOCALE]: `№${orderId}`,
  };
  const text = getFieldStringLocale(messageI18n, locale);
  if (text === LOCALE_NOT_FOUND_FIELD_MESSAGE || !text) {
    return;
  }

  await smsSender({
    text,
    sign,
    numbers,
    locale,
    city,
    companySlug,
  });
}
