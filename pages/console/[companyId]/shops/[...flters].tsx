import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateShopModalInterface } from 'components/Modal/CreateShopModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import Title from 'components/Title';
import { PAGE_DEFAULT, ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from 'config/modalVariants';
import { COL_CITIES, COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
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
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale, getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

const pageTitle = 'Магазины компании';

interface CompanyShopsPageConsumerInterface extends AppPaginationInterface<ShopInterface> {
  currentCompany?: CompanyInterface | null;
}

const CompanyShopsPageConsumer: React.FC<CompanyShopsPageConsumerInterface> = ({
  page,
  totalPages,
  totalDocs,
  itemPath,
  docs,
  currentCompany,
}) => {
  const isPageLoading = usePageLoadingState();
  const setPageHandler = useNavigateToPageHandler();
  const router = useRouter();
  const { showModal, showLoading, onCompleteCallback, onErrorCallback, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
      withModal: true,
    });

  const [deleteShopFromCompanyMutation] = useDeleteShopFromCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopFromCompany),
    onError: onErrorCallback,
  });

  const counterString = React.useMemo(() => {
    if (totalDocs < 1) {
      return '';
    }

    const counterPostfix = getNumWord(totalDocs, ['магазин', 'магазина', 'магазинов']);
    const counterPrefix = getNumWord(totalDocs, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${totalDocs} ${counterPostfix}`;
  }, [totalDocs]);

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
            justifyContent={'flex-end'}
            testId={dataItem.name}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router.push(`${itemPath}/${dataItem._id}`).catch(console.log);
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
                          companyId: `${currentCompany?._id}`,
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
    <AppContentWrapper>
      <Inner testId={'shops-list'}>
        <Title>{pageTitle}</Title>
        <div className={`text-xl font-medium mb-2`}>{counterString}</div>
        <FormikRouterSearch testId={'shops'} />

        <div className={`relative overflow-x-auto overflow-y-hidden`}>
          <Table<ShopInterface>
            columns={columns}
            data={docs}
            testIdKey={'name'}
            onRowDoubleClick={(dataItem) => {
              router.push(`${itemPath}/${dataItem._id}`).catch(console.log);
            }}
          />

          {isPageLoading ? <Spinner isNestedAbsolute isTransparent /> : null}

          <FixedButtons>
            <Button
              onClick={() => {
                showModal<CreateShopModalInterface>({
                  variant: CREATE_SHOP_MODAL,
                  props: {
                    companyId: `${currentCompany?._id}`,
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
            setPageHandler(newPage);
          }}
        />
      </Inner>
    </AppContentWrapper>
  );
};

interface CompanyShopsPageInterface extends PagePropsInterface, CompanyShopsPageConsumerInterface {}

const CompanyShopsPage: NextPage<CompanyShopsPageInterface> = (props) => {
  const { pageUrls, currentCompany } = props;

  return (
    <ConsoleLayout title={'Магазины компании'} pageUrls={pageUrls} company={currentCompany}>
      <CompanyShopsPageConsumer {...props} />
    </ConsoleLayout>
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
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);

  const { filters, search } = query;
  const filtersArray = alwaysArray(filters);

  // Cast filters
  const { page, skip, limit, clearSlug } = castCatalogueFilters({
    filters: filtersArray,
  });
  const itemPath = `${ROUTE_CONSOLE}/${query.companyId}/shops/shop`;

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
          companyId: new ObjectId(`${query.companyId}`),
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

  if (!props.currentCompany) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      itemPath,
      clearSlug,
      page,
      currentCompany: props.currentCompany,
      hasPrevPage: shopsAggregation.hasPrevPage,
      hasNextPage: shopsAggregation.hasNextPage,
      totalPages: noNaN(shopsAggregation.totalPages),
      totalDocs: noNaN(shopsAggregation.totalDocs),
      docs: castDbData(docs),
    },
  };
};

export default CompanyShopsPage;
