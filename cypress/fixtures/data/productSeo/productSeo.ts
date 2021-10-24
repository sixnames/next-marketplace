import { DEFAULT_COMPANY_SLUG } from '../../../../config/common';
import { ProductSeoModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const productSeo: ProductSeoModel[] = [
  {
    _id: getObjectId('product seo A'),
    productId: getObjectId('viski 000081'),
    companySlug: DEFAULT_COMPANY_SLUG,
    locales: [
      {
        locale: 'ru',
        uid: '6154cb45d400c',
        textUnique: '78.00',
        jsonResult: {
          date_check: '29.09.2021 23:24:17',
          unique: 78,
          urls: [],
        },
        spellCheck: [],
        seoCheck: {
          count_chars_with_space: 982,
          count_chars_without_space: 852,
          count_words: 130,
          water_percent: 17,
          list_keys: [
            {
              count: 2,
              key_title: 'word',
            },
          ],
          list_keys_group: [
            {
              count: 2,
              key_title: 'word',
              sub_keys: [],
            },
          ],
          spam_percent: 27,
          mixed_words: [],
        },
      },
    ],
  },
];

// @ts-ignore
export = productSeo;
