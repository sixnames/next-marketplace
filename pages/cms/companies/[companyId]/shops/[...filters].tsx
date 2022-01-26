import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../../../../../components/button/ContentItemControls';
import FixedButtons from '../../../../../components/button/FixedButtons';
import WpButton from '../../../../../components/button/WpButton';
import FormikRouterSearch from '../../../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../../../components/Inner';
import WpLink from '../../../../../components/Link/WpLink';
import { ConfirmModalInterface } from '../../../../../components/Modal/ConfirmModal';
import { CreateShopModalInterface } from '../../../../../components/Modal/CreateShopModal';
import Pager from '../../../../../components/Pager';
import Spinner from '../../../../../components/Spinner';
import TableRowImage from '../../../../../components/TableRowImage';
import WpTable, { WpTableColumn } from '../../../../../components/WpTable';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from '../../../../../config/modalVariants';
import { getCmsCompanyShopsPageSsr } from '../../../../../db/dao/ssr/getCmsCompanyShopsPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  AppPaginationInterface,
  CompanyInterface,
  ShopInterface,
} from '../../../../../db/uiInterfaces';
import { useDeleteShopFromCompanyMutation } from '../../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../../hooks/useMutationCallbacks';
import usePageLoadingState from '../../../../../hooks/usePageLoadingState';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getNumWord } from '../../../../../lib/i18n';
import { getCmsCompanyLinks } from '../../../../../lib/linkUtils';
import { noNaN } from '../../../../../lib/numbers';
import { GetAppInitialDataPropsInterface } from '../../../../../lib/ssrUtils';

interface CompanyShopsConsumerInterface extends AppPaginationInterface<ShopInterface> {
  pageCompany: CompanyInterface;
}

const CompanyShopsConsumer: React.FC<CompanyShopsConsumerInterface> = ({
  pageCompany,
  page,
  totalPages,
  totalDocs,
  itemPath,
  docs,
}) => {
  const isPageLoading = usePageLoadingState();

  const router = useRouter();
  const { showModal, showLoading, onCompleteCallback, onErrorCallback, showErrorNotification } =
    useMutationCallbacks({
      reload: true,
      withModal: true,
    });

  const counterString = React.useMemo(() => {
    if (totalDocs < 1) {
      return '';
    }

    const counterPostfix = getNumWord(totalDocs, ['магазин', 'магазина', 'магазинов']);
    const counterPrefix = getNumWord(totalDocs, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${totalDocs} ${counterPostfix}`;
  }, [totalDocs]);

  const [deleteShopFromCompanyMutation] = useDeleteShopFromCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopFromCompany),
    onError: onErrorCallback,
  });

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
            testId={dataItem.name}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
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

  const { root, parentLink } = getCmsCompanyLinks({
    companyId: pageCompany._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Магазины',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-shops-list'}>
        <div className={`mb-2 text-xl font-medium`}>{counterString}</div>
        <FormikRouterSearch testId={'shops'} />

        <div className={`relative overflow-x-auto overflow-y-hidden`}>
          <WpTable<ShopInterface>
            onRowDoubleClick={(dataItem) => {
              router.push(`${itemPath}/${dataItem._id}`).catch((e) => console.log(e));
            }}
            columns={columns}
            data={docs}
            testIdKey={'_id'}
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
    </CmsCompanyLayout>
  );
};

export interface CmsCompanyShopsPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyShopsConsumerInterface {}

const CmsCompanyShopsPage: NextPage<CmsCompanyShopsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyShopsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsCompanyShopsPageSsr;
export default CmsCompanyShopsPage;
