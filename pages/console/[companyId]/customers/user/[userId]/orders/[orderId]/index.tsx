import CmsOrderDetails from 'components/order/CmsOrderDetails';
import { ROUTE_CONSOLE } from 'config/common';
import {
  COL_ORDER_CUSTOMERS,
  COL_ORDER_PRODUCTS,
  COL_ORDER_STATUSES,
  COL_ORDERS,
  COL_ROLES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
  COL_USER_CATEGORIES,
  COL_USERS,
} from 'db/collectionNames';
import { shopProductFieldsPipeline } from 'db/dao/constantPipelines';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, OrderInterface, UserInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import ConsoleUserLayout from 'layout/console/ConsoleUserLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName } from 'lib/nameUtils';
import { castOrderStatus } from 'lib/orderUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { generateSnippetTitle } from 'lib/titleUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface UserOrderConsumerInterface {
  user: UserInterface;
  order: OrderInterface;
  currentCompany?: CompanyInterface | null;
}

const UserOrderConsumer: React.FC<UserOrderConsumerInterface> = ({
  user,
  order,
  currentCompany,
}) => {
  const basePath = `${ROUTE_CONSOLE}/${currentCompany?._id}/customers`;
  const title = `Заказ №${order.orderId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: title,
    config: [
      {
        name: 'Клиенты',
        href: basePath,
      },
      {
        name: `${user.fullName}`,
        href: `${basePath}/user/${user._id}`,
      },
      {
        name: `Заказы`,
        href: `${basePath}/user/${user._id}/orders`,
      },
    ],
  };

  return (
    <ConsoleUserLayout companyId={`${currentCompany?._id}`} user={user} breadcrumbs={breadcrumbs}>
      <CmsOrderDetails order={order} title={title} />
    </ConsoleUserLayout>
  );
};

interface UserOrderPageInterface extends PagePropsInterface, UserOrderConsumerInterface {}

const UserOrderPage: NextPage<UserOrderPageInterface> = ({
  layoutProps,
  pageCompany,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserOrderConsumer {...props} currentCompany={pageCompany} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserOrderPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const usersCollection = db.collection<UserInterface>(COL_USERS);
  const ordersCollection = db.collection<OrderInterface>(COL_ORDERS);

  const { props } = await getConsoleInitialData({ context });

  const companyId = new ObjectId(`${query.companyId}`);
  const orderId = new ObjectId(`${query.orderId}`);

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

  // get order
  // get order
  const orderAggregationResult = await ordersCollection
    .aggregate<OrderInterface>([
      {
        $match: {
          _id: orderId,
        },
      },
      {
        $lookup: {
          from: COL_ORDER_STATUSES,
          as: 'status',
          localField: 'statusId',
          foreignField: '_id',
        },
      },
      {
        $lookup: {
          from: COL_ORDER_CUSTOMERS,
          as: 'customer',
          localField: '_id',
          foreignField: 'orderId',
        },
      },
      {
        $lookup: {
          from: COL_SHOPS,
          as: 'shop',
          let: { shopId: '$shopId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$shopId', '$_id'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          status: {
            $arrayElemAt: ['$status', 0],
          },
          customer: {
            $arrayElemAt: ['$customer', 0],
          },
          shop: {
            $arrayElemAt: ['$shop', 0],
          },
        },
      },
      {
        $lookup: {
          from: COL_ORDER_PRODUCTS,
          as: 'products',
          let: { orderId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$orderId', '$orderId'],
                },
              },
            },
            {
              $lookup: {
                from: COL_SHOP_PRODUCTS,
                as: 'shopProduct',
                let: { shopProductId: '$shopProductId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$$shopProductId', '$_id'],
                      },
                    },
                  },
                ],
              },
            },
            ...shopProductFieldsPipeline('$productId'),
            {
              $lookup: {
                from: COL_ORDER_STATUSES,
                as: 'status',
                localField: 'statusId',
                foreignField: '_id',
              },
            },
            {
              $addFields: {
                status: {
                  $arrayElemAt: ['$status', 0],
                },
                shopProduct: {
                  $arrayElemAt: ['$shopProduct', 0],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const initialOrder = orderAggregationResult[0];

  if (!initialOrder) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const order: OrderInterface = {
    ...initialOrder,
    totalPrice: initialOrder.products?.reduce((acc: number, { totalPrice }) => {
      return acc + totalPrice;
    }, 0),
    status: initialOrder.status
      ? {
          ...initialOrder.status,
          name: getFieldStringLocale(initialOrder.status.nameI18n, locale),
        }
      : null,
    products: initialOrder.products?.map((orderProduct) => {
      // title
      const snippetTitle = generateSnippetTitle({
        locale,
        brand: orderProduct.product?.brand,
        rubricName: getFieldStringLocale(orderProduct.product?.rubric?.nameI18n, locale),
        showRubricNameInProductTitle: orderProduct.product?.rubric?.showRubricNameInProductTitle,
        showCategoryInProductTitle: orderProduct.product?.rubric?.showCategoryInProductTitle,
        attributes: orderProduct.product?.attributes || [],
        categories: orderProduct.product?.categories,
        titleCategoriesSlugs: orderProduct.product?.titleCategoriesSlugs,
        originalName: `${orderProduct.product?.originalName}`,
        defaultGender: `${orderProduct.product?.gender}`,
      });

      return {
        ...orderProduct,
        status: castOrderStatus({
          initialStatus: orderProduct.status,
          locale: props.sessionLocale,
        }),
        product: orderProduct.product
          ? {
              ...orderProduct.product,
              snippetTitle,
            }
          : null,
      };
    }),
    customer: initialOrder.customer
      ? {
          ...initialOrder.customer,
          fullName: getFullName(initialOrder.customer),
          formattedPhone: {
            raw: phoneToRaw(initialOrder.customer.phone),
            readable: phoneToReadable(initialOrder.customer.phone),
          },
        }
      : null,
  };

  return {
    props: {
      ...props,
      user: castDbData(user),
      order: castDbData(order),
    },
  };
};

export default UserOrderPage;
