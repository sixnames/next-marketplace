import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Currency from 'components/Currency';
import Inner from 'components/Inner';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { UserCategoryModalInterface } from 'components/Modal/UserCategoryModal';
import Percent from 'components/Percent';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { COL_USER_CATEGORIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  UserCategoryInterface,
} from 'db/uiInterfaces';
import { useDeleteUserCategory } from 'hooks/mutations/useUserCategoryMutations';
import { CONFIRM_MODAL, USER_CATEGORY_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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

  const links = getProjectLinks({
    companyId: pageCompany?._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.cms.companies.companyId.url,
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
