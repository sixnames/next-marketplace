import PagesList, { PagesListInterface } from 'components/Pages/PagesList';
import { ROUTE_CMS, SORT_ASC } from 'config/common';
import { COL_CITIES, COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PagesGroupInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface PagesListPageInterface extends PagePropsInterface, Omit<PagesListInterface, 'basePath'> {}

const PagesListPage: NextPage<PagesListPageInterface> = ({ pageUrls, pagesGroup }) => {
  return (
    <CmsLayout title={`${pagesGroup.name}`} pageUrls={pageUrls}>
      <PagesList basePath={`${ROUTE_CMS}/pages`} pagesGroup={pagesGroup} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PagesListPageInterface>> => {
  const { query } = context;
  const { pagesGroupId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pagesGroupId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupInterface>(COL_PAGES_GROUP);

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${pagesGroupId}`),
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
      name: getFieldStringLocale(pagesGroup.nameI18n, props.sessionLocale),
      pages: (pagesGroup.pages || []).map((page) => {
        return {
          ...page,
          name: getFieldStringLocale(page.nameI18n, props.sessionLocale),
          city: page.city
            ? {
                ...page.city,
                name: getFieldStringLocale(page.city.nameI18n, props.sessionLocale),
              }
            : null,
        };
      }),
    };
  });

  const pagesGroup = pagesGroups[0];
  if (!pagesGroup) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      pagesGroup: castDbData(pagesGroup),
    },
  };
};

export default PagesListPage;
