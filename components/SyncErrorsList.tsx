import * as React from 'react';
import {
  CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL,
  PRODUCT_SEARCH_MODAL,
} from '../lib/config/modalVariants';
import { useAppContext } from './context/appContext';
import { AppPaginationInterface, NotSyncedProductInterface } from '../db/uiInterfaces';
import { useUpdateProductWithSyncError } from '../hooks/mutations/useProductMutations';
import { getNumWord } from '../lib/i18n';
import ContentItemControls from './button/ContentItemControls';
import WpButton from './button/WpButton';
import Currency from './Currency';
import FormattedDateTime from './FormattedDateTime';
import { CreateProductWithSyncErrorModalInterface } from './Modal/CreateProductWithSyncErrorModal';
import { ProductSearchModalInterface } from './Modal/ProductSearchModal';
import Pager from './Pager';
import WpTable, { WpTableColumn } from './WpTable';

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
  const { showModal } = useAppContext();
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
      render: ({ cellData }) => {
        return <div data-cy={cellData}>{cellData}</div>;
      },
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
      accessor: 'lastSyncedAt',
      headTitle: 'Последняя синхронизация',
      render: ({ cellData }) => <FormattedDateTime value={cellData} />,
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
