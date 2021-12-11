import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager';
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
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

type BrandsConsumerInterface = AppPaginationInterface<BrandInterface>;

const pageTitle = 'Бренды';

const BrandsConsumer: React.FC<BrandsConsumerInterface> = ({
  docs,
  page,
  totalPages,
  itemPath,
}) => {
  const router = useRouter();
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

          <Pager page={page} totalPages={totalPages} />

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

interface BrandsPageInterface extends GetAppInitialDataPropsInterface, BrandsConsumerInterface {}

const BrandsPage: NextPage<BrandsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <BrandsConsumer {...props} />
    </ConsoleLayout>
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
  const { filters, search } = query;
  const locale = props.sessionLocale;

  // Cast filters
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: alwaysArray(filters),
    initialLimit: CMS_BRANDS_LIMIT,
    searchFieldName: '_id',
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
