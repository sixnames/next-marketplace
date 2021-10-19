import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  LOCALES,
  REQUEST_METHOD_POST,
} from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import {
  CategoryModel,
  ConfigModel,
  ProductModel,
  RubricModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castConfigs, getConfigStringValue } from 'lib/configsUtils';
import { get } from 'lodash';
import fetch from 'node-fetch';
import qs from 'qs';

interface CheckTextUniquenessInterface {
  textI18n?: TranslationModel | null;
  oldTextI18n?: TranslationModel | null;
  callback: (locale: string) => string;
  companySlug: string;
}

export async function checkTextUniqueness({
  textI18n,
  oldTextI18n,
  callback,
  companySlug,
}: CheckTextUniquenessInterface) {
  try {
    const { db } = await getDatabase();
    const configSlug = 'textUniquenessApiKey';
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const initialConfigs = await configsCollection
      .find({
        slug: configSlug,
        companySlug,
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

// Product
interface CheckProductDescriptionUniquenessInterface {
  cardDescriptionI18n?: TranslationModel | null;
  oldCardDescriptionI18n?: TranslationModel | null;
  product: ProductModel;
  companySlug: string;
}

export async function checkProductDescriptionUniqueness({
  product,
  cardDescriptionI18n,
  oldCardDescriptionI18n,
  companySlug,
}: CheckProductDescriptionUniquenessInterface) {
  try {
    await checkTextUniqueness({
      companySlug,
      textI18n: cardDescriptionI18n,
      oldTextI18n: oldCardDescriptionI18n,
      callback: (locale) => {
        return `/api/product/uniqueness/${product._id.toHexString()}/${locale}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}

// Rubric
interface CheckRubricSeoTextUniquenessInterface {
  textTopI18n?: TranslationModel | null;
  textBottomI18n?: TranslationModel | null;
  oldTextTopI18n?: TranslationModel | null;
  oldTextBottomI18n?: TranslationModel | null;
  rubric: RubricModel;
  companySlug: string;
}

export async function checkRubricSeoTextUniqueness({
  rubric,
  textTopI18n,
  textBottomI18n,
  oldTextTopI18n,
  oldTextBottomI18n,
  companySlug,
}: CheckRubricSeoTextUniquenessInterface) {
  try {
    await checkTextUniqueness({
      companySlug,
      textI18n: textTopI18n,
      oldTextI18n: oldTextTopI18n,
      callback: (locale) => {
        return `/api/rubric/uniqueness/${rubric._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_TOP}`;
      },
    });
    await checkTextUniqueness({
      companySlug,
      textI18n: textBottomI18n,
      oldTextI18n: oldTextBottomI18n,
      callback: (locale) => {
        return `/api/rubric/uniqueness/${rubric._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}

// Category
interface CheckCategorySeoTextUniquenessInterface {
  textTopI18n?: TranslationModel | null;
  textBottomI18n?: TranslationModel | null;
  oldTextTopI18n?: TranslationModel | null;
  oldTextBottomI18n?: TranslationModel | null;
  category: CategoryModel;
  companySlug: string;
}

export async function checkCategorySeoTextUniqueness({
  category,
  textTopI18n,
  textBottomI18n,
  oldTextTopI18n,
  oldTextBottomI18n,
  companySlug,
}: CheckCategorySeoTextUniquenessInterface) {
  try {
    await checkTextUniqueness({
      companySlug,
      textI18n: textTopI18n,
      oldTextI18n: oldTextTopI18n,
      callback: (locale) => {
        return `/api/category/uniqueness/${category._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_TOP}`;
      },
    });
    await checkTextUniqueness({
      companySlug,
      textI18n: textBottomI18n,
      oldTextI18n: oldTextBottomI18n,
      callback: (locale) => {
        return `/api/category/uniqueness/${category._id.toHexString()}/${locale}/${CATALOGUE_SEO_TEXT_POSITION_BOTTOM}`;
      },
    });
  } catch (e) {
    console.log(e);
  }
}
