import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_APP } from 'config/common';
import { COL_RUBRICS, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { RubricModel, ShopModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import AppLayout from 'layout/AppLayout/AppLayout';
import AppShopLayout from 'layout/AppLayout/AppShopLayout';
import { getI18nLocaleValue } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ShopProductsRouteInterface {
  shop: ShopModel;
  rubrics: RubricModel[];
}

const ShopProductsRoute: React.FC<ShopProductsRouteInterface> = ({ shop, rubrics }) => {
  const router = useRouter();

  const columns: TableColumn<RubricModel>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: 'Всего товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-productsCount`}>{cellData}</div>;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Просмотреть товары рубрики'}
            updateHandler={() => {
              router
                .push(
                  `${ROUTE_APP}/${router.query.companyId}/shops/${shop._id}/products/${dataItem._id}`,
                )
                .catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  return (
    <AppShopLayout shop={shop}>
      <Inner>
        <Table<RubricModel>
          columns={columns}
          data={rubrics}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
          onRowDoubleClick={(dataItem) => {
            router
              .push(
                `${ROUTE_APP}/${router.query.companyId}/shops/${shop._id}/products/${dataItem._id}`,
              )
              .catch((e) => console.log(e));
          }}
        />
      </Inner>
    </AppShopLayout>
  );
};

interface CompanyShopProductsInterface extends PagePropsInterface, ShopProductsRouteInterface {}

const CompanyShopProducts: NextPage<CompanyShopProductsInterface> = ({
  pageUrls,
  rubrics,
  shop,
}) => {
  return (
    <AppLayout pageUrls={pageUrls}>
      <ShopProductsRoute shop={shop} rubrics={rubrics} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsInterface>> => {
  const db = await getDatabase();
  const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const { query } = context;
  const { shopId } = query;
  const initialProps = await getAppInitialData({ context });

  const shop = await shopsCollection.findOne({ _id: new ObjectId(`${shopId}`) });

  if (!initialProps.props || !shop) {
    return {
      notFound: true,
    };
  }

  const shopRubricsAggregation = await rubricsCollection
    .aggregate<RubricModel>([
      {
        $project: {
          _id: true,
          nameI18n: true,
          slug: true,
        },
      },
      {
        $lookup: {
          from: COL_SHOP_PRODUCTS,
          as: 'shopProducts',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                shopId: shop._id,
                $expr: {
                  $eq: ['$rubricId', '$$rubricId'],
                },
              },
            },
            {
              $project: {
                _id: true,
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $addFields: {
          rubric: { $arrayElemAt: ['$rubrics', 0] },
        },
      },
      {
        $addFields: {
          productsCountObject: { $arrayElemAt: ['$shopProducts', 0] },
        },
      },
      {
        $addFields: {
          productsCount: '$productsCountObject.count',
        },
      },
      {
        $project: {
          _id: true,
          nameI18n: true,
          slug: true,
          productsCount: true,
        },
      },
    ])
    .toArray();

  const castedShopRubrics = shopRubricsAggregation.map((rubric) => {
    return {
      ...rubric,
      name: getI18nLocaleValue<string>(rubric.nameI18n, `${initialProps.props?.sessionLocale}`),
      productsCount: noNaN(rubric.productsCount),
    };
  });

  return {
    props: {
      ...initialProps.props,
      shop: castDbData(shop),
      rubrics: castDbData(castedShopRubrics),
    },
  };
};

export default CompanyShopProducts;