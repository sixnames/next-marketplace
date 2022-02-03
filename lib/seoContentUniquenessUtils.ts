import { getTextContents, Value } from '@react-page/editor';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import qs from 'qs';
import { reactPageCellPlugins } from '../components/PageEditor';
import {
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  REQUEST_METHOD_POST,
} from '../config/common';
import { COL_COMPANIES, COL_CONFIGS, COL_LANGUAGES, COL_SEO_CONTENTS } from '../db/collectionNames';
import { getCitiesList } from '../db/dao/cities/getCitiesList';
import {
  CompanyModel,
  ConfigModel,
  LanguageModel,
  ObjectIdModel,
  SeoContentModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { SeoContentCitiesInterface } from '../db/uiInterfaces';
import { castConfigs, getConfigStringValue } from './configsUtils';

interface CheckSeoContentUniquenessInterface {
  text?: string | null;
  oldText?: string | null;
  companySlug: string;
  seoContentId: ObjectIdModel;
}

export async function checkSeoContentUniqueness({
  text,
  oldText,
  companySlug,
  seoContentId,
}: CheckSeoContentUniquenessInterface) {
  try {
    const { db } = await getDatabase();

    // get uniqueness api key and url
    const configSlug = 'textUniquenessApiKey';
    const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
    const initialConfigs = await configsCollection
      .find({
        slug: configSlug,
        companySlug,
      })
      .toArray();
    const configs = castConfigs({
      configs: initialConfigs,
      citySlug: DEFAULT_CITY,
      locale: DEFAULT_LOCALE,
    });
    const uniqueTextApiKey = getConfigStringValue({
      configs,
      slug: configSlug,
    });
    const uniqueTextApiUrl = process.env.UNIQUE_TEXT_API_URL;

    // get domain
    let domain = process.env.DEFAULT_DOMAIN;
    if (companySlug !== DEFAULT_COMPANY_SLUG) {
      const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
      const company = await companiesCollection.findOne({
        slug: companySlug,
      });
      domain = company?.domain || process.env.DEFAULT_DOMAIN;
    }

    const languages = await languagesCollection.find({}).toArray();
    const locales = languages.map(({ slug }) => slug);

    if (uniqueTextApiUrl && uniqueTextApiKey && text) {
      for await (const locale of locales) {
        const isDefaultLocale = locale === DEFAULT_LOCALE;
        const rawText = JSON.parse(text);
        const textContents = getTextContents(rawText as Value, {
          lang: locale,
          cellPlugins: reactPageCellPlugins(),
        }).join(' ');

        if (!isDefaultLocale) {
          const defaultLocaleTextContents = getTextContents(rawText as Value, {
            lang: DEFAULT_LOCALE,
            cellPlugins: reactPageCellPlugins(),
          }).join(' ');
          if (defaultLocaleTextContents === textContents) {
            continue;
          }
        }

        const rawOldText = oldText ? JSON.parse(oldText) : null;
        const oldTextContents = rawOldText
          ? getTextContents(rawOldText as Value, {
              lang: locale,
              cellPlugins: reactPageCellPlugins(),
            }).join(' ')
          : null;

        if (textContents !== oldTextContents) {
          const body = {
            userkey: uniqueTextApiKey,
            exceptdomain: domain,
            callback: `https://${domain}/api/seo-content/uniqueness/${seoContentId}/${locale}`,
            text: textContents,
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

interface UpdateCitiesSeoContentInterface {
  seoContentsList: SeoContentCitiesInterface;
  companySlug: string;
}

export async function updateCitiesSeoContent({
  seoContentsList,
  companySlug,
}: UpdateCitiesSeoContentInterface) {
  const { db } = await getDatabase();
  const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

  const cities = await getCitiesList();
  for await (const city of cities) {
    const seoContent = seoContentsList[city.slug];

    if (seoContent) {
      const oldSeoContent = await seoContentsCollection.findOne({
        _id: new ObjectId(seoContent._id),
      });

      // check uniqueness
      await checkSeoContentUniqueness({
        companySlug,
        seoContentId: new ObjectId(seoContent._id),
        text: seoContent.content,
        oldText: oldSeoContent?.content,
      });

      // create if not exist
      if (!oldSeoContent) {
        await seoContentsCollection.insertOne(seoContent);
        continue;
      }

      // update existing
      const { _id, ...values } = seoContent;
      await seoContentsCollection.findOneAndUpdate(
        {
          _id: new ObjectId(_id),
        },
        {
          $set: values,
        },
      );
    }
  }
}
