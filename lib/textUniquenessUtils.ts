import { LOCALES, REQUEST_METHOD_POST } from 'config/common';
import { ProductModel, TranslationModel } from 'db/dbModels';
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
  const uniqueTextApiUrl = process.env.UNIQUE_TEXT_API_URL;
  const uniqueTextApiKey = process.env.UNIQUE_TEXT_API_KEY;
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
