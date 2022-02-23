import { ConsoleShopLayoutInterface, OrderInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import { useRouter } from 'next/router';
import * as React from 'react';
import FormattedDateTime from '../FormattedDateTime';
import Inner from '../Inner';
import ConsoleShopLayout from '../layout/console/ConsoleShopLayout';
import LinkEmail from '../Link/LinkEmail';
import LinkPhone from '../Link/LinkPhone';
import WpLink from '../Link/WpLink';
import Pager from '../Pager';
import WpTable, { WpTableColumn } from '../WpTable';

export type ShopOrdersInterface = ConsoleShopLayoutInterface;

const ShopOrders: React.FC<ShopOrdersInterface> = ({ shop, breadcrumbs }) => {
  const router = useRouter();
  const basePath = useBasePath('shop-orders');
  const columns: WpTableColumn<OrderInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => {
        return (
          <WpLink testId={`order-${dataItem.itemId}-link`} href={`${basePath}/${dataItem._id}`}>
            {cellData}
          </WpLink>
        );
      },
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
    <ConsoleShopLayout shop={shop} breadcrumbs={breadcrumbs}>
      <Inner>
        <div data-cy={'shop-orders-list'}>
          <div className='overflow-x-auto'>
            <WpTable<OrderInterface>
              columns={columns}
              data={shop.orders}
              testIdKey={'itemId'}
              onRowDoubleClick={(dataItem) => {
                router.push(`${basePath}/${dataItem._id}`).catch(console.log);
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
