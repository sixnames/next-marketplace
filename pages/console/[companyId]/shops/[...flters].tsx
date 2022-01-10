import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../../../../components/button/ContentItemControls';
import FixedButtons from '../../../../components/button/FixedButtons';
import WpButton from '../../../../components/button/WpButton';
import FormikRouterSearch from '../../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../../components/Inner';
import WpLink from '../../../../components/Link/WpLink';
import { ConfirmModalInterface } from '../../../../components/Modal/ConfirmModal';
import { CreateShopModalInterface } from '../../../../components/Modal/CreateShopModal';
import Pager from '../../../../components/Pager';
import Spinner from '../../../../components/Spinner';
import TableRowImage from '../../../../components/TableRowImage';
import WpTable, { WpTableColumn } from '../../../../components/WpTable';
import WpTitle from '../../../../components/WpTitle';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from '../../../../config/modalVariants';
import { getConsoleShopsListPageSsr } from '../../../../db/dao/ssr/getConsoleShopsListPageSsr';
import {
  AppPaginationInterface,
  CompanyInterface,
  ShopInterface,
} from '../../../../db/uiInterfaces';
import { useDeleteShopFromCompanyMutation } from '../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../hooks/useMutationCallbacks';
import usePageLoadingState from '../../../../hooks/usePageLoadingState';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getNumWord } from '../../../../lib/i18n';
import { noNaN } from '../../../../lib/numbers';
import { GetConsoleInitialDataPropsInterface } from '../../../../lib/ssrUtils';

const pageTitle = 'Магазины компании';

interface CompanyShopsPageConsumerInterface extends AppPaginationInterface<ShopInterface> {
  pageCompany: CompanyInterface;
}

const CompanyShopsPageConsumer: React.FC<CompanyShopsPageConsumerInterface> = ({
  page,
  totalPages,
  totalDocs,
  itemPath,
  docs,
  pageCompany,
}) => {
  const isPageLoading = usePageLoadingState();

  const router = useRouter();
  const { showModal, showLoading, onCompleteCallback, onErrorCallback, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
      withModal: true,
    });

  const [deleteShopFromCompanyMutation] = useDeleteShopFromCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopFromCompany),
    onError: onErrorCallback,
  });

  const counterString = React.useMemo(() => {
    if (totalDocs < 1) {
      return '';
    }

    const counterPostfix = getNumWord(totalDocs, ['магазин', 'магазина', 'магазинов']);
    const counterPrefix = getNumWord(totalDocs, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${totalDocs} ${counterPostfix}`;
  }, [totalDocs]);

  const columns: WpTableColumn<ShopInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <WpLink href={`${itemPath}/${dataItem._id}`}>{cellData}</WpLink>
      ),
    },
    {
      accessor: 'logo',
      headTitle: 'Лого',
      render: ({ cellData, dataItem }) => {
        return <TableRowImage src={cellData} alt={dataItem.name} title={dataItem.name} />;
      },
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: 'Товаров',
      render: ({ cellData }) => noNaN(cellData),
    },
    {
      accessor: 'city.name',
      headTitle: 'Город',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={dataItem.name}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router.push(`${itemPath}/${dataItem._id}`).catch(console.log);
            }}
            deleteTitle={'Удалить магазин'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-modal',
                  message: `Вы уверенны, что хотите удалить магазин ${dataItem.name}?`,
                  confirm: () => {
                    showLoading();
                    deleteShopFromCompanyMutation({
                      variables: {
                        input: {
                          shopId: dataItem._id,
                          companyId: `${pageCompany?._id}`,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Inner testId={'shops-list'}>
        <WpTitle>{pageTitle}</WpTitle>
        <div className={`text-xl font-medium mb-2`}>{counterString}</div>
        <FormikRouterSearch testId={'shops'} />

        <div className={`relative overflow-x-auto overflow-y-hidden`}>
          <WpTable<ShopInterface>
            columns={columns}
            data={docs}
            testIdKey={'name'}
            onRowDoubleClick={(dataItem) => {
              router.push(`${itemPath}/${dataItem._id}`).catch(console.log);
            }}
          />

          {isPageLoading ? <Spinner isNestedAbsolute isTransparent /> : null}

          <FixedButtons>
            <WpButton
              onClick={() => {
                showModal<CreateShopModalInterface>({
                  variant: CREATE_SHOP_MODAL,
                  props: {
                    companyId: `${pageCompany?._id}`,
                  },
                });
              }}
              testId={'create-shop'}
              size={'small'}
            >
              Добавить магазин
            </WpButton>
          </FixedButtons>
        </div>

        <Pager page={page} totalPages={totalPages} />
      </Inner>
    </AppContentWrapper>
  );
};

export interface ConsoleShopsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    AppPaginationInterface<ShopInterface> {}

const ConsoleShopsListPage: NextPage<ConsoleShopsListPageInterface> = (props) => {
  const { layoutProps } = props;

  return (
    <ConsoleLayout title={'Магазины компании'} {...layoutProps}>
      <CompanyShopsPageConsumer {...props} pageCompany={layoutProps.pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getConsoleShopsListPageSsr;
export default ConsoleShopsListPage;
