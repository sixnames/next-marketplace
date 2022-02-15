import { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { SupplierModalInterface } from 'components/Modal/SupplierModal';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { CONFIRM_MODAL, SUPPLIER_MODAL } from 'lib/config/modalVariants';
import { getCmsSuppliersListPageSsr } from 'db/ssr/suppliers/getCmsSuppliersListPageSsr';
import { AppPaginationInterface, SupplierInterface } from 'db/uiInterfaces';
import { useDeleteSupplierMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { createSupplierSchema, updateSupplierSchema } from 'validation/supplierSchema';

export type CmsSuppliersListConsumerInterface = AppPaginationInterface<SupplierInterface>;

const pageTitle = 'Поставщики';

const CmsSuppliersListConsumer: React.FC<CmsSuppliersListConsumerInterface> = ({
  docs,
  page,
  totalPages,
}) => {
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

export interface CmsSuppliersListPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsSuppliersListConsumerInterface {}

const CmsSuppliersListPage: NextPage<CmsSuppliersListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsSuppliersListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsSuppliersListPageSsr;
export default CmsSuppliersListPage;
