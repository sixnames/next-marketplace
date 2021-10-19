import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_COMPANY_SLUG,
} from '../../../../config/common';
import { RubricSeoModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const productSeo: RubricSeoModel[] = [
  {
    _id: getObjectId('rubric Виски seo top'),
    rubricId: getObjectId('rubric Виски'),
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
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
  {
    _id: getObjectId('rubric Виски seo bottom'),
    rubricId: getObjectId('rubric Виски'),
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    companySlug: DEFAULT_COMPANY_SLUG,
    locales: [
      {
        locale: 'ru',
        uid: '6154cb45d400c',
        textUnique: '32.00',
        jsonResult: {
          date_check: '29.09.2021 23:24:17',
          unique: 32,
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
  {
    _id: getObjectId('category Односолодовый seo top'),
    rubricId: getObjectId('rubric Виски'),
    categoryId: getObjectId('category Односолодовый'),
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    companySlug: DEFAULT_COMPANY_SLUG,
    locales: [
      {
        locale: 'ru',
        uid: '6154cb45d400c',
        textUnique: '22.00',
        jsonResult: {
          date_check: '29.09.2021 23:24:17',
          unique: 22,
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
  {
    _id: getObjectId('category Односолодовый seo bottom'),
    rubricId: getObjectId('rubric Виски'),
    categoryId: getObjectId('category Односолодовый'),
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    companySlug: DEFAULT_COMPANY_SLUG,
    locales: [
      {
        locale: 'ru',
        uid: '6154cb45d400c',
        textUnique: '45.00',
        jsonResult: {
          date_check: '29.09.2021 23:24:17',
          unique: 45,
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
