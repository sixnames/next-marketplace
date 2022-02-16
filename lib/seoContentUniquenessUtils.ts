import { getTextContents, Value } from '@react-page/editor';
import { reactPageCellPlugins } from 'components/PageEditor';
import { castConfigs } from 'db/cast/castConfigs';
import { getCitiesList } from 'db/dao/cities/getCitiesList';
import { ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { SeoContentCitiesInterface } from 'db/uiInterfaces';
import {
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  REQUEST_METHOD_POST,
} from 'lib/config/common';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import qs from 'qs';
import { getConfigStringValue } from './configsUtils';

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
    const collections = await getDbCollections();

    // get uniqueness api key and url
    const configSlug = 'textUniquenessApiKey';
    const languagesCollection = collections.languagesCollection();
    const configsCollection = collections.configsCollection();
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
      const companiesCollection = collections.companiesCollection();
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
  try {
    const collections = await getDbCollections();
    const seoContentsCollection = collections.seoContentsCollection();

    const cities = await getCitiesList();
    for await (const city of cities) {
      const seoContent = seoContentsList[city.slug];

      if (seoContent) {
        const oldSeoContent = await seoContentsCollection.findOne({
          $or: [
            {
              _id: new ObjectId(seoContent._id),
            },
            {
              slug: seoContent.slug,
            },
          ],
        });

        // check uniqueness
        await checkSeoContentUniqueness({
          companySlug,
          seoContentId: new ObjectId(seoContent._id),
          text: seoContent.content,
          oldText: oldSeoContent?.content,
        });

        // update existing
        const { _id, ...values } = seoContent;
        await seoContentsCollection.findOneAndUpdate(
          {
            _id: new ObjectId(_id),
          },
          {
            $set: values,
          },
          {
            upsert: true,
          },
        );
      }
    }
  } catch (e) {
    console.log('updateCitiesSeoContent error', e);
  }
}
