import FakeInput from 'components/FormElements/Input/FakeInput';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { SetUserCategoryModalInterface } from 'components/Modal/SetUserCategoryModal';
import { ROUTE_CONSOLE, SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, SET_USER_CATEGORY_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_COMPANIES, COL_ROLES, COL_USER_CATEGORIES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, UserInterface } from 'db/uiInterfaces';
import { useSetUserCategoryMutation } from 'hooks/mutations/useUserMutations';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import ConsoleUserLayout from 'layout/console/ConsoleUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface UserDetailsConsumerInterface {
  user: UserInterface;
  currentCompany?: CompanyInterface | null;
  companies: CompanyInterface[];
}

const UserDetailsConsumer: React.FC<UserDetailsConsumerInterface> = ({
  user,
  currentCompany,
  companies,
}) => {
  const { showModal } = useAppContext();
  const [setUserCategoryMutation] = useSetUserCategoryMutation();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${user.fullName}`,
    config: [
      {
        name: 'Клиенты',
        href: `${ROUTE_CONSOLE}/${currentCompany?._id}/customers`,
      },
    ],
  };

  return (
    <ConsoleUserLayout companyId={`${currentCompany?._id}`} user={user} breadcrumbs={breadcrumbs}>
      <Inner>
        <FakeInput label={'Имя'} value={user.name} testId={'name'} />
        <FakeInput label={'Фамилия'} value={user.lastName} testId={'lastName'} />
        <FakeInput label={'Отчество'} value={user.secondName} testId={'lastName'} />
        <FakeInput label={'Отчество'} value={user.secondName} testId={'secondName'} />
        <FakeInput label={'Email'} value={user.email} testId={'email'} />
        <FakeInput label={'Телефон'} value={user.formattedPhone?.readable} testId={'phone'} />
        <FakeInput
          label={'Категория'}
          value={user.category?.name}
          testId={'category'}
          onClick={() => {
            showModal<SetUserCategoryModalInterface>({
              variant: SET_USER_CATEGORY_MODAL,
              props: {
                companies,
                companyId: `${currentCompany?._id}`,
                hideCompaniesSelect: true,
                userId: `${user._id}`,
              },
            });
          }}
          onClear={() => {
            showModal<ConfirmModalInterface>({
              variant: CONFIRM_MODAL,
              props: {
                testId: 'unset-user-category-modal',
                message: `Вы уверенны, что хотите убрать у пользователя категорию ${user.category?.name}?`,
                confirm: () => {
                  setUserCategoryMutation({
                    userId: `${user._id}`,
                    categoryId: `${user.category?._id}`,
                  }).catch(console.log);
                },
              },
            });
          }}
        />
      </Inner>
    </ConsoleUserLayout>
  );
};

interface UserDetailsPageInterface extends PagePropsInterface, UserDetailsConsumerInterface {}

const UserDetailsPage: NextPage<UserDetailsPageInterface> = ({
  pageUrls,
  pageCompany,
  ...props
}) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={pageCompany}>
      <UserDetailsConsumer {...props} currentCompany={pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserDetailsPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getConsoleInitialData({ context });

  const companyId = new ObjectId(`${query.companyId}`);
  const userId = new ObjectId(`${query.userId}`);
  if (!props) {
    return {
      notFound: true,
    };
  }

  const userAggregationResult = await usersCollection
    .aggregate<UserInterface>([
      {
        $match: {
          _id: userId,
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

      // get category
      {
        $lookup: {
          from: COL_USER_CATEGORIES,
          as: 'category',
          let: {
            categoryIds: '$categoryIds',
          },
          pipeline: [
            {
              $match: {
                companyId,
                $expr: {
                  $in: ['$_id', '$$categoryIds'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          category: {
            $arrayElemAt: ['$category', 0],
          },
        },
      },

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
    formattedPhone: {
      raw: phoneToRaw(userResult.phone),
      readable: phoneToReadable(userResult.phone),
    },
    category: userResult.category
      ? {
          ...userResult.category,
          name: getFieldStringLocale(userResult.category.nameI18n, props.sessionLocale),
        }
      : null,
  };

  // get companies list for modal
  const companiesAggregation = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: companyId,
        },
      },
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

export default UserDetailsPage;
