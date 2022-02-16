import {
  COL_CITIES,
  COL_PAGE_TEMPLATES,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_PAGES_GROUP_TEMPLATES,
} from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  CityInterface,
  PageInterface,
  PagesGroupInterface,
  PagesGroupTemplateInterface,
  PagesTemplateInterface,
} from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';
import { SORT_ASC, SORT_DESC } from './config/common';
import { getFieldStringLocale } from './i18n';

// Page groups list
interface GetPageGroupsSsrInterface {
  locale: string;
  companySlug: string;
  isTemplate?: boolean;
}

export async function getPageGroupsSsr({
  locale,
  companySlug,
  isTemplate,
}: GetPageGroupsSsrInterface): Promise<PagesGroupInterface[] | PagesGroupTemplateInterface[]> {
  const collections = await getDbCollections();
  const pagesGroupsCollection = isTemplate
    ? collections.pagesGroupTemplatesCollection()
    : collections.pagesGroupsCollection();

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate<PagesGroupInterface>([
      {
        $match: {
          companySlug,
        },
      },
      {
        $sort: {
          index: SORT_ASC,
        },
      },
    ])
    .toArray();

  const pagesGroups: PagesGroupInterface[] | PagesGroupTemplateInterface[] =
    pagesGroupsAggregationResult.map((pagesGroup) => {
      return {
        ...pagesGroup,
        name: getFieldStringLocale(pagesGroup.nameI18n, locale),
      };
    });

  return pagesGroups;
}

// Pages list
interface GetPagesListSsrInterface {
  locale: string;
  isTemplate?: boolean;
  pagesGroupId: string;
}

export async function getPagesListSsr({
  locale,
  isTemplate,
  pagesGroupId,
}: GetPagesListSsrInterface): Promise<PagesGroupInterface | PagesGroupTemplateInterface | null> {
  const collections = await getDbCollections();
  const pagesGroupsCollection = isTemplate
    ? collections.pagesGroupTemplatesCollection()
    : collections.pagesGroupsCollection();

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate<PagesGroupInterface>([
      {
        $match: {
          _id: new ObjectId(pagesGroupId),
        },
      },
      {
        $lookup: {
          from: isTemplate ? COL_PAGE_TEMPLATES : COL_PAGES,
          as: 'pages',
          let: {
            pagesGroupId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$pagesGroupId', '$$pagesGroupId'],
                },
              },
            },
            {
              $sort: {
                index: SORT_ASC,
                citySlug: SORT_ASC,
              },
            },
            {
              $project: {
                content: false,
              },
            },
            {
              $lookup: {
                from: COL_CITIES,
                as: 'city',
                let: {
                  citySlug: '$citySlug',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$slug', '$$citySlug'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                city: {
                  $arrayElemAt: ['$city', 0],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const pagesGroups: PagesGroupInterface[] = pagesGroupsAggregationResult.map((pagesGroup) => {
    return {
      ...pagesGroup,
      name: getFieldStringLocale(pagesGroup.nameI18n, locale),
      pages: (pagesGroup.pages || []).map((page) => {
        return {
          ...page,
          name: getFieldStringLocale(page.nameI18n, locale),
          city: page.city
            ? {
                ...page.city,
                name: getFieldStringLocale(page.city.nameI18n, locale),
              }
            : null,
        };
      }),
    };
  });

  const pagesGroup = pagesGroups[0];

  if (!pagesGroup) {
    return null;
  }

  return pagesGroup;
}

// Pages list
interface GetPageSsrInterface {
  locale: string;
  pageId: string;
  isTemplate?: boolean;
}

interface GetPageSsrPayloadInterface {
  page: PageInterface | PagesTemplateInterface;
  cities: CityInterface[];
}

export async function getPageSsr({
  locale,
  isTemplate,
  pageId,
}: GetPageSsrInterface): Promise<GetPageSsrPayloadInterface | null> {
  const collections = await getDbCollections();
  const pagesCollection = isTemplate
    ? collections.pageTemplatesCollection()
    : collections.pagesCollection();
  const citiesCollection = collections.citiesCollection();

  const initialPageAggregation = await pagesCollection
    .aggregate<PageInterface>([
      {
        $match: { _id: new ObjectId(`${pageId}`) },
      },
      {
        $lookup: {
          from: isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
          as: 'pagesGroup',
          foreignField: '_id',
          localField: 'pagesGroupId',
        },
      },
      {
        $addFields: {
          pagesGroup: {
            $arrayElemAt: ['$pagesGroup', 0],
          },
        },
      },
    ])
    .toArray();

  const initialPage = initialPageAggregation[0];
  if (!initialPage) {
    return null;
  }

  const initialCities = await citiesCollection
    .find(
      {},
      {
        sort: {
          _id: SORT_DESC,
        },
      },
    )
    .toArray();

  const page: PageInterface = {
    ...initialPage,
    name: getFieldStringLocale(initialPage.nameI18n, locale),
    pagesGroup: initialPage.pagesGroup
      ? {
          ...initialPage.pagesGroup,
          name: getFieldStringLocale(initialPage.pagesGroup.nameI18n, locale),
        }
      : null,
  };

  const cities: CityInterface[] = initialCities.map((city) => {
    return {
      ...city,
      name: getFieldStringLocale(city.nameI18n, locale),
    };
  });

  return {
    page,
    cities,
  };
}
