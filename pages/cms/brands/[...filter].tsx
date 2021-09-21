import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import {
  ISO_LANGUAGES,
  DEFAULT_PAGE,
  ROUTE_CMS,
  CMS_BRANDS_LIMIT,
  SORT_ASC,
  DEFAULT_LOCALE,
  SORT_DESC,
} from 'config/common';
import { CONFIRM_MODAL, CREATE_BRAND_MODAL } from 'config/modalVariants';
import { COL_BRANDS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppPaginationInterface, BrandInterface } from 'db/uiInterfaces';
import { useDeleteBrandMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

type BrandsConsumerInterface = AppPaginationInterface<BrandInterface>;

const pageTitle = 'Бренды';

const BrandsConsumer: React.FC<BrandsConsumerInterface> = ({
  docs,
  page,
  totalPages,
  itemPath,
}) => {
  const router = useRouter();
  const setPageHandler = useNavigateToPageHandler();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deleteBrandMutation] = useDeleteBrandMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteBrand),
    onError: onErrorCallback,
  });

  const columns: TableColumn<BrandInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return <Link href={`${itemPath}/${dataItem._id}`}>{cellData}</Link>;
      },
    },
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать бренд'}
              updateHandler={() => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}
              deleteTitle={'Удалить бренд'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-brand-modal',
                    message: `Вы уверены, что хотите удалить бренд ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteBrandMutation({
                        variables: {
                          _id: dataItem._id,
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'brands-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <Table<BrandInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
              }}
            />
          </div>

          <Pager
            page={page}
            totalPages={totalPages}
            setPage={(newPage) => {
              setPageHandler(newPage);
            }}
          />

          <FixedButtons>
            <Button
              testId={'create-brand'}
              size={'small'}
              onClick={() => {
                showModal({
                  variant: CREATE_BRAND_MODAL,
                });
              }}
            >
              Добавить бренд
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface BrandsPageInterface extends PagePropsInterface, BrandsConsumerInterface {}

const BrandsPage: NextPage<BrandsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <BrandsConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BrandsPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { query } = context;
  const { filter, search } = query;
  const locale = props.sessionLocale;

  // Cast filters
  const {
    // realFilterOptions,
    // noFiltersSelected,
    page,
    skip,
    limit,
    clearSlug,
  } = castCatalogueFilters({
    filters: alwaysArray(filter),
    initialLimit: CMS_BRANDS_LIMIT,
  });
  const itemPath = `${ROUTE_CMS}/brands/brand`;

  const regexSearch = {
    $regex: search,
    $options: 'i',
  };

  // TODO algolia
  const nameSearch = search
    ? ISO_LANGUAGES.map(({ slug }) => {
        return {
          [slug]: search,
        };
      })
    : [];

  const searchStage = search
    ? [
        {
          $match: {
            $or: [
              ...nameSearch,
              {
                url: regexSearch,
              },
              {
                slug: regexSearch,
              },
              {
                itemId: regexSearch,
              },
            ],
          },
        },
      ]
    : [];

  const { db } = await getDatabase();
  const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);

  const brandsAggregationResult = await brandsCollection
    .aggregate<BrandsConsumerInterface>(
      [
        ...searchStage,
        {
          $facet: {
            docs: [
              {
                $sort: {
                  [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
                  _id: SORT_DESC,
                },
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
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
            totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
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
              $gt: [page, DEFAULT_PAGE],
            },
            hasNextPage: {
              $lt: [page, '$totalPages'],
            },
          },
        },
      ],
      { allowDiskUse: true },
    )
    .toArray();
  const brandsResult = brandsAggregationResult[0];
  if (!brandsResult) {
    return {
      notFound: true,
    };
  }

  const docs: BrandInterface[] = [];
  for await (const brand of brandsResult.docs) {
    docs.push({
      ...brand,
      name: getFieldStringLocale(brand.nameI18n, locale),
    });
  }

  const payload: BrandsConsumerInterface = {
    clearSlug,
    totalDocs: brandsResult.totalDocs,
    totalPages: brandsResult.totalPages,
    hasNextPage: brandsResult.hasNextPage,
    hasPrevPage: brandsResult.hasPrevPage,
    itemPath,
    page,
    docs,
  };
  const castedPayload = castDbData(payload);
  return {
    props: {
      ...props,
      ...castedPayload,
    },
  };
};

export default BrandsPage;
