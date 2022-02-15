import { useAppContext } from 'context/appContext';
import { useDeleteBrandCollection } from 'hooks/mutations/useBrandMutations';
import { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import { BrandCollectionModalInterface } from 'components/Modal/BrandCollectionModal';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { BRAND_COLLECTION_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { getCmsBrandCollectionsPageSsr } from 'db/ssr/brands/getCmsBrandCollectionsPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  AppPaginationInterface,
  BrandCollectionInterface,
  BrandInterface,
} from 'db/uiInterfaces';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { createBrandCollectionSchema, updateCollectionInBrandSchema } from 'validation/brandSchema';

export type BrandCollectionsAggregationInterface = AppPaginationInterface<BrandCollectionInterface>;

interface CmsBrandCollectionsConsumerInterface {
  brand: BrandInterface;
  collections: BrandCollectionsAggregationInterface;
}

const CmsBrandCollectionsConsumer: React.FC<CmsBrandCollectionsConsumerInterface> = ({
  brand,
  collections,
}) => {
  const { showModal } = useAppContext();
  const [deleteBrandCollectionMutation] = useDeleteBrandCollection();
  const createValidationSchema = useValidationSchema({
    schema: createBrandCollectionSchema,
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
                      deleteBrandCollectionMutation({
                        _id: `${dataItem._id}`,
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

export interface CmsBrandCollectionsPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsBrandCollectionsConsumerInterface {}

const CmsBrandCollectionsPage: NextPage<CmsBrandCollectionsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsBrandCollectionsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsBrandCollectionsPageSsr;
export default CmsBrandCollectionsPage;
