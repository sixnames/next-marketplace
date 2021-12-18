import WpButton from 'components/button/WpButton';
import FixedButtons from 'components/button/FixedButtons';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { UpdateUserInputInterface } from 'db/dao/user/updateUser';
import { NotificationConfigModel, UserNotificationsModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  NotificationConfigInterface,
  UserInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateUserMutation } from 'hooks/mutations/useUserMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsUserLayout from 'layout/cms/CmsUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getUserNotifications } from 'lib/getUserNotificationsTemplate';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateUserSchema } from 'validation/userSchema';
import { get, set, omit } from 'lodash';

interface UserNotificationInputInterface {
  config: NotificationConfigInterface;
  fieldName: string;
}

const UserNotificationInput: React.FC<UserNotificationInputInterface> = ({ config, fieldName }) => {
  return (
    <InputLine labelTag={'div'} label={config.name}>
      <FormikCheckboxLine low label={'Email'} name={`notifications.${fieldName}.email`} />
      <FormikCheckboxLine low label={'SMS'} name={`notifications.${fieldName}.sms`} />
    </InputLine>
  );
};

interface UseNotificationsConsumerInterface {
  user: UserInterface;
}

const UserNotificationsConsumer: React.FC<UseNotificationsConsumerInterface> = ({ user }) => {
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Оповещения`,
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
      <Inner testId={'user-notifications-page'}>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            updateUserMutation({
              ...values,
              phone: phoneToRaw(values.phone),
              notifications: Object.keys(values.notifications || {}).reduce(
                (acc: UserNotificationsModel, key) => {
                  const config: NotificationConfigModel = get(values.notifications, key);
                  if (!config) {
                    return acc;
                  }
                  set(acc, key, omit(config, 'name'));
                  return acc;
                },
                {},
              ),
            }).catch(console.log);
          }}
        >
          {({ values }) => {
            return (
              <Form>
                {Object.keys(values.notifications || {}).map((fieldName) => {
                  const config = get(values.notifications, fieldName);
                  if (!config) {
                    return null;
                  }
                  return (
                    <UserNotificationInput config={config} key={fieldName} fieldName={fieldName} />
                  );
                })}
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

interface UserNotificationsPageInterface
  extends GetAppInitialDataPropsInterface,
    UseNotificationsConsumerInterface {}

const UserNotificationsPage: NextPage<UserNotificationsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserNotificationsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserNotificationsPageInterface>> => {
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
    notifications: getUserNotifications({
      userNotifications: userResult.notifications,
      locale: props.sessionLocale,
    }),
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

export default UserNotificationsPage;
