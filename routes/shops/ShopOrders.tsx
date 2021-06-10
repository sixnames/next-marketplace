import FormattedDateTime from 'components/FormattedDateTime/FormattedDateTime';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import Pager from 'components/Pager/Pager';
import Table, { TableColumn } from 'components/Table/Table';
import { ROUTE_CMS } from 'config/common';
import { OrderInterface } from 'db/uiInterfaces';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import { useRouter } from 'next/router';
import * as React from 'react';

export type ShopOrdersInterface = AppShopLayoutInterface;

const ShopOrders: React.FC<ShopOrdersInterface> = ({ shop, basePath }) => {
  const router = useRouter();

  const columns: TableColumn<OrderInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link
          testId={`order-${dataItem.itemId}-link`}
          href={`${ROUTE_CMS}/companies/${router.query.companyId}/shops/shop/${router.query.shopId}/orders/order/${dataItem._id}`}
        >
          {cellData}
        </Link>
      ),
    },
    {
      accessor: 'status',
      headTitle: 'Статус',
      render: ({ cellData }) => {
        return `${cellData.name}`;
      },
    },
    {
      accessor: 'createdAt',
      headTitle: 'Дата заказа',
      render: ({ cellData }) => {
        return <FormattedDateTime value={cellData} />;
      },
    },
    {
      accessor: 'productsCount',
      headTitle: 'Товаров',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer.shortName',
      headTitle: 'Заказчик',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'customer.formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => {
        return <LinkPhone value={cellData} />;
      },
    },
    {
      accessor: 'customer.email',
      headTitle: 'Email',
      render: ({ cellData }) => {
        return <LinkEmail value={cellData} />;
      },
    },
  ];

  return (
    <AppShopLayout shop={shop} basePath={basePath}>
      <Inner>
        <div data-cy={'shop-orders-list'}>
          <div className='overflow-x-auto'>
            <Table<OrderInterface>
              columns={columns}
              data={shop.orders}
              testIdKey={'itemId'}
              onRowDoubleClick={(dataItem) => {
                router
                  .push(
                    `${ROUTE_CMS}/companies/${router.query.companyId}/shops/shop/${router.query.shopId}/orders/order/${dataItem._id}`,
                  )
                  .catch((e) => {
                    console.log(e);
                  });
              }}
            />
          </div>
          <Pager page={1} setPage={() => undefined} totalPages={0} />
        </div>
      </Inner>
    </AppShopLayout>
  );
};

export default ShopOrders;
