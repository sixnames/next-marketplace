import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CreateShopModalInterface } from 'components/Modal/CreateShopModal/CreateShopModal';
import Pager from 'components/Pager/Pager';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import {
  QUERY_FILTER_PAGE,
  CATALOGUE_OPTION_SEPARATOR,
  ROUTE_CMS,
  SORT_DESC,
  PAGE_DEFAULT,
} from 'config/common';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from 'config/modals';
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
import { useDeleteShopFromCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import usePageLoadingState from 'hooks/usePageLoadingState';
import CmsCompanyLayout from 'layout/CmsLayout/CmsCompanyLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale, getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface CompanyShopsConsumerInterface extends AppPaginationInterface<ShopInterface> {
  currentCompany: CompanyInterface;
}

const CompanyShopsConsumer: React.FC<CompanyShopsConsumerInterface> = ({
  currentCompany,
  page,
  totalPages,
  pagerUrl,
  totalDocs,
  basePath,
  itemPath,
  docs,
}) => {
  const isPageLoading = usePageLoadingState();
  const router = useRouter();
  const {
    showModal,
    showLoading,
    onCompleteCallback,
    onErrorCallback,
    showErrorNotification,
  } = useMutationCallbacks({
    reload: true,
    withModal: true,
  });

  const counterString = React.useMemo(() => {
    if (totalDocs < 1) {
      return '';
    }

    const counterPostfix = getNumWord(totalDocs, ['магазин', 'магазина', 'магазинов']);
    const counterPrefix = getNumWord(totalDocs, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${totalDocs} ${counterPostfix}`;
  }, [totalDocs]);

  const [deleteShopFromCompanyMutation] = useDeleteShopFromCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopFromCompany),
    onError: onErrorCallback,
  });

  const columns: TableColumn<ShopInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${itemPath}/${dataItem._id}`}>{cellData}</Link>
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
      accessor: 'productsCount',
      headTitle: 'Товаров',
      render: ({ cellData }) => noNaN(cellData),
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
            testId={dataItem.name}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
            }}
            deleteTitle={'Удалить магазин'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-modal',
                  message: `Вы уверенны, что хотите удалить магазин ${dataItem.name}?`,
                  confirm: () => {
                    showLoading();
                    deleteShopFromCompanyMutation({
                      variables: {
                        input: {
                          shopId: dataItem._id,
                          companyId: `${currentCompany._id}`,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <CmsCompanyLayout company={currentCompany}>
      <Inner testId={'company-shops-list'}>
        <div className={`text-xl font-medium mb-2`}>{counterString}</div>
        <FormikIndividualSearch
          withReset
          onReset={() => {
            router.push(basePath).catch((e) => console.log(e));
          }}
          onSubmit={(search) => {
            router.push(`${basePath}?search=${search}`).catch((e) => console.log(e));
          }}
        />

        <div className={`relative overflow-x-auto overflow-y-hidden`}>
          <Table<ShopInterface>
            onRowDoubleClick={(dataItem) => {
              router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
            }}
            columns={columns}
            data={docs}
            testIdKey={'_id'}
          />

          {isPageLoading ? <Spinner isNestedAbsolute isTransparent /> : null}

          <FixedButtons>
            <Button
              onClick={() => {
                showModal<CreateShopModalInterface>({
                  variant: CREATE_SHOP_MODAL,
                  props: {
                    companyId: `${currentCompany._id}`,
                  },
                });
              }}
              testId={'create-shop'}
              size={'small'}
            >
              Добавить магазин
            </Button>
          </FixedButtons>
        </div>

        <Pager
          page={page}
          totalPages={totalPages}
          setPage={(newPage) => {
            const pageParam = `${QUERY_FILTER_PAGE}${CATALOGUE_OPTION_SEPARATOR}${newPage}`;
            const prevUrlArray = pagerUrl.split('/').filter((param) => param);
            const nextUrl = [...prevUrlArray, pageParam].join('/');
            router.push(`/${nextUrl}`).catch((e) => {
              console.log(e);
            });
          }}
        />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface CompanyShopsPageInterface extends PagePropsInterface, CompanyShopsConsumerInterface {}

const CompanyShopsPage: NextPage<CompanyShopsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CompanyShopsConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const db = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);

  const { filters, search } = query;
  const [companyId, ...restFilter] = alwaysArray(filters);
  const basePath = `${ROUTE_CMS}/companies/${companyId}/shops/${companyId}`;
  const itemPath = `${ROUTE_CMS}/companies/${companyId}/shops/shop`;

  // Cast filters
  const { pagerUrl, page, skip, limit, clearSlug } = castCatalogueFilters({
    filters: restFilter,
    basePath,
  });

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
      basePath,
      itemPath,
      clearSlug,
      page,
      pagerUrl,
      hasPrevPage: shopsAggregation.hasPrevPage,
      hasNextPage: shopsAggregation.hasNextPage,
      totalPages: noNaN(shopsAggregation.totalPages),
      totalDocs: noNaN(shopsAggregation.totalDocs),
      docs: castDbData(docs),
    },
  };
};

export default CompanyShopsPage;