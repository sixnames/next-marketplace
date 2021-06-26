import Currency from 'components/Currency';
import Inner from 'components/Inner';
import Table, { TableColumn } from 'components/Table';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import * as React from 'react';

export interface ShopSyncErrorsInterface extends AppShopLayoutInterface {
  notSyncedProducts: NotSyncedProductInterface[];
}

const ShopSyncErrors: React.FC<ShopSyncErrorsInterface> = ({
  shop,
  notSyncedProducts,
  basePath,
  breadcrumbs,
}) => {
  const columns: TableColumn<NotSyncedProductInterface>[] = [
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'available',
      headTitle: 'В наличии',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'price',
      headTitle: 'Цена',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
  ];

  return (
    <AppShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <Inner testId={'shop-sync-errors-page'}>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<NotSyncedProductInterface>
            testIdKey={'name'}
            columns={columns}
            data={notSyncedProducts}
          />
        </div>
      </Inner>
    </AppShopLayout>
  );
};

export default ShopSyncErrors;
