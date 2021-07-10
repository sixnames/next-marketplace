import { SORT_ASC } from 'config/common';
import {
  COL_CITIES,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_PAGES_GROUP_TEMPLATES,
} from 'db/collectionNames';
import { PagesGroupModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { PagesGroupInterface, PagesGroupTemplateInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

// Page groups list
interface GetPageGroupsSsrInterface {
  locale: string;
  companySlug: string;
  isTemplate?: string;
}

export async function getPageGroupsSsr({
  locale,
  companySlug,
  isTemplate,
}: GetPageGroupsSsrInterface): Promise<PagesGroupInterface[] | PagesGroupTemplateInterface[]> {
  const { db } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupModel>(
    isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
  );

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate([
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
  isTemplate?: string;
  pagesGroupId: string;
}

export async function getPagesListSsr({
  locale,
  isTemplate,
  pagesGroupId,
}: GetPagesListSsrInterface): Promise<PagesGroupInterface | PagesGroupTemplateInterface | null> {
  const { db } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupInterface>(
    isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
  );

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(pagesGroupId),
        },
      },
      {
        $lookup: {
          from: COL_PAGES,
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
