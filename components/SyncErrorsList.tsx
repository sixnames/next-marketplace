import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Currency from 'components/Currency';
import { CreateProductWithSyncErrorModalInterface } from 'components/Modal/CreateProductWithSyncErrorModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal';
import Table, { TableColumn } from 'components/Table';
import { CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modalVariants';
import { NotSyncedProductInterface } from 'db/uiInterfaces';
import { useUpdateProductWithSyncErrorMutation } from 'generated/apolloComponents';
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
  const { showModal, onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [updateProductWithSyncErrorMutation] = useUpdateProductWithSyncErrorMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductWithSyncError),
    onError: onErrorCallback,
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
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.barcode}
              createTitle={'Найти или создать товар'}
              createHandler={() => {
                showModal<ProductSearchModalInterface>({
                  variant: PRODUCT_SEARCH_MODAL,
                  props: {
                    testId: 'products-search-modal',
                    createTitle: 'Выбрать',
                    subtitle: (
                      <div className='mb-8'>
                        <Button
                          testId={'create-product'}
                          size={'small'}
                          onClick={() => {
                            showModal<CreateProductWithSyncErrorModalInterface>({
                              variant: CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL,
                              props: {
                                notSyncedProduct: dataItem,
                              },
                            });
                          }}
                        >
                          Создать товар
                        </Button>
                      </div>
                    ),
                    createHandler: (product) => {
                      showLoading();
                      updateProductWithSyncErrorMutation({
                        variables: {
                          input: {
                            productId: product._id,
                            available: dataItem.available,
                            barcode: dataItem.barcode,
                            price: dataItem.price,
                            shopId: dataItem.shopId,
                          },
                        },
                      }).catch(console.log);
                    },
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
