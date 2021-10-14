import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import Currency from 'components/Currency';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { SetUserCategoryModalInterface } from 'components/Modal/SetUserCategoryModal';
import Percent from 'components/Percent';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS, SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, SET_USER_CATEGORY_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_COMPANIES, COL_ROLES, COL_USER_CATEGORIES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, UserCategoryInterface, UserInterface } from 'db/uiInterfaces';
import { useSetUserCategoryMutation } from 'hooks/mutations/useUserMutations';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsUserLayout from 'layout/CmsLayout/CmsUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface UserCategoriesConsumerInterface {
  user: UserInterface;
  companies: CompanyInterface[];
}

const UserCategoriesConsumer: React.FC<UserCategoriesConsumerInterface> = ({ user, companies }) => {
  const { showModal } = useAppContext();
  const [setUserCategoryMutation] = useSetUserCategoryMutation();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Категории`,
    config: [
      {
        name: 'Пользователи',
        href: `${ROUTE_CMS}/users`,
      },
      {
        name: `${user.fullName}`,
        href: `${ROUTE_CMS}/users/user/${user._id}`,
      },
    ],
  };

  const columns: TableColumn<UserCategoryInterface>[] = [
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
      headTitle: 'Кешбек',
      accessor: 'cashbackPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Оплата кешбеком',
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
            <Table columns={columns} data={user.categories} testIdKey={'name'} />
          </div>

          <FixedButtons>
            <Button
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
            </Button>
          </FixedButtons>
        </div>
      </Inner>
    </CmsUserLayout>
  );
};

interface UserCategoriesPageInterface extends PagePropsInterface, UserCategoriesConsumerInterface {}

const UserCategoriesPage: NextPage<UserCategoriesPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <UserCategoriesConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserCategoriesPageInterface>> => {
  const { query } = context;
  const { userId } = query;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);

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
