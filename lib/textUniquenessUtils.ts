import { LOCALES, REQUEST_METHOD_POST } from 'config/common';
import { ObjectIdModel, TranslationModel } from 'db/dbModels';
import { get } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';

interface CheckProductDescriptionUniquenessInterface {
  cardDescriptionI18n?: TranslationModel | null;
  productId: ObjectIdModel;
}

export async function checkProductDescriptionUniqueness({
  productId,
  cardDescriptionI18n,
}: CheckProductDescriptionUniquenessInterface) {
  const uniqueTextApiUrl = process.env.UNIQUE_TEXT_API_URL;
  const uniqueTextApiKey = process.env.UNIQUE_TEXT_API_KEY;
  if (uniqueTextApiUrl && uniqueTextApiKey) {
    for await (const locale of LOCALES) {
      const text = get(cardDescriptionI18n, locale);
      if (text) {
        const body = {
          userkey: uniqueTextApiKey,
          callback: `https://${
            process.env.DEFAULT_DOMAIN
          }/api/product/uniqueness/${productId.toHexString()}`,
          text,
        };

        console.log('');
        console.log('body');
        console.log(JSON.stringify(body, null, 2));
        console.log('');

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
