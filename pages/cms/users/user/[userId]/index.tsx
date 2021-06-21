import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import UserMainFields from 'components/FormTemplates/UserMainFields';
import Inner from 'components/Inner';
import { SORT_DESC } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RoleInterface, UserInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateUserInput, useUpdateUserMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsUserLayout from 'layout/CmsLayout/CmsUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateUserSchema } from 'validation/userSchema';

interface UserDetailsConsumerInterface {
  user: UserInterface;
  roles: RoleInterface[];
}

const UserDetailsConsumer: React.FC<UserDetailsConsumerInterface> = ({ user, roles }) => {
  const validationSchema = useValidationSchema({
    schema: updateUserSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateUserMutation] = useUpdateUserMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateUser),
  });

  const initialValues: UpdateUserInput = {
    name: user.name,
    lastName: user.lastName,
    secondName: user.secondName,
    email: user.email,
    phone: user.phone,
    roleId: user.roleId,
    userId: user._id,
  };

  return (
    <CmsUserLayout user={user}>
      <Inner testId={'user-details-page'}>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            updateUserMutation({
              variables: {
                input: {
                  ...values,
                  phone: phoneToRaw(values.phone),
                },
              },
            }).catch(console.log);
          }}
        >
          {() => {
            return (
              <Form noValidate>
                <UserMainFields roles={roles} />

                <FixedButtons>
                  <Button size={'small'} testId={'submit-user'} type={'submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsUserLayout>
  );
};

interface UserDetailsPageInterface extends PagePropsInterface, UserDetailsConsumerInterface {}

const UserDetailsPage: NextPage<UserDetailsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <UserDetailsConsumer {...props} />
    </CmsLayout>
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
    .aggregate([
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
