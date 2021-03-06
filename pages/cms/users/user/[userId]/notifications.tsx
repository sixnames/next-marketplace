import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import CmsUserLayout from 'components/layout/cms/CmsUserLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { COL_ROLES } from 'db/collectionNames';
import { UpdateUserInputInterface } from 'db/dao/user/updateUser';
import { NotificationConfigModel, UserNotificationsModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  NotificationConfigInterface,
  UserInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateUserMutation } from 'hooks/mutations/useUserMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getUserNotifications } from 'lib/getUserNotificationsTemplate';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFullName } from 'lib/nameUtils';
import { phoneToRaw } from 'lib/phoneUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { get, omit, set } from 'lodash';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { updateUserSchema } from 'validation/userSchema';

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

  const links = getProjectLinks({
    userId: user._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `????????????????????`,
    config: [
      {
        name: '????????????????????????',
        href: links.cms.users.url,
      },
      {
        name: `${user.fullName}`,
        href: links.cms.users.user.userId.url,
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
                    ??????????????????
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
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();

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
