import { DEFAULT_CITY, DEFAULT_LOCALE, LOCALES, REQUEST_METHOD_POST } from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { ProductModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { get } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';

interface CheckProductDescriptionUniquenessInterface {
  cardDescriptionI18n?: TranslationModel | null;
  product: ProductModel;
}

export async function checkProductDescriptionUniqueness({
  product,
  cardDescriptionI18n,
}: CheckProductDescriptionUniquenessInterface) {
  const { db } = await getDatabase();
  const configsCollection = db.collection(COL_CONFIGS);
  const initialConfigs = await configsCollection
    .find({
      slug: 'uniqueTextApiKey',
    })
    .toArray();
  const configs = castConfigs({
    configs: initialConfigs,
    city: DEFAULT_CITY,
    locale: DEFAULT_LOCALE,
  });
  const uniqueTextApiKey = getConfigStringValue({
    configs,
    slug: 'buyButtonText',
  });
  const uniqueTextApiUrl = process.env.UNIQUE_TEXT_API_URL;

  console.log({
    uniqueTextApiKey,
    uniqueTextApiUrl,
  });

  if (uniqueTextApiUrl && uniqueTextApiKey) {
    for await (const locale of LOCALES) {
      const text = get(cardDescriptionI18n, locale);
      const oldText = get(product.cardDescriptionI18n, locale);

      if (text && text !== oldText) {
        const body = {
          userkey: uniqueTextApiKey,
          exceptdomain: `${process.env.DEFAULT_DOMAIN}`,
          callback: `https://${
            process.env.DEFAULT_DOMAIN
          }/api/product/uniqueness/${product._id.toHexString()}/${locale}`,
          text,
        };

        const res = await fetch(uniqueTextApiUrl, {
          method: REQUEST_METHOD_POST,
          body: qs.stringify(body),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        const json = await res.json();
        console.log(json);
      }
    }
  }
}
