import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from '../../../../../../components/button/ContentItemControls';
import FixedButtons from '../../../../../../components/button/FixedButtons';
import WpButton from '../../../../../../components/button/WpButton';
import FormikRouterSearch from '../../../../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../../../../components/Inner';
import { BrandCollectionModalInterface } from '../../../../../../components/Modal/BrandCollectionModal';
import { ConfirmModalInterface } from '../../../../../../components/Modal/ConfirmModal';
import Pager from '../../../../../../components/Pager';
import WpTable, { WpTableColumn } from '../../../../../../components/WpTable';
import WpTitle from '../../../../../../components/WpTitle';
import {
  CMS_BRANDS_LIMIT,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  SORT_ASC,
  SORT_DESC,
} from '../../../../../../config/common';
import { ISO_LANGUAGES } from '../../../../../../config/constantSelects';
import { BRAND_COLLECTION_MODAL, CONFIRM_MODAL } from '../../../../../../config/modalVariants';
import { COL_BRAND_COLLECTIONS, COL_BRANDS } from '../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AppPaginationInterface,
  BrandCollectionInterface,
  BrandInterface,
} from '../../../../../../db/uiInterfaces';
import { useDeleteCollectionFromBrandMutation } from '../../../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../../../../hooks/useValidationSchema';
import AppContentWrapper from '../../../../../../layout/AppContentWrapper';
import AppSubNav from '../../../../../../layout/AppSubNav';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { alwaysArray } from '../../../../../../lib/arrayUtils';
import { castUrlFilters } from '../../../../../../lib/castUrlFilters';
import { getProjectLinks } from '../../../../../../lib/getProjectLinks';
import { getFieldStringLocale } from '../../../../../../lib/i18n';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';
import {
  addCollectionToBrandSchema,
  updateCollectionInBrandSchema,
} from '../../../../../../validation/brandSchema';

type BrandCollectionsAggregationInterface = AppPaginationInterface<BrandCollectionInterface>;

interface BrandCollectionsConsumerInterface {
  brand: BrandInterface;
  collections: BrandCollectionsAggregationInterface;
}

const BrandCollectionsConsumer: React.FC<BrandCollectionsConsumerInterface> = ({
  brand,
  collections,
}) => {
  const { onErrorCallback, onCompleteCallback, showLoading, showModal } = useMutationCallbacks({
    reload: true,
  });
  const [deleteCollectionFromBrandMutation] = useDeleteCollectionFromBrandMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteCollectionFromBrand),
  });
  const createValidationSchema = useValidationSchema({
    schema: addCollectionToBrandSchema,
  });
  const updateValidationSchema = useValidationSchema({
    schema: updateCollectionInBrandSchema,
  });

  const updateBrandCollectionHandler = React.useCallback(
    (dataItem: BrandCollectionInterface) => {
      showModal<BrandCollectionModalInterface>({
        variant: BRAND_COLLECTION_MODAL,
        props: {
          validationSchema: updateValidationSchema,
          brandCollection: dataItem,
          brandId: `${brand._id}`,
        },
      });
    },
    [brand._id, showModal, updateValidationSchema],
  );

  const links = getProjectLinks({
    brandId: brand._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Коллекции',
    config: [
      {
        name: 'Бренды',
        href: links.cms.brands.url,
      },
      {
        name: `${brand.name}`,
        href: links.cms.brands.brand.brandId.url,
      },
    ],
  };

  const navConfig = [
    {
      name: 'Детали',
      testId: 'brand-details',
      path: links.cms.brands.brand.brandId.url,
      exact: true,
    },
    {
      name: 'Коллекции',
      testId: 'brand-collections',
      path: links.cms.brands.brand.brandId.collections.url,
    },
  ];

  const columns: WpTableColumn<BrandCollectionInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return (
          <div
            className='cursor-pointer text-theme hover:underline'
            onClick={() => {
              updateBrandCollectionHandler(dataItem);
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
              updateTitle={'Редактировать коллекцию бренда'}
              updateHandler={() => {
                updateBrandCollectionHandler(dataItem);
              }}
              deleteTitle={'Удалить коллекцию бренда'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-brand-collection-modal',
                    message: `Вы уверены, что хотите удалить коллекцию бренда ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteCollectionFromBrandMutation({
                        variables: {
                          input: {
                            brandCollectionId: `${dataItem._id}`,
                            brandId: `${brand._id}`,
                          },
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

  const { docs, page, totalPages } = collections;

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{brand.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle testId={`${brand.itemId}-brand-title`}>{brand.name}</WpTitle>
      </Inner>

      <AppSubNav navConfig={navConfig} />

      <Inner testId={'brand-collections-page'}>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<BrandCollectionInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                updateBrandCollectionHandler(dataItem);
              }}
            />
          </div>

          <Pager page={page} totalPages={totalPages} />

          <FixedButtons>
            <WpButton
              testId={'create-brand-collection'}
              size={'small'}
              onClick={() => {
                showModal<BrandCollectionModalInterface>({
                  variant: BRAND_COLLECTION_MODAL,
                  props: {
                    validationSchema: createValidationSchema,
                    brandId: `${brand._id}`,
                  },
                });
              }}
            >
              Добавить коллекцию бренда
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface BrandCollectionsPageInterface
  extends GetAppInitialDataPropsInterface,
    BrandCollectionsConsumerInterface {}

const BrandCollectionsPage: NextPage<BrandCollectionsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <BrandCollectionsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BrandCollectionsPageInterface>> => {
  const { query } = context;
  const { search } = query;
  const [brandId, ...filters] = alwaysArray(query.filters);
  const { db } = await getDatabase();
  const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionInterface>(COL_BRAND_COLLECTIONS);

  const { props } = await getAppInitialData({ context });
  if (!props || !brandId) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;

  const initialBrand = await brandsCollection.findOne({
    _id: new ObjectId(`${brandId}`),
  });
  if (!initialBrand) {
    return {
      notFound: true,
    };
  }

  const brand: BrandInterface = {
    ...initialBrand,
    name: getFieldStringLocale(initialBrand.nameI18n, props.sessionLocale),
  };

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

  const brandsAggregationResult = await brandCollectionsCollection
    .aggregate<BrandCollectionsAggregationInterface>(
      [
        {
          $match: {
            brandId: brand._id,
          },
        },
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

  const docs: BrandCollectionInterface[] = [];
  for await (const brand of brandsResult.docs) {
    docs.push({
      ...brand,
      name: getFieldStringLocale(brand.nameI18n, locale),
    });
  }

  const payload: BrandCollectionsAggregationInterface = {
    clearSlug,
    totalDocs: brandsResult.totalDocs || 0,
    totalPages: brandsResult.totalPages || 0,
    itemPath,
    page,
    docs,
  };

  return {
    props: {
      ...props,
      brand: castDbData(brand),
      collections: castDbData(payload),
    },
  };
};

export default BrandCollectionsPage;
