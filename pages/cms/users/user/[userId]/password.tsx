import Button from 'components/button/Button';
import FormikInput from 'components/FormElements/Input/FormikInput';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { UserInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateUserPasswordMutation } from 'hooks/mutations/useUserMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsUserLayout from 'layout/cms/CmsUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface UserPasswordInterface {
  user: UserInterface;
}

const UserPasswordConsumer: React.FC<UserPasswordInterface> = ({ user }) => {
  const { showLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });
  const [updateUserPasswordMutation] = useUpdateUserPasswordMutation();

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Пароль`,
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

  return (
    <CmsUserLayout user={user} breadcrumbs={breadcrumbs}>
      <Inner testId={'user-password-page'}>
        <Formik
          initialValues={{
            newPassword: '',
            repeatPassword: '',
          }}
          onSubmit={({ newPassword, repeatPassword }) => {
            if (newPassword === repeatPassword) {
              showLoading();
              updateUserPasswordMutation({
                _id: `${user._id}`,
                newPassword,
              }).catch(console.log);
            } else {
              showErrorNotification({
                title: 'Введённые пароли не совпадают',
              });
            }
          }}
        >
          {() => {
            return (
              <Form>
                <FormikInput
                  name={'newPassword'}
                  testId={'newPassword'}
                  type={'password'}
                  label={'Новый пароль'}
                />
                <FormikInput
                  name={'repeatPassword'}
                  testId={'repeatPassword'}
                  type={'password'}
                  label={'Повторите пароль'}
                />
                <Button testId={'submit-password'} size={'small'} type={'submit'}>
                  Сохранить
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsUserLayout>
  );
};

interface UserPasswordPageInterface extends PagePropsInterface, UserPasswordInterface {}

const UserPasswordPage: NextPage<UserPasswordPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <UserPasswordConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserPasswordPageInterface>> => {
  const { query } = context;
  const { userId } = query;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);

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

  return {
    props: {
      ...props,
      user: castDbData(user),
    },
  };
};

export default UserPasswordPage;
