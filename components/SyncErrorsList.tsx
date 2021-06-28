import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Currency from 'components/Currency';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal';
import Table, { TableColumn } from 'components/Table';
import { PRODUCT_SEARCH_MODAL } from 'config/modalVariants';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';

export interface SyncErrorsListInterface {
  notSyncedProducts: NotSyncedProductInterface[];
  showShopName?: boolean;
  showControls?: boolean;
}

const SyncErrorsList: React.FC<SyncErrorsListInterface> = ({
  notSyncedProducts,
  showShopName = true,
  showControls = true,
}) => {
  const { showModal } = useMutationCallbacks({
    reload: true,
  });

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
      isHidden: !showControls,
      render: () => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              createTitle={'Найти или создать товар'}
              createHandler={() => {
                showModal<ProductSearchModalInterface>({
                  variant: PRODUCT_SEARCH_MODAL,
                  props: {
                    testId: 'products-search-modal',
                  },
                });
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
