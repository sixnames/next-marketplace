import ConsoleOrderDetails, {
  CmsOrderDetailsBaseInterface,
} from 'components/order/ConsoleOrderDetails';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { UserInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsUserLayout from 'layout/cms/CmsUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { getConsoleOrder } from 'lib/orderUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface UserOrderConsumerInterface extends CmsOrderDetailsBaseInterface {
  user: UserInterface;
}

const UserOrdersConsumer: React.FC<UserOrderConsumerInterface> = ({
  user,
  order,
  orderStatuses,
}) => {
  const title = `Заказ №${order.itemId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Пользователи',
        href: `${ROUTE_CMS}/users`,
      },
      {
        name: `${user.fullName}`,
        href: `${ROUTE_CMS}/users/user/${user._id}`,
      },
      {
        name: `Заказы`,
        href: `${ROUTE_CMS}/users/user/${user._id}/orders`,
      },
    ],
  };

  return (
    <CmsUserLayout user={user} breadcrumbs={breadcrumbs}>
      <ConsoleOrderDetails
        order={order}
        title={title}
        orderStatuses={orderStatuses}
        pageCompanySlug={DEFAULT_COMPANY_SLUG}
      />
    </CmsUserLayout>
  );
};

interface UserOrderInterface extends GetAppInitialDataPropsInterface, UserOrderConsumerInterface {}

const UserOrderPage: NextPage<UserOrderInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserOrdersConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserOrderInterface>> => {
  const { query } = context;
  const { userId, orderId } = query;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);

  const { props } = await getAppInitialData({ context });
  if (!props || !userId || !orderId) {
    return {
      notFound: true,
    };
  }

  // get user
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

  const locale = props.sessionLocale;
  const payload = await getConsoleOrder({
    locale,
    orderId: `${query.orderId}`,
  });
  if (!payload) {
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
      order: castDbData(payload.order),
      orderStatuses: castDbData(payload.orderStatuses),
    },
  };
};

export default UserOrderPage;
