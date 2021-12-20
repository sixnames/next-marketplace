import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from '../../../components/button/ContentItemControls';
import FixedButtons from '../../../components/button/FixedButtons';
import WpButton from '../../../components/button/WpButton';
import FormikRouterSearch from '../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../components/Inner';
import { ConfirmModalInterface } from '../../../components/Modal/ConfirmModal';
import { SupplierModalInterface } from '../../../components/Modal/SupplierModal';
import Pager from '../../../components/Pager';
import WpTable, { WpTableColumn } from '../../../components/WpTable';
import WpTitle from '../../../components/WpTitle';
import {
  CMS_BRANDS_LIMIT,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  ISO_LANGUAGES,
  SORT_ASC,
  SORT_DESC,
} from '../../../config/common';
import { CONFIRM_MODAL, SUPPLIER_MODAL } from '../../../config/modalVariants';
import { COL_SUPPLIERS } from '../../../db/collectionNames';
import { getDatabase } from '../../../db/mongodb';
import { AppPaginationInterface, SupplierInterface } from '../../../db/uiInterfaces';
import { useDeleteSupplierMutation } from '../../../generated/apolloComponents';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../hooks/useValidationSchema';
import AppContentWrapper from '../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import { alwaysArray } from '../../../lib/arrayUtils';
import { castUrlFilters } from '../../../lib/catalogueUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../lib/ssrUtils';
import { createSupplierSchema, updateSupplierSchema } from '../../../validation/supplierSchema';

type SuppliersConsumerInterface = AppPaginationInterface<SupplierInterface>;

const pageTitle = 'Поставщики';

const SuppliersConsumer: React.FC<SuppliersConsumerInterface> = ({ docs, page, totalPages }) => {
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

  const columns: WpTableColumn<SupplierInterface>[] = [
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
        <WpTitle>{pageTitle}</WpTitle>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<SupplierInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                updateSupplierHandler(dataItem);
              }}
            />
          </div>

          <Pager page={page} totalPages={totalPages} />

          <FixedButtons>
            <WpButton
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
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface SuppliersPageInterface
  extends GetAppInitialDataPropsInterface,
    SuppliersConsumerInterface {}

const SuppliersPage: NextPage<SuppliersPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <SuppliersConsumer {...props} />
    </ConsoleLayout>
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
  const { filters, search } = query;
  const locale = props.sessionLocale;

  // Cast filters
  const { page, skip, limit, clearSlug } = await castUrlFilters({
    filters: alwaysArray(filters),
    initialLimit: CMS_BRANDS_LIMIT,
    searchFieldName: '_id',
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
