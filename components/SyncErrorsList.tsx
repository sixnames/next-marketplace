import WpButton from 'components/button/WpButton';
import ContentItemControls from 'components/button/ContentItemControls';
import Currency from 'components/Currency';
import { CreateProductWithSyncErrorModalInterface } from 'components/Modal/CreateProductWithSyncErrorModal';
import { ProductSearchModalInterface } from 'components/Modal/ProductSearchModal';
import Pager from 'components/Pager';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL, PRODUCT_SEARCH_MODAL } from 'config/modalVariants';
import { AppPaginationInterface, NotSyncedProductInterface } from 'db/uiInterfaces';
import { useUpdateProductWithSyncError } from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { getNumWord } from 'lib/i18n';
import * as React from 'react';

export interface SyncErrorsListInterface {
  notSyncedProducts: AppPaginationInterface<NotSyncedProductInterface>;
  showShopName?: boolean;
  showControls?: boolean;
  companySlug: string;
}

const SyncErrorsList: React.FC<SyncErrorsListInterface> = ({
  notSyncedProducts,
  showShopName = true,
  showControls = true,
  companySlug,
}) => {
  const { showModal } = useMutationCallbacks({
    reload: true,
  });

  const [updateProductWithSyncErrorMutation] = useUpdateProductWithSyncError();

  const columns: WpTableColumn<NotSyncedProductInterface>[] = [
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => {
        const barcodeList = cellData as string[];
        return (
          <React.Fragment>
            {(barcodeList || []).map((barcode) => {
              return <div key={barcode}>{barcode}</div>;
            })}
          </React.Fragment>
        );
      },
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
              testId={`${dataItem.name}`}
              createTitle={'Найти или создать товар'}
              createHandler={() => {
                showModal<ProductSearchModalInterface>({
                  variant: PRODUCT_SEARCH_MODAL,
                  props: {
                    testId: 'products-search-modal',
                    createTitle: 'Выбрать',
                    subtitle: (
                      <div>
                        <div className='mb-6'>Вы ищите товар с названием {dataItem.name}</div>
                        <div className='mb-8'>
                          <WpButton
                            testId={'create-product'}
                            size={'small'}
                            onClick={() => {
                              showModal<CreateProductWithSyncErrorModalInterface>({
                                variant: CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL,
                                props: {
                                  companySlug,
                                  notSyncedProduct: dataItem,
                                },
                              });
                            }}
                          >
                            Создать товар
                          </WpButton>
                        </div>
                      </div>
                    ),
                    createHandler: (product) => {
                      updateProductWithSyncErrorMutation({
                        productId: `${product._id}`,
                        available: dataItem.available,
                        barcode: dataItem.barcode || [],
                        price: dataItem.price,
                        shopId: `${dataItem.shopId}`,
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

  const { docs, page, totalPages, totalDocs } = notSyncedProducts;

  const word = getNumWord(totalDocs, ['ошибка', 'ошибки', 'ошибок']);

  return (
    <div>
      {totalDocs > 0 ? (
        <div className='mb-4 text-secondary-text'>
          Всего {totalDocs} {word}
        </div>
      ) : null}
      <div className='overflow-x-auto overflow-y-hidden'>
        <WpTable<NotSyncedProductInterface> testIdKey={'name'} columns={columns} data={docs} />
      </div>
      <Pager page={page} totalPages={totalPages} />
    </div>
  );
};

export default SyncErrorsList;
