import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Currency from 'components/Currency';
import Table, { TableColumn } from 'components/Table';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import * as React from 'react';

export interface SyncErrorsListInterface {
  notSyncedProducts: NotSyncedProductInterface[];
  showShopName?: boolean;
}

const SyncErrorsList: React.FC<SyncErrorsListInterface> = ({
  notSyncedProducts,
  showShopName = true,
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
    {
      accessor: 'shop.name',
      headTitle: 'Магазин',
      render: ({ cellData }) => cellData,
      isHidden: !showShopName,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              createTitle={'Создать товар'}
              createHandler={() => {
                console.log(dataItem);
              }}
              deleteTitle={'Удалить ошибку'}
              deleteHandler={() => {
                console.log(dataItem);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className='overflow-x-auto overflow-y-hidden'>
      <Table<NotSyncedProductInterface>
        testIdKey={'name'}
        columns={columns}
        data={notSyncedProducts}
      />
    </div>
  );
};

export default SyncErrorsList;
