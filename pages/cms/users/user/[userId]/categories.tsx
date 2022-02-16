import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Currency from 'components/Currency';
import Inner from 'components/Inner';
import CmsUserLayout from 'components/layout/cms/CmsUserLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { SetUserCategoryModalInterface } from 'components/Modal/SetUserCategoryModal';
import Percent from 'components/Percent';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { COL_COMPANIES, COL_ROLES, COL_USER_CATEGORIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  UserCategoryInterface,
  UserInterface,
} from 'db/uiInterfaces';
import { useSetUserCategoryMutation } from 'hooks/mutations/useUserMutations';
import { SORT_ASC } from 'lib/config/common';
import { CONFIRM_MODAL, SET_USER_CATEGORY_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface UserCategoriesConsumerInterface {
  user: UserInterface;
  companies: CompanyInterface[];
}

const UserCategoriesConsumer: React.FC<UserCategoriesConsumerInterface> = ({ user, companies }) => {
  const { showModal } = useAppContext();
  const [setUserCategoryMutation] = useSetUserCategoryMutation();

  const links = getProjectLinks({
    userId: user._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Категории`,
    config: [
      {
        name: 'Пользователи',
        href: links.cms.users.url,
      },
      {
        name: `${user.fullName}`,
        href: links.cms.users.user.userId.url,
      },
    ],
  };

  const columns: WpTableColumn<UserCategoryInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Скидка',
      accessor: 'discountPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Кэшбэк',
      accessor: 'cashbackPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Оплата кэшбэком',
      accessor: 'payFromCashbackPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Порог вхождения',
      accessor: 'entryMinCharge',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      accessor: 'company.name',
      headTitle: 'Компания',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              deleteTitle={'Удалить категорию пользователя'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'unset-user-category-modal',
                    message: `Вы уверенны, что хотите убрать у пользователя категорию ${dataItem.name}?`,
                    confirm: () => {
                      setUserCategoryMutation({
                        userId: `${user._id}`,
                        categoryId: `${dataItem._id}`,
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
    <CmsUserLayout user={user} breadcrumbs={breadcrumbs}>
      <Inner testId={'user-categories-page'}>
        <div className='relative'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <WpTable columns={columns} data={user.categories} testIdKey={'name'} />
          </div>

          <FixedButtons>
            <WpButton
              size={'small'}
              testId={'add-user-category'}
              onClick={() => {
                showModal<SetUserCategoryModalInterface>({
                  variant: SET_USER_CATEGORY_MODAL,
                  props: {
                    companies,
                    userId: `${user._id}`,
                  },
                });
              }}
            >
              Добавить категорию пользователя
            </WpButton>
          </FixedButtons>
        </div>
      </Inner>
    </CmsUserLayout>
  );
};

interface UserCategoriesPageInterface
  extends GetAppInitialDataPropsInterface,
    UserCategoriesConsumerInterface {}

const UserCategoriesPage: NextPage<UserCategoriesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserCategoriesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserCategoriesPageInterface>> => {
  const { query } = context;
  const { userId } = query;
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();
  const companiesCollection = collections.companiesCollection();

  const { props } = await getAppInitialData({ context });
  if (!props || !userId) {
    return {
      notFound: true,
    };
  }
  const userAggregationResult = await usersCollection
    .aggregate<UserInterface>([
      {
        $match: {
          _id: new ObjectId(`${userId}`),
        },
      },

      // get role
      {
        $lookup: {
          from: COL_ROLES,
          as: 'role',
          let: { roleId: '$roleId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$roleId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          role: { $arrayElemAt: ['$role', 0] },
        },
      },

      // get categories
      {
        $lookup: {
          from: COL_USER_CATEGORIES,
          as: 'categories',
          let: { categoryIds: '$categoryIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$categoryIds'],
                },
              },
            },

            // get category company
            {
              $lookup: {
                from: COL_COMPANIES,
                as: 'company',
                let: { companyId: '$companyId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$companyId'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                company: {
                  $arrayElemAt: ['$company', 0],
                },
              },
            },
          ],
        },
      },

      // final project
      {
        $project: {
          password: false,
        },
      },
    ])
    .toArray();
  const userResult = userAggregationResult[0];
  if (!userResult) {
    return {
      notFound: true,
    };
  }

  const user: UserInterface = {
    ...userResult,
    fullName: getFullName(userResult),
    role: userResult.role
      ? {
          ...userResult.role,
          name: getFieldStringLocale(userResult.role.nameI18n, props.sessionLocale),
        }
      : null,
    categories: (userResult.categories || []).map((category) => {
      return {
        ...category,
        name: getFieldStringLocale(category.nameI18n, props.sessionLocale),
      };
    }),
  };

  // get companies list
  const companiesAggregation = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $lookup: {
          from: COL_USER_CATEGORIES,
          as: 'categories',
          let: {
            companyId: '$_id',
          },
          pipeline: [
            {
              $match: {
                _id: {
                  $nin: userResult.categoryIds,
                },
                $expr: {
                  $eq: ['$companyId', '$$companyId'],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: true,
          name: true,
          categories: true,
          categoriesCount: {
            $size: '$categories',
          },
        },
      },
      {
        $match: {
          categoriesCount: {
            $gt: 0,
          },
        },
      },
      {
        $sort: {
          name: SORT_ASC,
        },
      },
    ])
    .toArray();

  const companies = companiesAggregation.map((company) => {
    return {
      ...company,
      categories: (company.categories || []).map((category) => {
        return {
          ...category,
          name: getFieldStringLocale(category.nameI18n, props.sessionLocale),
        };
      }),
    };
  });

  return {
    props: {
      ...props,
      user: castDbData(user),
      companies: castDbData(companies),
    },
  };
};

export default UserCategoriesPage;
