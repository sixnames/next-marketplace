import PageDetails, { PageDetailsInterface } from 'components/PageDetails';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { COL_CITIES, COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CityInterface, PageInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface PageDetailsPageInterface extends PagePropsInterface, PageDetailsInterface {}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({ pageUrls, page, cities }) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Страницы`,
    config: [
      {
        name: 'Группы страниц',
        href: `${ROUTE_CMS}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CMS}/pages/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <CmsLayout title={`${page.name}`} pageUrls={pageUrls}>
      <PageDetails page={page} cities={cities} breadcrumbs={breadcrumbs} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pageId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesCollection = db.collection<PageInterface>(COL_PAGES);
  const citiesCollection = db.collection<CityInterface>(COL_CITIES);

  const initialPageAggregation = await pagesCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(`${pageId}`) },
      },
      {
        $lookup: {
          from: COL_PAGES_GROUP,
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
    return {
      notFound: true,
    };
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
    name: getFieldStringLocale(initialPage.nameI18n, props.sessionLocale),
    pagesGroup: initialPage.pagesGroup
      ? {
          ...initialPage.pagesGroup,
          name: getFieldStringLocale(initialPage.pagesGroup.nameI18n, props.sessionLocale),
        }
      : null,
  };

  const cities: CityInterface[] = initialCities.map((city) => {
    return {
      ...city,
      name: getFieldStringLocale(city.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      page: castDbData(page),
      cities: castDbData(cities),
    },
  };
};

export default PageDetailsPage;
