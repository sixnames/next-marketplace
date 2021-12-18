import FormattedDateTime from 'components/FormattedDateTime';
import Inner from 'components/Inner';
import WpLink from 'components/Link/WpLink';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { ConsoleShopLayoutInterface, OrderInterface } from 'db/uiInterfaces';
import ConsoleShopLayout from 'layout/console/ConsoleShopLayout';
import { useRouter } from 'next/router';
import * as React from 'react';

export type ShopOrdersInterface = ConsoleShopLayoutInterface;

const ShopOrders: React.FC<ShopOrdersInterface> = ({ shop, basePath, breadcrumbs }) => {
  const router = useRouter();

  const columns: WpTableColumn<OrderInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <WpLink
          testId={`order-${dataItem.itemId}-link`}
          href={`${basePath}/${shop._id}/shop-orders/${dataItem._id}`}
        >
          {cellData}
        </WpLink>
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
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <Inner>
        <div data-cy={'shop-orders-list'}>
          <div className='overflow-x-auto'>
            <WpTable<OrderInterface>
              columns={columns}
              data={shop.orders}
              testIdKey={'itemId'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${basePath}/${shop._id}/shop-orders/${dataItem._id}`).catch((e) => {
                  console.log(e);
                });
              }}
            />
          </div>
          <Pager page={1} totalPages={0} />
        </div>
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopOrders;
