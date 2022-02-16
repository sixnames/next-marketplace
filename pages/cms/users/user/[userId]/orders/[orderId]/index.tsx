import CmsUserLayout from 'components/layout/cms/CmsUserLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleOrderDetails, {
  CmsOrderDetailsBaseInterface,
} from 'components/order/ConsoleOrderDetails';
import { COL_ROLES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getConsoleOrder } from 'db/ssr/orders/getConsoleOrder';
import { AppContentWrapperBreadCrumbs, UserInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFullName } from 'lib/nameUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface UserOrderConsumerInterface extends CmsOrderDetailsBaseInterface {
  user: UserInterface;
}

const UserOrdersConsumer: React.FC<UserOrderConsumerInterface> = ({
  user,
  order,
  orderStatuses,
}) => {
  const title = `Заказ №${order.itemId}`;
  const links = getProjectLinks({
    userId: user._id,
    orderId: order._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Пользователи',
        href: links.cms.users.url,
      },
      {
        name: `${user.fullName}`,
        href: links.cms.users.user.userId.url,
      },
      {
        name: `Заказы`,
        href: links.cms.users.user.userId.orders.url,
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
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();

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
