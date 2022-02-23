import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleUserLayout from 'components/layout/console/ConsoleUserLayout';
import ConsoleOrderDetails, {
  CmsOrderDetailsBaseInterface,
} from 'components/order/ConsoleOrderDetails';
import { COL_ROLES, COL_USER_CATEGORIES } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getConsoleOrder } from 'db/ssr/orders/getConsoleOrder';
import { AppContentWrapperBreadCrumbs, CompanyInterface, UserInterface } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { getFullName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface UserOrderConsumerInterface extends CmsOrderDetailsBaseInterface {
  user: UserInterface;
  pageCompany: CompanyInterface;
}

const UserOrderConsumer: React.FC<UserOrderConsumerInterface> = ({
  user,
  order,
  orderStatuses,
  pageCompany,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany._id,
    userId: user._id,
    orderId: order._id,
  });

  const title = `Заказ №${order.orderId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Клиенты',
        href: links.console.companyId.users.url,
      },
      {
        name: `${user.fullName}`,
        href: links.console.companyId.users.user.userId.url,
      },
      {
        name: `Заказы`,
        href: links.console.companyId.users.user.userId.orders.url,
      },
    ],
  };

  const pageCompanySlug =
    pageCompany && pageCompany.domain ? pageCompany.slug : DEFAULT_COMPANY_SLUG;

  return (
    <ConsoleUserLayout user={user} breadcrumbs={breadcrumbs}>
      <ConsoleOrderDetails
        order={order}
        orderStatuses={orderStatuses}
        title={title}
        pageCompanySlug={pageCompanySlug}
      />
    </ConsoleUserLayout>
  );
};

interface UserOrderPageInterface
  extends GetConsoleInitialDataPropsInterface,
    UserOrderConsumerInterface {}

const UserOrderPage: NextPage<UserOrderPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserOrderConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserOrderPageInterface>> => {
  const { query } = context;
  const collections = await getDbCollections();
  const usersCollection = collections.usersCollection();
  const companyId = new ObjectId(`${query.companyId}`);
  const userId = new ObjectId(`${query.userId}`);
  const { props } = await getConsoleInitialData({ context });
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

  // get order
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

  return {
    props: {
      ...props,
      user: castDbData(user),
      order: castDbData(payload.order),
      orderStatuses: castDbData(payload.orderStatuses),
      pageCompany: castDbData(props.layoutProps.pageCompany),
    },
  };
};

export default UserOrderPage;
