import Inner from 'components/Inner';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS } from 'config/common';
import {
  COL_COMPANIES,
  COL_PRODUCTS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import CmsLayout from 'layout/cms/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import ContentItemControls from 'components/ContentItemControls';

interface RubricsRouteInterface {
  rubrics: RubricInterface[];
  currentCompany?: CompanyInterface | null;
}

const RubricsRoute: React.FC<RubricsRouteInterface> = ({ rubrics, currentCompany }) => {
  const router = useRouter();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Рубрикатор',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: `${ROUTE_CMS}/companies/${currentCompany?._id}`,
      },
    ],
  };

  const columns: TableColumn<RubricInterface>[] = [
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
      accessor: 'activeProductsCount',
      headTitle: 'Активных товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-activeProductsCount`}>{cellData}</div>;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router
                .push(`${ROUTE_CMS}/companies/${currentCompany?._id}/rubrics/${dataItem._id}`)
                .catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  return (
    <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-rubrics-list'}>
        <div className='overflow-x-auto'>
          <Table<RubricInterface>
            columns={columns}
            data={rubrics}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
            onRowDoubleClick={(dataItem) => {
              router
                .push(`${ROUTE_CMS}/companies/${currentCompany?._id}/rubrics/${dataItem._id}`)
                .catch((e) => console.log(e));
            }}
          />
        </div>
      </Inner>
    </CmsCompanyLayout>
  );
};

interface RubricsInterface extends PagePropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ pageUrls, currentCompany, rubrics }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricsRoute rubrics={rubrics} currentCompany={currentCompany} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricsInterface>> => {
  const { db } = await getDatabase();
  const { query } = context;
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
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

  // get rubrics
  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $project: {
          attributes: false,
          catalogueTitle: false,
          descriptionI18n: false,
          shortDescriptionI18n: false,
          priorities: false,
          views: false,
        },
      },
      {
        $lookup: {
          from: COL_RUBRIC_VARIANTS,
          as: 'variants',
          localField: 'variantId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          variant: { $arrayElemAt: ['$variants', 0] },
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
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
                companyId,
              },
            },
            {
              $group: {
                _id: '$productId',
              },
            },
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalShopProductsObject: { $arrayElemAt: ['$shopProducts', 0] },
        },
      },
      {
        $addFields: {
          activeProductsCount: '$totalShopProductsObject.totalDocs',
        },
      },
      {
        $project: {
          variants: false,
          shopProducts: false,
          totalShopProductsObject: false,
        },
      },
      {
        $lookup: {
          from: COL_PRODUCTS,
          as: 'products',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
            {
              $project: {
                _id: true,
              },
            },
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalProductsObject: { $arrayElemAt: ['$products', 0] },
        },
      },
      {
        $addFields: {
          productsCount: '$totalProductsObject.totalDocs',
        },
      },
      {
        $project: {
          products: false,
          totalProductsObject: false,
        },
      },
    ])
    .toArray();

  const { sessionLocale } = props;
  const rawRubrics = initialRubrics.map(({ nameI18n, ...rubric }) => {
    return {
      ...rubric,
      name: getFieldStringLocale(nameI18n, sessionLocale),
      variant: rubric.variant
        ? {
            ...rubric.variant,
            name: getFieldStringLocale(rubric.variant.nameI18n, sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      rubrics: castDbData(rawRubrics),
      currentCompany: castDbData(companyResult),
    },
  };
};

export default Rubrics;
