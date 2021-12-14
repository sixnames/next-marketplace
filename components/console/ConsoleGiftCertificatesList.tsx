import Button from 'components/button/Button';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import Currency from 'components/Currency';
import Inner from 'components/Inner';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateShopModalInterface } from 'components/Modal/CreateShopModal';
import Pager from 'components/Pager';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  GetConsoleGiftCertificatesPayloadInterface,
  GiftCertificateInterface,
  UserInterface,
} from 'db/uiInterfaces';
import usePageLoadingState from 'hooks/usePageLoadingState';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getNumWord } from 'lib/i18n';
import * as React from 'react';

export interface ConsoleGiftCertificatesListInterface
  extends GetConsoleGiftCertificatesPayloadInterface {
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const ConsoleGiftCertificatesList: React.FC<ConsoleGiftCertificatesListInterface> = ({
  pageCompany,
  page,
  totalPages,
  totalDocs,
  docs,
}) => {
  const isPageLoading = usePageLoadingState();
  const { showModal } = useAppContext();

  const counterString = React.useMemo(() => {
    if (totalDocs < 1) {
      return '';
    }

    const counterPostfix = getNumWord(totalDocs, ['сертификат', 'сертификата', 'сертификатов']);
    const counterPrefix = getNumWord(totalDocs, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${totalDocs} ${counterPostfix}`;
  }, [totalDocs]);

  const columns: TableColumn<GiftCertificateInterface>[] = [
    {
      accessor: 'code',
      headTitle: 'Код',
      render: ({ cellData }) => <div>{cellData}</div>,
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'initialValue',
      headTitle: 'Сумма',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      accessor: 'value',
      headTitle: 'Остаток',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      accessor: 'user',
      headTitle: 'Клиент',
      render: ({ cellData }) => {
        const user = cellData as UserInterface;
        if (!user) {
          return <div>Не назначен</div>;
        }
        return (
          <div>
            <div>{user.fullName}</div>
            <div>
              <LinkEmail value={user.email} />
            </div>
            <LinkPhone value={user.formattedPhone} />
          </div>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={dataItem.code}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              console.log('update');
            }}
            deleteTitle={'Удалить магазин'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-modal',
                  message: `Вы уверенны, что хотите удалить подарочный сертификат ${dataItem.code}?`,
                  confirm: () => {
                    console.log('delete');
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Подарочные сертификаты',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${pageCompany?.name}`,
        href: `${ROUTE_CMS}/companies/${pageCompany?._id}`,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-shops-list'}>
        <div className={`text-xl font-medium mb-2`}>{counterString}</div>

        <div className={`relative overflow-x-auto overflow-y-hidden`}>
          <Table<GiftCertificateInterface>
            columns={columns}
            data={docs}
            testIdKey={'_id'}
            onRowDoubleClick={(dataItem) => {
              console.log('update', dataItem);
            }}
          />

          {isPageLoading ? <Spinner isNestedAbsolute isTransparent /> : null}

          <FixedButtons>
            <Button
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
              Добавить подарочный сертификат
            </Button>
          </FixedButtons>
        </div>

        <Pager page={page} totalPages={totalPages} />
      </Inner>
    </CmsCompanyLayout>
  );
};

export default ConsoleGiftCertificatesList;
