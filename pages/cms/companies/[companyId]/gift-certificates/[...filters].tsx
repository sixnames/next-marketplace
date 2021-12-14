import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateShopModalInterface } from 'components/Modal/CreateShopModal';
import Pager from 'components/Pager';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { getConsoleGiftCertificates } from 'db/dao/giftCertificate/getConsoleGiftCertificates';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  GetConsoleGiftCertificatesPayloadInterface,
  GiftCertificateInterface,
} from 'db/uiInterfaces';
import usePageLoadingState from 'hooks/usePageLoadingState';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getNumWord } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CompanyGiftCertificatesInterface extends GetConsoleGiftCertificatesPayloadInterface {
  pageCompany: CompanyInterface;
}

const CompanyGiftCertificatesConsumer: React.FC<CompanyGiftCertificatesInterface> = ({
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

interface CompanyGiftCertificatesPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyGiftCertificatesInterface {}

const CompanyGiftCertificatesPage: NextPage<CompanyGiftCertificatesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyGiftCertificatesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyGiftCertificatesPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { filters, companyId } = query;

  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${companyId}`),
        },
      },
      {
        $lookup: {
          from: COL_USERS,
          as: 'owner',
          let: { ownerId: '$ownerId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$ownerId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const rawPayload = await getConsoleGiftCertificates({
    filters: alwaysArray(filters),
    companyId: companyResult._id,
    locale: props.sessionLocale,
  });
  const payload = castDbData(rawPayload);

  return {
    props: {
      ...props,
      ...payload,
      pageCompany: castDbData(companyResult),
    },
  };
};

export default CompanyGiftCertificatesPage;
