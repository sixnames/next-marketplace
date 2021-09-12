import { COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import fetch from 'node-fetch';
import qs from 'qs';

export interface SmsSenderInterface {
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
