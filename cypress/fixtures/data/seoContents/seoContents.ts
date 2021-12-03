import { getObjectId } from 'mongo-seeding';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
} from '../../../../config/common';
import {
  SeoContentModel,
  TextUniquenessApiParsedResponseModel,
  TranslationModel,
} from '../../../../db/dbModels';
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

const seoContents: SeoContentModel[] = [
  // rubric
  {
    _id: getObjectId('seo 1'),
    slug: `0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee${CATALOGUE_SEO_TEXT_POSITION_TOP}`,
    url: '/0/msk/catalogue/viski',
    seoLocales,
    titleI18n: {
      [DEFAULT_LOCALE]: 'Кастомный заголовок Виски',
    },
    metaTitleI18n: {
      [DEFAULT_LOCALE]: 'Кастомный мета заголовок Виски',
    },
    metaDescriptionI18n: {
      [DEFAULT_LOCALE]: 'Кастомное мета описание Виски',
    },
    companySlug: DEFAULT_COMPANY_SLUG,
    rubricSlug: 'viski',
    content: getConstructorContentFromText(
      'Rubric top Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },
  {
    _id: getObjectId('seo 2'),
    slug: `0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`,
    url: '/0/msk/catalogue/viski',
    seoLocales,
    companySlug: DEFAULT_COMPANY_SLUG,
    rubricSlug: 'viski',
    content: getConstructorContentFromText(
      'Rubric bottom Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },

  // category
  {
    _id: getObjectId('seo 3'),
    slug: `0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee44ea02e9ae9b07f3212cbaef${CATALOGUE_SEO_TEXT_POSITION_TOP}`,
    url: '/0/msk/catalogue/viski/category-cat_1',
    seoLocales,
    companySlug: DEFAULT_COMPANY_SLUG,
    rubricSlug: 'viski',
    content: getConstructorContentFromText(
      'Category top Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },
  {
    _id: getObjectId('seo 4'),
    slug: `0d23dbe34c76d2f658a4c05fdd90394a05243ac71290513ee44ea02e9ae9b07f3212cbaef${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`,
    url: '/0/msk/catalogue/viski/category-cat_1',
    seoLocales,
    companySlug: DEFAULT_COMPANY_SLUG,
    rubricSlug: 'viski',
    content: getConstructorContentFromText(
      'Category bottom Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
  },

  // products
  {
    _id: getObjectId('seo 5'),
    url: '/0/msk/000081',
    slug: '0d23dbe34c76d2f658a4c05fdb977fadafdb3044026f6bf72',
    content: getConstructorContentFromText(
      'Card content Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
    ),
    companySlug: DEFAULT_COMPANY_SLUG,
    rubricSlug: 'viski',
    seoLocales,
  },
];

// @ts-ignore
export = seoContents;
