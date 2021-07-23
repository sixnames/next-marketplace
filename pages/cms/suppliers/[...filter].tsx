import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { SupplierModalInterface } from 'components/Modal/SupplierModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { ISO_LANGUAGES, PAGE_DEFAULT, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL, SUPPLIER_MODAL } from 'config/modalVariants';
import { COL_SUPPLIERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppPaginationInterface, SupplierInterface } from 'db/uiInterfaces';
import { useDeleteSupplierMutation } from 'generated/apolloComponents';
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
import { createSupplierSchema, updateSupplierSchema } from 'validation/supplierSchema';

type SuppliersConsumerInterface = AppPaginationInterface<SupplierInterface>;

const pageTitle = 'Производители';

const SuppliersConsumer: React.FC<SuppliersConsumerInterface> = ({ docs, page, totalPages }) => {
  const setPageHandler = useNavigateToPageHandler();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [deleteSupplierMutation] = useDeleteSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteSupplier),
    onError: onErrorCallback,
  });
  const createValidationSchema = useValidationSchema({
    schema: createSupplierSchema,
  });
  const updateValidationSchema = useValidationSchema({
    schema: updateSupplierSchema,
  });

  const updateSupplierHandler = React.useCallback(
    (dataItem: SupplierInterface) => {
      showModal<SupplierModalInterface>({
        variant: SUPPLIER_MODAL,
        props: {
          supplier: dataItem,
          validationSchema: updateValidationSchema,
        },
      });
    },
    [showModal, updateValidationSchema],
  );

  const columns: TableColumn<SupplierInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return (
          <div
            className='cursor-pointer text-theme hover:underline'
            onClick={() => {
              updateSupplierHandler(dataItem);
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
              updateTitle={'Редактировать поставщика'}
              updateHandler={() => {
                updateSupplierHandler(dataItem);
              }}
              deleteTitle={'Удалить поставщика'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-supplier-modal',
                    message: `Вы уверены, что хотите удалить поставщика ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteSupplierMutation({
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
    <AppContentWrapper testId={'suppliers-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <Title>{pageTitle}</Title>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <Table<SupplierInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                updateSupplierHandler(dataItem);
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
              testId={'create-supplier'}
              size={'small'}
              onClick={() => {
                showModal<SupplierModalInterface>({
                  variant: SUPPLIER_MODAL,
                  props: {
                    validationSchema: createValidationSchema,
                  },
                });
              }}
            >
              Добавить поставщика
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface SuppliersPageInterface extends PagePropsInterface, SuppliersConsumerInterface {}

const SuppliersPage: NextPage<SuppliersPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <SuppliersConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SuppliersPageInterface>> => {
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
  const suppliersCollection = db.collection<SupplierInterface>(COL_SUPPLIERS);

  const suppliersAggregationResult = await suppliersCollection
    .aggregate<SuppliersConsumerInterface>(
      [
        ...searchStage,
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
              $gt: [page, PAGE_DEFAULT],
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
  const suppliersResult = suppliersAggregationResult[0];
  if (!suppliersResult) {
    return {
      notFound: true,
    };
  }

  const docs: SupplierInterface[] = [];
  for await (const supplier of suppliersResult.docs) {
    docs.push({
      ...supplier,
      name: getFieldStringLocale(supplier.nameI18n, locale),
    });
  }

  const payload: SuppliersConsumerInterface = {
    clearSlug,
    totalDocs: suppliersResult.totalDocs,
    totalPages: suppliersResult.totalPages,
    hasNextPage: suppliersResult.hasNextPage,
    hasPrevPage: suppliersResult.hasPrevPage,
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

export default SuppliersPage;
