import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import Title from 'components/Title';
import { PAGE_DEFAULT, ROUTE_CMS, ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import {
  COL_CITIES,
  COL_COMPANIES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USERS,
} from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppPaginationAggregationInterface,
  AppPaginationInterface,
  CompanyInterface,
  ShopInterface,
} from 'db/uiInterfaces';
import { ShopInListFragment, useGetAppCompanyShopsQuery } from 'generated/apolloComponents';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import AppLayout from 'layout/AppLayout/AppLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface CompanyShopsPageConsumerInterface extends AppPaginationInterface<ShopInterface> {
  currentCompany: CompanyInterface;
}

const CompanyShopsPageConsumer: React.FC<CompanyShopsPageConsumerInterface> = () => {
  const router = useRouter();
  const { setPage, page } = useDataLayoutMethods();
  const { data, loading, error } = useGetAppCompanyShopsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        page,
      },
      companyId: `${router.query.companyId}`,
    },
  });

  if (loading) {
    return <Spinner isNested isTransparent />;
  }

  if (error || !data || !data.getCompanyShops) {
    return <RequestError />;
  }

  const columns: TableColumn<ShopInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CONSOLE}/shops/${router.query.companyId}/${dataItem._id}`}>
          {cellData}
        </Link>
      ),
    },
    {
      accessor: 'logo',
      headTitle: 'Лого',
      render: ({ cellData, dataItem }) => {
        return <TableRowImage src={cellData.url} alt={dataItem.name} title={dataItem.name} />;
      },
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'city.name',
      headTitle: 'Город',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router
                .push(`${ROUTE_CONSOLE}/shops/${router.query.companyId}/${dataItem._id}`)
                .catch(console.log);
            }}
            testId={dataItem.name}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'shops-list'}>
      <div className={'pt-11'}>
        <Title>Магазины компании</Title>

        <Table<ShopInListFragment>
          columns={columns}
          data={data.getCompanyShops.docs}
          testIdKey={'name'}
          onRowDoubleClick={(dataItem) => {
            router
              .push(`${ROUTE_CONSOLE}/shops/${router.query.companyId}/${dataItem._id}`)
              .catch(console.log);
          }}
        />
        <Pager page={page} setPage={setPage} totalPages={data.getCompanyShops.totalPages} />
      </div>
    </Inner>
  );
};

interface CompanyShopsPageInterface extends PagePropsInterface, CompanyShopsPageConsumerInterface {}

const CompanyShopsPage: NextPage<CompanyShopsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <AppLayout title={'Магазины компании'} pageUrls={pageUrls}>
      <CompanyShopsPageConsumer {...props} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopsPageInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);

  const { filters, search } = query;
  const [companyId, ...restFilter] = alwaysArray(filters);

  // Cast filters
  const { page, skip, limit, clearSlug } = castCatalogueFilters({
    filters: restFilter,
  });
  const itemPath = `${ROUTE_CMS}/companies/${companyId}/shops/shop`;

  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${companyId}`),
        },
      },
      {
        $lookup: {
          from: COL_USERS,
          as: 'owner',
          let: { ownerId: '$ownerId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$ownerId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const searchStage = search
    ? {
        $or: [
          {
            itemId: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            'contacts.emails': {
              $regex: search,
              $options: 'i',
            },
          },
          {
            name: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            slug: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const shopsAggregationResult = await shopsCollection
    .aggregate<AppPaginationAggregationInterface<ShopInterface>>([
      {
        $match: {
          companyId: new ObjectId(`${companyId}`),
          ...searchStage,
        },
      },
      {
        $facet: {
          docs: [
            {
              $sort: {
                _id: SORT_DESC,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: COL_CITIES,
                as: 'city',
                let: { citySlug: '$citySlug' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$citySlug', '$slug'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'productsCount',
                let: { shopId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopId', '$shopId'],
                      },
                    },
                  },
                  {
                    $count: 'counter',
                  },
                ],
              },
            },
            {
              $addFields: {
                city: {
                  $arrayElemAt: ['$city', 0],
                },
                productsCount: {
                  $arrayElemAt: ['$productsCount', 0],
                },
              },
            },
            {
              $addFields: {
                productsCount: '$productsCount.counter',
              },
            },
          ],
          countAllDocs: [
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalDocsObject: {
            $arrayElemAt: ['$countAllDocs', 0],
          },
        },
      },
      {
        $addFields: {
          totalDocs: '$totalDocsObject.totalDocs',
        },
      },
      {
        $addFields: {
          totalPagesFloat: {
            $divide: ['$totalDocs', limit],
          },
        },
      },
      {
        $addFields: {
          totalPages: {
            $ceil: '$totalPagesFloat',
          },
        },
      },
      {
        $project: {
          docs: 1,
          totalDocs: 1,
          totalPages: 1,
          hasPrevPage: {
            $gt: [page, PAGE_DEFAULT],
          },
          hasNextPage: {
            $lt: [page, '$totalPages'],
          },
        },
      },
    ])
    .toArray();

  const shopsAggregation = shopsAggregationResult[0];
  if (!shopsAggregation) {
    return {
      notFound: true,
    };
  }

  const docs = shopsAggregation.docs.map(({ city, ...shop }) => {
    return {
      ...shop,
      city: city
        ? {
            ...city,
            name: getFieldStringLocale(city.nameI18n, props.sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      currentCompany: castDbData(companyResult),
      itemPath,
      clearSlug,
      page,
      hasPrevPage: shopsAggregation.hasPrevPage,
      hasNextPage: shopsAggregation.hasNextPage,
      totalPages: noNaN(shopsAggregation.totalPages),
      totalDocs: noNaN(shopsAggregation.totalDocs),
      docs: castDbData(docs),
    },
  };
};

export default CompanyShopsPage;
