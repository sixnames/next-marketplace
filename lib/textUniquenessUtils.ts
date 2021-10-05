import {
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  LOCALES,
  REQUEST_METHOD_POST,
} from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { ProductModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { get } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';

interface CheckTextUniquenessInterface {
  textI18n?: TranslationModel | null;
  oldTextI18n?: TranslationModel | null;
  callback: (locale: string) => string;
}

export async function checkTextUniqueness({
  textI18n,
  oldTextI18n,
  callback,
}: CheckTextUniquenessInterface) {
  try {
    const { db } = await getDatabase();
    const configSlug = 'uniqueTextApiKey';
    const configsCollection = db.collection(COL_CONFIGS);
    const initialConfigs = await configsCollection
      .find({
        slug: configSlug,
        companySlug: DEFAULT_COMPANY_SLUG,
      })
      .toArray();
    const configs = castConfigs({
      configs: initialConfigs,
      city: DEFAULT_CITY,
      locale: DEFAULT_LOCALE,
    });
    const uniqueTextApiKey = getConfigStringValue({
      configs,
      slug: configSlug,
    });
    const uniqueTextApiUrl = process.env.UNIQUE_TEXT_API_URL;
    const domain = process.env.DEFAULT_DOMAIN;

    if (uniqueTextApiUrl && uniqueTextApiKey && domain) {
      for await (const locale of LOCALES) {
        const text = get(textI18n, locale);
        const oldText = get(oldTextI18n, locale);

        if (text && text !== oldText) {
          const body = {
            userkey: uniqueTextApiKey,
            exceptdomain: domain,
            callback: `https://${domain}${callback(locale)}`,
            text,
          };

          await fetch(uniqueTextApiUrl, {
            method: REQUEST_METHOD_POST,
            body: qs.stringify(body),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

interface CheckProductDescriptionUniquenessInterface {
  cardDescriptionI18n?: TranslationModel | null;
  product: ProductModel;
}

export async function checkProductDescriptionUniqueness({
  product,
  cardDescriptionI18n,
}: CheckProductDescriptionUniquenessInterface) {
  try {
    await checkTextUniqueness({
      textI18n: cardDescriptionI18n,
      oldTextI18n: product.cardDescriptionI18n,
      callback: (locale) => {
        return `/api/product/uniqueness/${product._id.toHexString()}/${locale}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}
