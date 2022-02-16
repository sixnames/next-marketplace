import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getCmsBrandsListPageSsr } from 'db/ssr/brands/getCmsBrandsListPageSsr';
import { AppPaginationInterface, BrandInterface } from 'db/uiInterfaces';
import { useDeleteBrand } from 'hooks/mutations/useBrandMutations';
import { CONFIRM_MODAL, CREATE_BRAND_MODAL } from 'lib/config/modalVariants';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

export type CmsBrandsListConsumerInterface = AppPaginationInterface<BrandInterface>;

const pageTitle = 'Бренды';

const CmsBrandsListConsumer: React.FC<CmsBrandsListConsumerInterface> = ({
  docs,
  page,
  totalPages,
  itemPath,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();

  const [deleteBrandMutation] = useDeleteBrand();

  const columns: WpTableColumn<BrandInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ cellData, dataItem }) => {
        return <WpLink href={`${itemPath}/${dataItem._id}`}>{cellData}</WpLink>;
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
                      deleteBrandMutation({
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

  return (
    <AppContentWrapper testId={'brands-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<BrandInterface>
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
            <WpButton
              testId={'create-brand'}
              size={'small'}
              onClick={() => {
                showModal({
                  variant: CREATE_BRAND_MODAL,
                });
              }}
            >
              Добавить бренд
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

export interface CmsBrandsListPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsBrandsListConsumerInterface {}

export const CmsBrandsListPage: NextPage<CmsBrandsListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsBrandsListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsBrandsListPageSsr;
export default CmsBrandsListPage;
