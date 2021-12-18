import WpButton from 'components/button/WpButton';
import ContentItemControls from 'components/button/ContentItemControls';
import Currency from 'components/Currency';
import FixedButtons from 'components/button/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { UserCategoryModalInterface } from 'components/Modal/UserCategoryModal';
import Percent from 'components/Percent';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, USER_CATEGORY_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_COMPANIES, COL_USER_CATEGORIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  UserCategoryInterface,
} from 'db/uiInterfaces';
import { useDeleteUserCategory } from 'hooks/mutations/useUserCategoryMutations';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CompanyDetailsConsumerInterface {
  pageCompany: CompanyInterface;
}

const CompanyDetailsConsumer: React.FC<CompanyDetailsConsumerInterface> = ({ pageCompany }) => {
  const { showModal } = useAppContext();
  const [deleteUserCategory] = useDeleteUserCategory();

  const columns: WpTableColumn<UserCategoryInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Скидка',
      accessor: 'discountPercent',
      render: ({ cellData }) => <Percent showNegativeValue value={cellData} />,
    },
    {
      headTitle: 'Кэшбэк',
      accessor: 'cashbackPercent',
      render: ({ cellData }) => <Percent showNegativeValue value={cellData} />,
    },
    {
      headTitle: 'Оплата кэшбэком',
      accessor: 'payFromCashbackPercent',
      render: ({ cellData }) => <Percent showNegativeValue value={cellData} />,
    },
    {
      headTitle: 'Порог вхождения',
      accessor: 'entryMinCharge',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать категорию клиента'}
              updateHandler={() => {
                showModal<UserCategoryModalInterface>({
                  variant: USER_CATEGORY_MODAL,
                  props: {
                    companyId: `${pageCompany?._id}`,
                    userCategory: dataItem,
                  },
                });
              }}
              deleteTitle={'Удалить категорию клиента'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-user-category-modal',
                    message: `Вы уверенны, что хотите удалить категорию клиента ${dataItem.name}?`,
                    confirm: () => {
                      deleteUserCategory({
                        _id: `${dataItem._id}`,
                        companyId: `${pageCompany?._id}`,
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
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
      <Inner testId={'company-categories-page'}>
        <WpTable<UserCategoryInterface>
          testIdKey={'name'}
          columns={columns}
          data={pageCompany?.categories}
        />
        <FixedButtons>
          <WpButton
            testId={'create-user-category'}
            size={'small'}
            onClick={() => {
              showModal<UserCategoryModalInterface>({
                variant: USER_CATEGORY_MODAL,
                props: {
                  companyId: `${pageCompany?._id}`,
                },
              });
            }}
          >
            Создать категорию клиента
          </WpButton>
        </FixedButtons>
      </Inner>
    </CmsCompanyLayout>
  );
};

interface CompanyDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyDetailsConsumerInterface {}

const CompanyDetailsPage: NextPage<CompanyDetailsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.companyId}`),
        },
      },
      {
        $lookup: {
          from: COL_USER_CATEGORIES,
          as: 'categories',
          let: { companyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$companyId', '$$companyId'],
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

  const company: CompanyInterface = {
    ...companyResult,
    categories: (companyResult.categories || []).map((userCategory) => {
      return {
        ...userCategory,
        name: getFieldStringLocale(userCategory.nameI18n, props.sessionLocale),
      };
    }),
  };

  return {
    props: {
      ...props,
      pageCompany: castDbData(company),
    },
  };
};

export default CompanyDetailsPage;
