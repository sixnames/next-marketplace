import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ManufacturerModalInterface } from 'components/Modal/ManufacturerModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import {
  ISO_LANGUAGES,
  DEFAULT_PAGE,
  SORT_DESC,
  DEFAULT_LOCALE,
  SORT_ASC,
  CMS_BRANDS_LIMIT,
} from 'config/common';
import { CONFIRM_MODAL, MANUFACTURER_MODAL } from 'config/modalVariants';
import { COL_MANUFACTURERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppPaginationInterface, ManufacturerInterface } from 'db/uiInterfaces';
import { useDeleteManufacturerMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppContentWrapper';
import { alwaysArray } from 'lib/arrayUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { createManufacturerSchema, updateManufacturerSchema } from 'validation/manufacturerSchema';

type ManufacturersConsumerInterface = AppPaginationInterface<ManufacturerInterface>;

const pageTitle = 'Производители';

const ManufacturersConsumer: React.FC<ManufacturersConsumerInterface> = ({
  docs,
  page,
  totalPages,
}) => {
  const setPageHandler = useNavigateToPageHandler();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deleteManufacturerMutation] = useDeleteManufacturerMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteManufacturer),
    onError: onErrorCallback,
  });
  const createValidationSchema = useValidationSchema({
    schema: createManufacturerSchema,
  });
  const updateValidationSchema = useValidationSchema({
    schema: updateManufacturerSchema,
  });

  const updateManufacturerHandler = React.useCallback(
    (dataItem: ManufacturerInterface) => {
      showModal<ManufacturerModalInterface>({
        variant: MANUFACTURER_MODAL,
        props: {
          manufacturer: dataItem,
          validationSchema: updateValidationSchema,
        },
      });
    },
    [showModal, updateValidationSchema],
  );

  const columns: TableColumn<ManufacturerInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return (
          <div
            className='cursor-pointer text-theme hover:underline'
            onClick={() => {
              updateManufacturerHandler(dataItem);
            }}
          >
            {cellData}
          </div>
        );
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
              updateTitle={'Редактировать производителя'}
              updateHandler={() => {
                updateManufacturerHandler(dataItem);
              }}
              deleteTitle={'Удалить производителя'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-manufacturer-modal',
                    message: `Вы уверены, что хотите удалить производителя ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteManufacturerMutation({
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
    <AppContentWrapper testId={'manufacturers-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <Table<ManufacturerInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                updateManufacturerHandler(dataItem);
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
              testId={'create-manufacturer'}
              size={'small'}
              onClick={() => {
                showModal<ManufacturerModalInterface>({
                  variant: MANUFACTURER_MODAL,
                  props: {
                    validationSchema: createValidationSchema,
                  },
                });
              }}
            >
              Добавить производителя
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface ManufacturersPageInterface extends PagePropsInterface, ManufacturersConsumerInterface {}

const ManufacturersPage: NextPage<ManufacturersPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ManufacturersConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ManufacturersPageInterface>> => {
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
  const itemPath = ``;

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
  const manufacturersCollection = db.collection<ManufacturerInterface>(COL_MANUFACTURERS);

  const manufacturersAggregationResult = await manufacturersCollection
    .aggregate<ManufacturersConsumerInterface>(
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
  const manufacturersResult = manufacturersAggregationResult[0];
  if (!manufacturersResult) {
    return {
      notFound: true,
    };
  }

  const docs: ManufacturerInterface[] = [];
  for await (const manufacturer of manufacturersResult.docs) {
    docs.push({
      ...manufacturer,
      name: getFieldStringLocale(manufacturer.nameI18n, locale),
    });
  }

  const payload: ManufacturersConsumerInterface = {
    clearSlug,
    totalDocs: manufacturersResult.totalDocs,
    totalPages: manufacturersResult.totalPages,
    hasNextPage: manufacturersResult.hasNextPage,
    hasPrevPage: manufacturersResult.hasPrevPage,
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

export default ManufacturersPage;
