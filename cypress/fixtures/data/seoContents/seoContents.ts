import { getObjectId } from 'mongo-seeding';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
} from '../../../../config/common';
import { SeoContentModel, TextUniquenessApiParsedResponseModel } from '../../../../db/dbModels';
import { getConstructorContentFromText } from '../../../../lib/stringUtils';

const seoLocales: TextUniquenessApiParsedResponseModel[] = [
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
];

const rubricDescriptions: SeoContentModel[] = [
  // rubric
  {
    _id: getObjectId('seo 1'),
    slug: '0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee',
    url: '/0/msk/catalogue/viski',
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    assetKeys: [],
    seoLocales,
    content: getConstructorContentFromText(
      'Rubric top Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },
  {
    _id: getObjectId('seo 2'),
    slug: '0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee',
    url: '/0/msk/catalogue/viski',
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    assetKeys: [],
    seoLocales,
    content: getConstructorContentFromText(
      'Rubric bottom Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },

  // category
  {
    _id: getObjectId('seo 3'),
    slug: '0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee44ea02e9ae9b07f3212cbaef',
    url: '/0/msk/catalogue/viski/category-cat_1',
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    assetKeys: [],
    seoLocales,
    content: getConstructorContentFromText(
      'Category top Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },
  {
    _id: getObjectId('seo 4'),
    slug: '0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee44ea02e9ae9b07f3212cbaef',
    url: '/0/msk/catalogue/viski/category-cat_1',
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    assetKeys: [],
    seoLocales,
    content: getConstructorContentFromText(
      'Category bottom Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },

  // products
];

// @ts-ignore
export = rubricDescriptions;
