import { Form, Formik } from 'formik';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import UserMainFields from 'components/FormTemplates/UserMainFields';
import Inner from 'components/Inner';
import { SORT_DESC } from 'lib/config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { UpdateUserInputInterface } from 'db/dao/user/updateUser';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, RoleInterface, UserInterface } from 'db/uiInterfaces';
import { useUpdateUserMutation } from 'hooks/mutations/useUserMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsUserLayout from 'components/layout/cms/CmsUserLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateUserSchema } from 'validation/userSchema';

interface UserDetailsConsumerInterface {
  user: UserInterface;
  roles: RoleInterface[];
}

const UserDetailsConsumer: React.FC<UserDetailsConsumerInterface> = ({ user, roles }) => {
  const validationSchema = useValidationSchema({
    schema: updateUserSchema,
  });
  const { showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateUserMutation] = useUpdateUserMutation();

  const initialValues: UpdateUserInputInterface = {
    _id: `${user._id}`,
    name: user.name,
    lastName: user.lastName,
    secondName: user.secondName,
    email: user.email,
    phone: user.phone,
    roleId: `${user.roleId}`,
    notifications: user.notifications,
  };

  const links = getProjectLinks();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${user.fullName}`,
    config: [
      {
        name: 'Пользователи',
        href: links.cms.users.url,
      },
    ],
  };

  return (
    <CmsUserLayout user={user} breadcrumbs={breadcrumbs}>
      <Inner testId={'user-details-page'}>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            updateUserMutation({
              ...values,
              phone: phoneToRaw(values.phone),
            }).catch(console.log);
          }}
        >
          {() => {
            return (
              <Form noValidate>
                <UserMainFields roles={roles} />

                <FixedButtons>
                  <WpButton size={'small'} testId={'submit-user'} type={'submit'}>
                    Сохранить
                  </WpButton>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsUserLayout>
  );
};

interface UserDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    UserDetailsConsumerInterface {}

const UserDetailsPage: NextPage<UserDetailsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserDetailsPageInterface>> => {
  const { query } = context;
  const { userId } = query;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const rolesCollection = db.collection<RoleInterface>(COL_ROLES);

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
  };

  const rolesQueryResult = await rolesCollection
    .find(
      {},
      {
        projection: {
          slug: false,
        },
        sort: {
          _id: SORT_DESC,
        },
      },
    )
    .toArray();

  const roles = rolesQueryResult.map((role) => {
    return {
      ...role,
      name: getFieldStringLocale(role.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      user: castDbData(user),
      roles: castDbData(roles),
    },
  };
};

export default UserDetailsPage;
