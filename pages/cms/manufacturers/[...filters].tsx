import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ManufacturerModalInterface } from 'components/Modal/ManufacturerModal';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getCmsManufacturersListPageSsr } from 'db/ssr/manufacturers/getCmsManufacturersListPageSsr';
import { AppPaginationInterface, ManufacturerInterface } from 'db/uiInterfaces';
import { useDeleteManufacturerMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { CONFIRM_MODAL, MANUFACTURER_MODAL } from 'lib/config/modalVariants';
import { GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { createManufacturerSchema, updateManufacturerSchema } from 'validation/manufacturerSchema';

export type CmsManufacturersListConsumerInterface = AppPaginationInterface<ManufacturerInterface>;

const pageTitle = 'Производители';

const CmsManufacturersListConsumer: React.FC<CmsManufacturersListConsumerInterface> = ({
  docs,
  page,
  totalPages,
}) => {
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

  const columns: WpTableColumn<ManufacturerInterface>[] = [
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
        <WpTitle>{pageTitle}</WpTitle>
        <div className='relative'>
          <FormikRouterSearch testId={'brands'} />

          <div className='overflew-x-auto overflew-y-hidden'>
            <WpTable<ManufacturerInterface>
              columns={columns}
              data={docs}
              testIdKey={'name'}
              onRowDoubleClick={(dataItem) => {
                updateManufacturerHandler(dataItem);
              }}
            />
          </div>

          <Pager page={page} totalPages={totalPages} />

          <FixedButtons>
            <WpButton
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
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

export interface CmsManufacturersListPageInterface
  extends GetAppInitialDataPropsInterface,
    CmsManufacturersListConsumerInterface {}

const CmsManufacturersListPage: NextPage<CmsManufacturersListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CmsManufacturersListConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsManufacturersListPageSsr;
export default CmsManufacturersListPage;
