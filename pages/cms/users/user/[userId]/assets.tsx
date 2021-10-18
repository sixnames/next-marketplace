import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { UserInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsUserLayout from 'layout/cms/CmsUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface UserAssetsInterface {
  user: UserInterface;
}

const UserAssetsConsumer: React.FC<UserAssetsInterface> = ({ user }) => {
  const { showErrorNotification, showLoading, hideLoading } = useMutationCallbacks({});
  const router = useRouter();
  const { avatar } = user;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Изображения`,
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
      <Inner testId={'user-assets-page'}>
        <Formik
          enableReinitialize
          initialValues={{ avatar: avatar ? [avatar.url] : [] }}
          onSubmit={(values) => console.log(values)}
        >
          {() => {
            return (
              <Form>
                <FormikImageUpload
                  label={'Аватар пользователя'}
                  name={'avatar'}
                  testId={'avatar'}
                  width={'10rem'}
                  height={'10rem'}
                  setImageHandler={(files) => {
                    if (files) {
                      showLoading();
                      const formData = new FormData();
                      formData.append('avatar', files[0]);
                      formData.append('userId', `${user._id}`);

                      fetch('/api/user/update-user-avatar', {
                        method: 'POST',
                        body: formData,
                      })
                        .then((res) => {
                          return res.json();
                        })
                        .then((json) => {
                          if (json.success) {
                            router.reload();
                            return;
                          }
                          hideLoading();
                          showErrorNotification({ title: json.message });
                        })
                        .catch(() => {
                          hideLoading();
                          showErrorNotification({ title: 'error' });
                        });
                    }
                  }}
                />
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsUserLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, UserAssetsInterface {}

const UserAssetsPage: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <UserAssetsConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
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

export default UserAssetsPage;
